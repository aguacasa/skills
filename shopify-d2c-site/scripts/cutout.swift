// Usage: swift cutout.swift <input.jpg> <output.png> [maxSide=1400]
// macOS only. Isolates the foreground subject with Apple Vision (no network, no model download)
// and writes a transparent PNG cropped to the subject. Works best on product shots on plain backgrounds.
import Foundation
import Vision
import CoreImage
import ImageIO

let args = CommandLine.arguments
let input = URL(fileURLWithPath: args[1])
let output = URL(fileURLWithPath: args[2])
let maxSize = CGFloat(Double(args.count > 3 ? args[3] : "1400") ?? 1400)

guard let src = CGImageSourceCreateWithURL(input as CFURL, nil),
      let cg = CGImageSourceCreateImageAtIndex(src, 0, nil) else {
  fatalError("Could not load \(input.path)")
}

let handler = VNImageRequestHandler(cgImage: cg)
let request = VNGenerateForegroundInstanceMaskRequest()
try handler.perform([request])
guard let observation = request.results?.first else { fatalError("No subject found in \(input.path)") }

let buffer = try observation.generateMaskedImage(
  ofInstances: observation.allInstances, from: handler, croppedToInstancesExtent: true)
var image = CIImage(cvPixelBuffer: buffer)

let longest = max(image.extent.width, image.extent.height)
if longest > maxSize {
  let scale = maxSize / longest
  let filter = CIFilter(name: "CILanczosScaleTransform")!
  filter.setValue(image, forKey: kCIInputImageKey)
  filter.setValue(scale, forKey: kCIInputScaleKey)
  filter.setValue(1.0, forKey: kCIInputAspectRatioKey)
  image = filter.outputImage!
}

let context = CIContext()
try context.writePNGRepresentation(
  of: image, to: output, format: .RGBA8, colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!)
print("\(output.lastPathComponent) \(Int(image.extent.width))x\(Int(image.extent.height))")
