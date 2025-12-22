# Webview API Reference

Auto-generated API documentation for the SpecTacular Webview (React + TypeScript).

## Overview

The webview is a standalone React application built with Vite, TipTap editor, and Tailwind CSS. It provides the rich editing interface within VS Code's webview panel.

## Main Components

### Application

- [App](modules/App.md) - Main React application component

### UI Components

- [Breadcrumb](modules/components_Breadcrumb.md) - Navigation breadcrumb
- [ContentArea](modules/components_ContentArea.md) - Main content editor area
- [FileTree](modules/components_FileTree.md) - File tree sidebar
- [FileTreeItem](modules/components_FileTreeItem.md) - Individual tree items
- [Header](modules/components_Header.md) - Application header
- [MarkdownRenderer](modules/components_MarkdownRenderer.md) - Read-only markdown preview
- [ResizeHandle](modules/components_ResizeHandle.md) - Sidebar resize handle
- [Sidebar](modules/components_Sidebar.md) - File navigation sidebar
- [ThemeToggle](modules/components_ThemeToggle.md) - Dark/light theme switcher

### Editor Components

- [EditorToolbar](modules/components_editor_EditorToolbar.md) - WYSIWYG editor toolbar
- [WysiwygEditor](modules/components_editor_WysiwygEditor.md) - TipTap rich text editor
- [MarkdownSerializer](modules/components_editor_extensions_MarkdownSerializer.md) - Markdown serialization
- [StatusTag](modules/components_editor_extensions_StatusTag.md) - Custom status tag extension
- [Wikilink](modules/components_editor_extensions_Wikilink.md) - Custom wikilink extension

### Custom Hooks

- [useFileTree](modules/hooks_useFileTree.md) - File tree state management
- [useFileWatcher](modules/hooks_useFileWatcher.md) - Real-time file watching
- [useNavigationHistory](modules/hooks_useNavigationHistory.md) - Navigation history
- [useTheme](modules/hooks_useTheme.md) - Theme management

### Utilities

- [fileIcons](modules/utils_fileIcons.md) - File icon mappings
- [pathUtils](modules/utils_pathUtils.md) - Path manipulation utilities
- [vscodeApi](modules/vscodeApi.md) - VS Code API bridge

### Type Definitions

- [types](modules/types.md) - TypeScript type definitions

## Related Documentation

- [Webview Architecture](/SpecTacular/architecture/webview)
- [Extension Features](/SpecTacular/guide/extension/features)
- [Development Setup](/SpecTacular/development/setup)
