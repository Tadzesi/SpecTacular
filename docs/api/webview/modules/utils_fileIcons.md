[spectacular-dashboard-webview](../README.md) / utils/fileIcons

# Module: utils/fileIcons

## Table of contents

### Type Aliases

- [FileIconType](utils_fileIcons.md#fileicontype)

### Functions

- [ChevronIcon](utils_fileIcons.md#chevronicon)
- [FileIcon](utils_fileIcons.md#fileicon)
- [FolderIcon](utils_fileIcons.md#foldericon)
- [getFileIconColor](utils_fileIcons.md#getfileiconcolor)
- [getFileIconType](utils_fileIcons.md#getfileicontype)

## Type Aliases

### FileIconType

Ƭ **FileIconType**: ``"spec"`` \| ``"readme"`` \| ``"changelog"`` \| ``"markdown"`` \| ``"folder"`` \| ``"folder-open"``

#### Defined in

[utils/fileIcons.tsx:3](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/webview/src/utils/fileIcons.tsx#L3)

## Functions

### ChevronIcon

▸ **ChevronIcon**(`«destructured»`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `className?` | `string` |
| › `isExpanded?` | `boolean` |

#### Returns

`Element`

#### Defined in

[utils/fileIcons.tsx:74](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/webview/src/utils/fileIcons.tsx#L74)

___

### FileIcon

▸ **FileIcon**(`«destructured»`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `className?` | `string` |
| › `type` | [`FileIconType`](utils_fileIcons.md#fileicontype) |

#### Returns

`Element`

#### Defined in

[utils/fileIcons.tsx:45](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/webview/src/utils/fileIcons.tsx#L45)

___

### FolderIcon

▸ **FolderIcon**(`«destructured»`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `className?` | `string` |
| › `isOpen?` | `boolean` |

#### Returns

`Element`

#### Defined in

[utils/fileIcons.tsx:30](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/webview/src/utils/fileIcons.tsx#L30)

___

### getFileIconColor

▸ **getFileIconColor**(`iconType`, `isDark`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `iconType` | [`FileIconType`](utils_fileIcons.md#fileicontype) |
| `isDark` | `boolean` |

#### Returns

`string`

#### Defined in

[utils/fileIcons.tsx:17](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/webview/src/utils/fileIcons.tsx#L17)

___

### getFileIconType

▸ **getFileIconType**(`filePath`, `isFolder`, `isExpanded?`): [`FileIconType`](utils_fileIcons.md#fileicontype)

#### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |
| `isFolder` | `boolean` |
| `isExpanded?` | `boolean` |

#### Returns

[`FileIconType`](utils_fileIcons.md#fileicontype)

#### Defined in

[utils/fileIcons.tsx:5](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/webview/src/utils/fileIcons.tsx#L5)
