# Locked Notes Plugin for Obsidian

**Prevent accidental edits with intentional note interactions**

Ever accidentally modified an important document while scrolling through it? Tired of inadvertent changes messing up your pristine reference materials? The Locked Notes plugin brings a gentler version of modal editing to Obsidian – notes default to preview mode, and you explicitly enter edit mode when needed.

## 🎯 Problem Solved

When using Obsidian's default settings, it's easy to accidentally modify notes while reading them. This is particularly frustrating with:
- Important documentation or reference materials
- Notes you want to keep pristine
- Shared knowledge bases where accidental changes affect timestamps

## Demo

![](https://preslav.me/img/obsidian-locked-notes.gif)

## ✨ Key Features

- **🔒 Auto-Lock**: Notes automatically open in preview mode
- **👆 Double-Click to Edit**: Simple double-click anywhere to unlock and start editing
- **⌨️ Escape to Lock**: Press `ESC` while editing to return to preview mode
- **🎨 Visual Indicators**: Color-coded lock/unlock button in the note header
  - Red lock icon = Note is locked (preview mode)
  - Green unlock icon = Note is unlocked (edit mode)
- **🎯 Per-Note Control**: Each note's lock state is tracked individually

## 🚀 Installation

Locked Notes is not yet published in the Obsidian community plugins directory. You can only install it manually for now.

### Development Installation (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/preslavrachev/obsidian-locked-notes.git
   cd obsidian-locked-notes
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the plugin**
   ```bash
   # For development (watch mode)
   npm run dev

   # For production build
   npm run build
   ```

4. **Manual installation**
   - Create the plugin directory in your vault: `VaultFolder/.obsidian/plugins/obsidian-locked-notes/`
   - Copy these files to the plugin directory:
     - `main.js`
     - `manifest.json`

5. **Enable the plugin**
   - Open Obsidian
   - Go to Settings → Community plugins
   - Find "Locked Notes" and enable it

## 🧠 Philosophy

This plugin embodies the principle of **intentional editing** – creating a clear distinction between consuming and creating information. It's inspired by modal editors like Vim but designed to be approachable for all users.

## ❓ FAQ

**Q: How is this different from Obsidian's default preview/edit modes or setting my vault to read-only?**

A: This plugin is essentially a more intuitive interface layer on top of Obsidian's existing preview/edit functionality. While you can already use Ctrl+E or vault-wide read-only settings, this plugin offers:
- **Faster transitions**: Double-click exactly where you want to edit (no keyboard shortcuts needed)
- **Contextual editing**: Click-to-edit at the precise location rather than general mode switching
- **VIM-inspired workflow**: Escape key for quick return to reading mode
- **Per-note flexibility**: Individual note states rather than vault-wide settings

Think of it as a more fluid, mouse-friendly alternative to keyboard shortcuts and global settings.

**Q: Why not just use Ctrl+E?**

A: You absolutely can! This plugin simply provides an alternative interaction pattern that some users find more natural - particularly the double-click-to-edit behavior that's common in many applications.

## ⚠️ Known Limitations

- Lock state doesn't persist between Obsidian sessions
- Only works with Markdown notes (by design)
- Replaces Obsidian's default mode switcher button

## 📝 License

MIT License - feel free to modify and distribute as needed.

## ☕ Support

If you find this plugin useful, consider [buying me a coffee](https://p5v.gumroad.com/coffee)!

---

**Author**: [Preslav Rachev](https://preslav.me)
**Version**: 0.1.0
**Min Obsidian Version**: 0.15.0
