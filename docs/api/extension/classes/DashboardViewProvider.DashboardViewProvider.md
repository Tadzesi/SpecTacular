[spectacular-dashboard](../README.md) / [DashboardViewProvider](../modules/DashboardViewProvider.md) / DashboardViewProvider

# Class: DashboardViewProvider

[DashboardViewProvider](../modules/DashboardViewProvider.md).DashboardViewProvider

## Implements

- `WebviewViewProvider`

## Table of contents

### Constructors

- [constructor](DashboardViewProvider.DashboardViewProvider.md#constructor)

### Properties

- [\_extensionUri](DashboardViewProvider.DashboardViewProvider.md#_extensionuri)
- [\_fileWatcher](DashboardViewProvider.DashboardViewProvider.md#_filewatcher)
- [\_rootPath](DashboardViewProvider.DashboardViewProvider.md#_rootpath)
- [\_view](DashboardViewProvider.DashboardViewProvider.md#_view)
- [viewType](DashboardViewProvider.DashboardViewProvider.md#viewtype)

### Methods

- [\_getHtmlForWebview](DashboardViewProvider.DashboardViewProvider.md#_gethtmlforwebview)
- [\_getThemeKind](DashboardViewProvider.DashboardViewProvider.md#_getthemekind)
- [\_handleGetFileTree](DashboardViewProvider.DashboardViewProvider.md#_handlegetfiletree)
- [\_handleMessage](DashboardViewProvider.DashboardViewProvider.md#_handlemessage)
- [\_handleReadFile](DashboardViewProvider.DashboardViewProvider.md#_handlereadfile)
- [\_handleSelectDirectory](DashboardViewProvider.DashboardViewProvider.md#_handleselectdirectory)
- [\_postMessage](DashboardViewProvider.DashboardViewProvider.md#_postmessage)
- [\_sendConfig](DashboardViewProvider.DashboardViewProvider.md#_sendconfig)
- [\_startWatching](DashboardViewProvider.DashboardViewProvider.md#_startwatching)
- [\_stopWatching](DashboardViewProvider.DashboardViewProvider.md#_stopwatching)
- [resolveWebviewView](DashboardViewProvider.DashboardViewProvider.md#resolvewebviewview)

## Constructors

### constructor

• **new DashboardViewProvider**(`_extensionUri`): [`DashboardViewProvider`](DashboardViewProvider.DashboardViewProvider.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `_extensionUri` | `Uri` |

#### Returns

[`DashboardViewProvider`](DashboardViewProvider.DashboardViewProvider.md)

#### Defined in

[src/DashboardViewProvider.ts:11](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/DashboardViewProvider.ts#L11)

## Properties

### \_extensionUri

• `Private` `Readonly` **\_extensionUri**: `Uri`

#### Defined in

[src/DashboardViewProvider.ts:11](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/DashboardViewProvider.ts#L11)

___

### \_fileWatcher

• `Private` **\_fileWatcher**: `undefined` \| `FileSystemWatcher`

#### Defined in

[src/DashboardViewProvider.ts:9](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/DashboardViewProvider.ts#L9)

___

### \_rootPath

• `Private` **\_rootPath**: `undefined` \| `string`

#### Defined in

[src/DashboardViewProvider.ts:8](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/DashboardViewProvider.ts#L8)

___

### \_view

• `Private` `Optional` **\_view**: `WebviewView`

#### Defined in

[src/DashboardViewProvider.ts:7](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/DashboardViewProvider.ts#L7)

___

### viewType

▪ `Static` `Readonly` **viewType**: ``"spectacular.dashboardView"``

#### Defined in

[src/DashboardViewProvider.ts:5](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/DashboardViewProvider.ts#L5)

## Methods

### \_getHtmlForWebview

▸ **_getHtmlForWebview**(`webview`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `webview` | `Webview` |

#### Returns

`string`

#### Defined in

[src/DashboardViewProvider.ts:220](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/DashboardViewProvider.ts#L220)

___

### \_getThemeKind

▸ **_getThemeKind**(`theme`): ``"dark"`` \| ``"light"``

#### Parameters

| Name | Type |
| :------ | :------ |
| `theme` | `ColorTheme` |

#### Returns

``"dark"`` \| ``"light"``

#### Defined in

[src/DashboardViewProvider.ts:209](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/DashboardViewProvider.ts#L209)

___

### \_handleGetFileTree

▸ **_handleGetFileTree**(`rootPath`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `rootPath` | `string` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/DashboardViewProvider.ts:105](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/DashboardViewProvider.ts#L105)

___

### \_handleMessage

▸ **_handleMessage**(`message`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `Object` |
| `message.command` | `string` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/DashboardViewProvider.ts:55](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/DashboardViewProvider.ts#L55)

___

### \_handleReadFile

▸ **_handleReadFile**(`filePath`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/DashboardViewProvider.ts:117](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/DashboardViewProvider.ts#L117)

___

### \_handleSelectDirectory

▸ **_handleSelectDirectory**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/DashboardViewProvider.ts:132](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/DashboardViewProvider.ts#L132)

___

### \_postMessage

▸ **_postMessage**(`message`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `Object` |
| `message.data?` | `unknown` |
| `message.type` | `string` |

#### Returns

`void`

#### Defined in

[src/DashboardViewProvider.ts:216](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/DashboardViewProvider.ts#L216)

___

### \_sendConfig

▸ **_sendConfig**(): `void`

#### Returns

`void`

#### Defined in

[src/DashboardViewProvider.ts:194](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/DashboardViewProvider.ts#L194)

___

### \_startWatching

▸ **_startWatching**(`rootPath`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `rootPath` | `string` |

#### Returns

`void`

#### Defined in

[src/DashboardViewProvider.ts:151](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/DashboardViewProvider.ts#L151)

___

### \_stopWatching

▸ **_stopWatching**(): `void`

#### Returns

`void`

#### Defined in

[src/DashboardViewProvider.ts:186](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/DashboardViewProvider.ts#L186)

___

### resolveWebviewView

▸ **resolveWebviewView**(`webviewView`, `_context`, `_token`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `webviewView` | `WebviewView` |
| `_context` | `WebviewViewResolveContext`\<`unknown`\> |
| `_token` | `CancellationToken` |

#### Returns

`void`

#### Implementation of

vscode.WebviewViewProvider.resolveWebviewView

#### Defined in

[src/DashboardViewProvider.ts:16](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/DashboardViewProvider.ts#L16)
