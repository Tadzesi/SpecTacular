[spectacular-dashboard](../README.md) / [FileDecorationProvider](../modules/FileDecorationProvider.md) / SpecsFileDecorationProvider

# Class: SpecsFileDecorationProvider

[FileDecorationProvider](../modules/FileDecorationProvider.md).SpecsFileDecorationProvider

## Implements

- `FileDecorationProvider`

## Table of contents

### Constructors

- [constructor](FileDecorationProvider.SpecsFileDecorationProvider.md#constructor)

### Properties

- [\_onDidChangeFileDecorations](FileDecorationProvider.SpecsFileDecorationProvider.md#_ondidchangefiledecorations)
- [modifiedFiles](FileDecorationProvider.SpecsFileDecorationProvider.md#modifiedfiles)
- [onDidChangeFileDecorations](FileDecorationProvider.SpecsFileDecorationProvider.md#ondidchangefiledecorations)

### Methods

- [clearAll](FileDecorationProvider.SpecsFileDecorationProvider.md#clearall)
- [clearModified](FileDecorationProvider.SpecsFileDecorationProvider.md#clearmodified)
- [markModified](FileDecorationProvider.SpecsFileDecorationProvider.md#markmodified)
- [provideFileDecoration](FileDecorationProvider.SpecsFileDecorationProvider.md#providefiledecoration)

## Constructors

### constructor

• **new SpecsFileDecorationProvider**(): [`SpecsFileDecorationProvider`](FileDecorationProvider.SpecsFileDecorationProvider.md)

#### Returns

[`SpecsFileDecorationProvider`](FileDecorationProvider.SpecsFileDecorationProvider.md)

## Properties

### \_onDidChangeFileDecorations

• `Private` **\_onDidChangeFileDecorations**: `EventEmitter`\<`undefined` \| `Uri` \| `Uri`[]\>

#### Defined in

[src/FileDecorationProvider.ts:4](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/FileDecorationProvider.ts#L4)

___

### modifiedFiles

• `Private` **modifiedFiles**: `Set`\<`string`\>

#### Defined in

[src/FileDecorationProvider.ts:7](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/FileDecorationProvider.ts#L7)

___

### onDidChangeFileDecorations

• `Readonly` **onDidChangeFileDecorations**: `Event`\<`undefined` \| `Uri` \| `Uri`[]\>

#### Implementation of

vscode.FileDecorationProvider.onDidChangeFileDecorations

#### Defined in

[src/FileDecorationProvider.ts:5](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/FileDecorationProvider.ts#L5)

## Methods

### clearAll

▸ **clearAll**(): `void`

#### Returns

`void`

#### Defined in

[src/FileDecorationProvider.ts:19](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/FileDecorationProvider.ts#L19)

___

### clearModified

▸ **clearModified**(`uri`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `uri` | `Uri` |

#### Returns

`void`

#### Defined in

[src/FileDecorationProvider.ts:14](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/FileDecorationProvider.ts#L14)

___

### markModified

▸ **markModified**(`uri`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `uri` | `Uri` |

#### Returns

`void`

#### Defined in

[src/FileDecorationProvider.ts:9](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/FileDecorationProvider.ts#L9)

___

### provideFileDecoration

▸ **provideFileDecoration**(`uri`): `undefined` \| `FileDecoration`

#### Parameters

| Name | Type |
| :------ | :------ |
| `uri` | `Uri` |

#### Returns

`undefined` \| `FileDecoration`

#### Implementation of

vscode.FileDecorationProvider.provideFileDecoration

#### Defined in

[src/FileDecorationProvider.ts:25](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/FileDecorationProvider.ts#L25)
