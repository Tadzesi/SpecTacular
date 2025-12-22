[spectacular-dashboard](../README.md) / [SpecsTreeProvider](../modules/SpecsTreeProvider.md) / SpecsTreeProvider

# Class: SpecsTreeProvider

[SpecsTreeProvider](../modules/SpecsTreeProvider.md).SpecsTreeProvider

## Implements

- `TreeDataProvider`\<[`TreeItem`](../modules/SpecsTreeProvider.md#treeitem)\>

## Table of contents

### Constructors

- [constructor](SpecsTreeProvider.SpecsTreeProvider.md#constructor)

### Properties

- [\_onDidChangeTreeData](SpecsTreeProvider.SpecsTreeProvider.md#_ondidchangetreedata)
- [itemCache](SpecsTreeProvider.SpecsTreeProvider.md#itemcache)
- [onDidChangeTreeData](SpecsTreeProvider.SpecsTreeProvider.md#ondidchangetreedata)
- [specsRoot](SpecsTreeProvider.SpecsTreeProvider.md#specsroot)
- [workspaceRoot](SpecsTreeProvider.SpecsTreeProvider.md#workspaceroot)

### Methods

- [\_containsMarkdown](SpecsTreeProvider.SpecsTreeProvider.md#_containsmarkdown)
- [\_findItemRecursive](SpecsTreeProvider.SpecsTreeProvider.md#_finditemrecursive)
- [\_findSpecsRoot](SpecsTreeProvider.SpecsTreeProvider.md#_findspecsroot)
- [\_isMarkdownFile](SpecsTreeProvider.SpecsTreeProvider.md#_ismarkdownfile)
- [\_normalizePath](SpecsTreeProvider.SpecsTreeProvider.md#_normalizepath)
- [findTreeItem](SpecsTreeProvider.SpecsTreeProvider.md#findtreeitem)
- [getChildren](SpecsTreeProvider.SpecsTreeProvider.md#getchildren)
- [getParent](SpecsTreeProvider.SpecsTreeProvider.md#getparent)
- [getSpecsRoot](SpecsTreeProvider.SpecsTreeProvider.md#getspecsroot)
- [getTreeItem](SpecsTreeProvider.SpecsTreeProvider.md#gettreeitem)
- [refresh](SpecsTreeProvider.SpecsTreeProvider.md#refresh)

## Constructors

### constructor

• **new SpecsTreeProvider**(): [`SpecsTreeProvider`](SpecsTreeProvider.SpecsTreeProvider.md)

#### Returns

[`SpecsTreeProvider`](SpecsTreeProvider.SpecsTreeProvider.md)

#### Defined in

[src/SpecsTreeProvider.ts:14](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/SpecsTreeProvider.ts#L14)

## Properties

### \_onDidChangeTreeData

• `Private` **\_onDidChangeTreeData**: `EventEmitter`\<`undefined` \| ``null`` \| `void` \| [`TreeItem`](../modules/SpecsTreeProvider.md#treeitem)\>

#### Defined in

[src/SpecsTreeProvider.ts:7](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/SpecsTreeProvider.ts#L7)

___

### itemCache

• `Private` **itemCache**: `Map`\<`string`, [`SpecsTreeItem`](SpecsTreeProvider.SpecsTreeItem.md)\>

#### Defined in

[src/SpecsTreeProvider.ts:12](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/SpecsTreeProvider.ts#L12)

___

### onDidChangeTreeData

• `Readonly` **onDidChangeTreeData**: `Event`\<`undefined` \| ``null`` \| `void` \| [`TreeItem`](../modules/SpecsTreeProvider.md#treeitem)\>

#### Implementation of

vscode.TreeDataProvider.onDidChangeTreeData

#### Defined in

[src/SpecsTreeProvider.ts:8](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/SpecsTreeProvider.ts#L8)

___

### specsRoot

• `Private` **specsRoot**: `undefined` \| `Uri`

#### Defined in

[src/SpecsTreeProvider.ts:11](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/SpecsTreeProvider.ts#L11)

___

### workspaceRoot

• `Private` **workspaceRoot**: `undefined` \| `string`

#### Defined in

[src/SpecsTreeProvider.ts:10](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/SpecsTreeProvider.ts#L10)

## Methods

### \_containsMarkdown

▸ **_containsMarkdown**(`folderUri`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `folderUri` | `Uri` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/SpecsTreeProvider.ts:185](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/SpecsTreeProvider.ts#L185)

___

### \_findItemRecursive

▸ **_findItemRecursive**(`normalizedFilePath`, `parent?`): `Promise`\<`undefined` \| [`SpecsTreeItem`](SpecsTreeProvider.SpecsTreeItem.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `normalizedFilePath` | `string` |
| `parent?` | [`SpecsTreeItem`](SpecsTreeProvider.SpecsTreeItem.md) |

#### Returns

`Promise`\<`undefined` \| [`SpecsTreeItem`](SpecsTreeProvider.SpecsTreeItem.md)\>

#### Defined in

[src/SpecsTreeProvider.ts:215](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/SpecsTreeProvider.ts#L215)

___

### \_findSpecsRoot

▸ **_findSpecsRoot**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/SpecsTreeProvider.ts:19](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/SpecsTreeProvider.ts#L19)

___

### \_isMarkdownFile

▸ **_isMarkdownFile**(`filename`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `filename` | `string` |

#### Returns

`boolean`

#### Defined in

[src/SpecsTreeProvider.ts:180](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/SpecsTreeProvider.ts#L180)

___

### \_normalizePath

▸ **_normalizePath**(`p`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `p` | `string` |

#### Returns

`string`

#### Defined in

[src/SpecsTreeProvider.ts:60](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/SpecsTreeProvider.ts#L60)

___

### findTreeItem

▸ **findTreeItem**(`filePath`): `Promise`\<`undefined` \| [`SpecsTreeItem`](SpecsTreeProvider.SpecsTreeItem.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |

#### Returns

`Promise`\<`undefined` \| [`SpecsTreeItem`](SpecsTreeProvider.SpecsTreeItem.md)\>

#### Defined in

[src/SpecsTreeProvider.ts:210](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/SpecsTreeProvider.ts#L210)

___

### getChildren

▸ **getChildren**(`element?`): `Promise`\<[`TreeItem`](../modules/SpecsTreeProvider.md#treeitem)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `element?` | [`TreeItem`](../modules/SpecsTreeProvider.md#treeitem) |

#### Returns

`Promise`\<[`TreeItem`](../modules/SpecsTreeProvider.md#treeitem)[]\>

#### Implementation of

vscode.TreeDataProvider.getChildren

#### Defined in

[src/SpecsTreeProvider.ts:84](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/SpecsTreeProvider.ts#L84)

___

### getParent

▸ **getParent**(`element`): `undefined` \| [`TreeItem`](../modules/SpecsTreeProvider.md#treeitem)

#### Parameters

| Name | Type |
| :------ | :------ |
| `element` | [`TreeItem`](../modules/SpecsTreeProvider.md#treeitem) |

#### Returns

`undefined` \| [`TreeItem`](../modules/SpecsTreeProvider.md#treeitem)

#### Implementation of

vscode.TreeDataProvider.getParent

#### Defined in

[src/SpecsTreeProvider.ts:65](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/SpecsTreeProvider.ts#L65)

___

### getSpecsRoot

▸ **getSpecsRoot**(): `undefined` \| `Uri`

#### Returns

`undefined` \| `Uri`

#### Defined in

[src/SpecsTreeProvider.ts:205](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/SpecsTreeProvider.ts#L205)

___

### getTreeItem

▸ **getTreeItem**(`element`): `TreeItem`

#### Parameters

| Name | Type |
| :------ | :------ |
| `element` | [`TreeItem`](../modules/SpecsTreeProvider.md#treeitem) |

#### Returns

`TreeItem`

#### Implementation of

vscode.TreeDataProvider.getTreeItem

#### Defined in

[src/SpecsTreeProvider.ts:55](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/SpecsTreeProvider.ts#L55)

___

### refresh

▸ **refresh**(): `void`

#### Returns

`void`

#### Defined in

[src/SpecsTreeProvider.ts:49](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/SpecsTreeProvider.ts#L49)
