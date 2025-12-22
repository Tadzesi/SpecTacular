[spectacular-dashboard-webview](../README.md) / components/editor/extensions/MarkdownSerializer

# Module: components/editor/extensions/MarkdownSerializer

## Table of contents

### Functions

- [postprocessToMarkdown](components_editor_extensions_MarkdownSerializer.md#postprocesstomarkdown)
- [preprocessMarkdown](components_editor_extensions_MarkdownSerializer.md#preprocessmarkdown)
- [tiptapToMarkdown](components_editor_extensions_MarkdownSerializer.md#tiptaptomarkdown)

## Functions

### postprocessToMarkdown

▸ **postprocessToMarkdown**(`html`): `string`

Post-process HTML content from TipTap back to markdown

#### Parameters

| Name | Type |
| :------ | :------ |
| `html` | `string` |

#### Returns

`string`

#### Defined in

[components/editor/extensions/MarkdownSerializer.ts:113](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/webview/src/components/editor/extensions/MarkdownSerializer.ts#L113)

___

### preprocessMarkdown

▸ **preprocessMarkdown**(`markdown`): `string`

Pre-process markdown content to convert custom syntax to HTML
that TipTap can parse, then post-process when serializing back

#### Parameters

| Name | Type |
| :------ | :------ |
| `markdown` | `string` |

#### Returns

`string`

#### Defined in

[components/editor/extensions/MarkdownSerializer.ts:84](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/webview/src/components/editor/extensions/MarkdownSerializer.ts#L84)

___

### tiptapToMarkdown

▸ **tiptapToMarkdown**(`editor`): `string`

Convert TipTap JSON content to clean markdown string

#### Parameters

| Name | Type |
| :------ | :------ |
| `editor` | `Object` |
| `editor.getHTML` | () => `string` |

#### Returns

`string`

#### Defined in

[components/editor/extensions/MarkdownSerializer.ts:139](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/webview/src/components/editor/extensions/MarkdownSerializer.ts#L139)
