# Changelog

All notable changes to the SpecTacular Dashboard extension will be documented in this file.

## [1.6.6] - 2024-12-22

### Fixed
- **Nested List Rendering**: Fixed critical issue where nested markdown lists were rendering as flat lists in the webview editor
  - Integrated `marked` library for proper CommonMark-compliant markdown-to-HTML conversion
  - Added markdown preprocessing with list indentation normalization (3-space standard)
  - Updated TipTap configuration with explicit list extension settings
  - Lists now properly display hierarchical structure matching VS Code's native markdown preview

### Changed
- Improved markdown serialization flow for better nested list support
- Enhanced list item detection and preservation in preprocessing
- Added comprehensive unit tests for nested list handling (20 tests)

### Technical Details
- Replaced reliance on `tiptap-markdown` v0.9.0 parsing with `marked` library
- Modified content loading to convert markdown to HTML before TipTap processing
- Preserved existing status tag and wikilink custom syntax functionality

## [1.6.5] - Previous Release

### Features
- Real-time markdown specification viewer
- File monitoring and auto-refresh
- Custom syntax support (#status/done tags, [[wikilinks]])
- Task status auto-update based on acceptance criteria
- WYSIWYG markdown editor with TipTap
- Tree view for spec files
- Dark theme compatible

---

## Version Notes

**[1.6.6]** - Bug fix release focusing on nested list rendering
**[1.6.5]** - Stable release with core features
