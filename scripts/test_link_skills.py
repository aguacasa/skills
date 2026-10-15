import tempfile
import unittest
from pathlib import Path

from link_skills import sync


class LinkSkillsTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.base = Path(self.temp.name)
        self.root = self.base / "repo"
        self.home = self.base / "home"
        self.source = self.root / "skills/demo"
        self.source.mkdir(parents=True)
        (self.source / "SKILL.md").write_text("demo")

    def test_preview_then_idempotent_link_and_live_edit(self):
        target = self.home / ".agents/skills/demo"
        self.assertEqual(sync(self.root, self.home), 0)
        self.assertFalse(target.exists())
        self.assertEqual(sync(self.root, self.home, apply=True), 0)
        self.assertEqual(sync(self.root, self.home, apply=True), 0)
        (self.source / "SKILL.md").write_text("updated")
        self.assertEqual((target / "SKILL.md").read_text(), "updated")
        self.assertEqual((self.home / ".claude/skills/demo").resolve(), self.source.resolve())

    def test_conflict_prevents_partial_install(self):
        target = self.home / ".claude/skills/demo"
        target.mkdir(parents=True)
        (target / "SKILL.md").write_text("different")
        self.assertEqual(sync(self.root, self.home, apply=True, adopt=True), 1)
        self.assertFalse((self.home / ".agents/skills/demo").exists())
        self.assertEqual((target / "SKILL.md").read_text(), "different")

    def test_identical_legacy_install_is_backed_up(self):
        target = self.home / ".codex/skills/demo"
        target.mkdir(parents=True)
        (target / "SKILL.md").write_text("demo")
        self.assertEqual(sync(self.root, self.home, apply=True, adopt=True), 0)
        self.assertTrue(target.is_symlink())
        self.assertFalse((self.home / ".agents/skills/demo").exists())
        backups = list((self.home / ".local/state/aguacasa-skills/backups").rglob("SKILL.md"))
        self.assertEqual(len(backups), 1)
        self.assertEqual(backups[0].read_text(), "demo")

    def test_foreign_symlink_is_preserved(self):
        target = self.home / ".agents/skills/demo"
        target.parent.mkdir(parents=True)
        target.symlink_to(self.base / "missing")
        self.assertEqual(sync(self.root, self.home, apply=True, adopt=True), 1)
        self.assertTrue(target.is_symlink())


if __name__ == "__main__":
    unittest.main()
