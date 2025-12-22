[spectacular-dashboard](../README.md) / fileOperations

# Module: fileOperations

## Table of contents

### Interfaces

- [FileNode](../interfaces/fileOperations.FileNode.md)

### Functions

- [buildFileTree](fileOperations.md#buildfiletree)
- [getFileStat](fileOperations.md#getfilestat)
- [getRelativePath](fileOperations.md#getrelativepath)
- [normalizePath](fileOperations.md#normalizepath)
- [readFileContent](fileOperations.md#readfilecontent)

## Functions

### buildFileTree

▸ **buildFileTree**(`rootPath`): `Promise`\<[`FileNode`](../interfaces/fileOperations.FileNode.md)[]\>

Builds a hierarchical file tree from a root directory
Filters to only include markdown files and directories

#### Parameters

| Name | Type |
| :------ | :------ |
| `rootPath` | `string` |

#### Returns

`Promise`\<[`FileNode`](../interfaces/fileOperations.FileNode.md)[]\>

#### Defined in

[src/fileOperations.ts:17](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/fileOperations.ts#L17)

___

### getFileStat

▸ **getFileStat**(`filePath`): `Promise`\<`vscode.FileStat`\>

Gets file stats

#### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |

#### Returns

`Promise`\<`vscode.FileStat`\>

#### Defined in

[src/fileOperations.ts:122](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/fileOperations.ts#L122)

___

### getRelativePath

▸ **getRelativePath**(`filePath`, `rootPath`): `string`

Gets the relative path from root to a file

#### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |
| `rootPath` | `string` |

#### Returns

`string`

#### Defined in

[src/fileOperations.ts:137](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/fileOperations.ts#L137)

___

### normalizePath

▸ **normalizePath**(`filePath`): `string`

Normalizes a file path (converts backslashes to forward slashes)

#### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |

#### Returns

`string`

#### Defined in

[src/fileOperations.ts:130](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/fileOperations.ts#L130)

___

### readFileContent

▸ **readFileContent**(`filePath`): `Promise`\<`string`\>

Reads the content of a file

#### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |

#### Returns

`Promise`\<`string`\>

#### Defined in

[src/fileOperations.ts:113](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/fileOperations.ts#L113)
