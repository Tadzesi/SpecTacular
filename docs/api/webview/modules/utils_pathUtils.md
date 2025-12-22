[spectacular-dashboard-webview](../README.md) / utils/pathUtils

# Module: utils/pathUtils

## Table of contents

### Functions

- [getDirectory](utils_pathUtils.md#getdirectory)
- [getExtension](utils_pathUtils.md#getextension)
- [getFileName](utils_pathUtils.md#getfilename)
- [getPathSegments](utils_pathUtils.md#getpathsegments)
- [getRelativePath](utils_pathUtils.md#getrelativepath)
- [isChangelogFile](utils_pathUtils.md#ischangelogfile)
- [isMarkdownFile](utils_pathUtils.md#ismarkdownfile)
- [isReadmeFile](utils_pathUtils.md#isreadmefile)
- [isSpecFile](utils_pathUtils.md#isspecfile)
- [joinPaths](utils_pathUtils.md#joinpaths)
- [normalizePath](utils_pathUtils.md#normalizepath)

## Functions

### getDirectory

▸ **getDirectory**(`filePath`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |

#### Returns

`string`

#### Defined in

[utils/pathUtils.ts:6](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/webview/src/utils/pathUtils.ts#L6)

___

### getExtension

▸ **getExtension**(`filePath`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |

#### Returns

`string`

#### Defined in

[utils/pathUtils.ts:12](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/webview/src/utils/pathUtils.ts#L12)

___

### getFileName

▸ **getFileName**(`filePath`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |

#### Returns

`string`

#### Defined in

[utils/pathUtils.ts:1](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/webview/src/utils/pathUtils.ts#L1)

___

### getPathSegments

▸ **getPathSegments**(`filePath`, `rootPath`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |
| `rootPath` | `string` |

#### Returns

`string`[]

#### Defined in

[utils/pathUtils.ts:18](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/webview/src/utils/pathUtils.ts#L18)

___

### getRelativePath

▸ **getRelativePath**(`filePath`, `rootPath`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |
| `rootPath` | `string` |

#### Returns

`string`

#### Defined in

[utils/pathUtils.ts:59](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/webview/src/utils/pathUtils.ts#L59)

___

### isChangelogFile

▸ **isChangelogFile**(`filePath`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |

#### Returns

`boolean`

#### Defined in

[utils/pathUtils.ts:54](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/webview/src/utils/pathUtils.ts#L54)

___

### isMarkdownFile

▸ **isMarkdownFile**(`filePath`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |

#### Returns

`boolean`

#### Defined in

[utils/pathUtils.ts:40](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/webview/src/utils/pathUtils.ts#L40)

___

### isReadmeFile

▸ **isReadmeFile**(`filePath`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |

#### Returns

`boolean`

#### Defined in

[utils/pathUtils.ts:49](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/webview/src/utils/pathUtils.ts#L49)

___

### isSpecFile

▸ **isSpecFile**(`filePath`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |

#### Returns

`boolean`

#### Defined in

[utils/pathUtils.ts:44](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/webview/src/utils/pathUtils.ts#L44)

___

### joinPaths

▸ **joinPaths**(`...paths`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...paths` | `string`[] |

#### Returns

`string`

#### Defined in

[utils/pathUtils.ts:33](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/webview/src/utils/pathUtils.ts#L33)

___

### normalizePath

▸ **normalizePath**(`filePath`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |

#### Returns

`string`

#### Defined in

[utils/pathUtils.ts:29](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/webview/src/utils/pathUtils.ts#L29)
