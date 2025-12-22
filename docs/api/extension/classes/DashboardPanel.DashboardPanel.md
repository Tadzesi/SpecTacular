[spectacular-dashboard](../README.md) / [DashboardPanel](../modules/DashboardPanel.md) / DashboardPanel

# Class: DashboardPanel

[DashboardPanel](../modules/DashboardPanel.md).DashboardPanel

## Table of contents

### Constructors

- [constructor](DashboardPanel.DashboardPanel.md#constructor)

### Properties

- [\_disposables](DashboardPanel.DashboardPanel.md#_disposables)
- [\_extensionUri](DashboardPanel.DashboardPanel.md#_extensionuri)
- [\_fileWatcher](DashboardPanel.DashboardPanel.md#_filewatcher)
- [\_panel](DashboardPanel.DashboardPanel.md#_panel)
- [\_rootPath](DashboardPanel.DashboardPanel.md#_rootpath)
- [currentPanel](DashboardPanel.DashboardPanel.md#currentpanel)
- [viewType](DashboardPanel.DashboardPanel.md#viewtype)

### Methods

- [\_getHtmlForWebview](DashboardPanel.DashboardPanel.md#_gethtmlforwebview)
- [\_getThemeKind](DashboardPanel.DashboardPanel.md#_getthemekind)
- [\_handleGetFileTree](DashboardPanel.DashboardPanel.md#_handlegetfiletree)
- [\_handleMessage](DashboardPanel.DashboardPanel.md#_handlemessage)
- [\_handleReadFile](DashboardPanel.DashboardPanel.md#_handlereadfile)
- [\_handleSaveAllFiles](DashboardPanel.DashboardPanel.md#_handlesaveallfiles)
- [\_handleSaveFile](DashboardPanel.DashboardPanel.md#_handlesavefile)
- [\_handleSelectDirectory](DashboardPanel.DashboardPanel.md#_handleselectdirectory)
- [\_postMessage](DashboardPanel.DashboardPanel.md#_postmessage)
- [\_sendConfig](DashboardPanel.DashboardPanel.md#_sendconfig)
- [\_startWatching](DashboardPanel.DashboardPanel.md#_startwatching)
- [\_stopWatching](DashboardPanel.DashboardPanel.md#_stopwatching)
- [dispose](DashboardPanel.DashboardPanel.md#dispose)
- [notifyFileChange](DashboardPanel.DashboardPanel.md#notifyfilechange)
- [reveal](DashboardPanel.DashboardPanel.md#reveal)
- [setRootPath](DashboardPanel.DashboardPanel.md#setrootpath)
- [showFile](DashboardPanel.DashboardPanel.md#showfile)
- [createOrShow](DashboardPanel.DashboardPanel.md#createorshow)
- [dispose](DashboardPanel.DashboardPanel.md#dispose-1)

## Constructors

### constructor

• **new DashboardPanel**(`panel`, `extensionUri`, `rootPath?`): [`DashboardPanel`](DashboardPanel.DashboardPanel.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `panel` | `WebviewPanel` |
| `extensionUri` | `Uri` |
| `rootPath?` | `string` |

#### Returns

[`DashboardPanel`](DashboardPanel.DashboardPanel.md)

#### Defined in

[src/DashboardPanel.ts:53](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/DashboardPanel.ts#L53)

## Properties

### \_disposables

• `Private` **\_disposables**: `Disposable`[] = `[]`

#### Defined in

[src/DashboardPanel.ts:15](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/DashboardPanel.ts#L15)

___

### \_extensionUri

• `Private` `Readonly` **\_extensionUri**: `Uri`

#### Defined in

[src/DashboardPanel.ts:12](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/DashboardPanel.ts#L12)

___

### \_fileWatcher

• `Private` **\_fileWatcher**: `undefined` \| `FileSystemWatcher`

#### Defined in

[src/DashboardPanel.ts:14](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/DashboardPanel.ts#L14)

___

### \_panel

• `Private` `Readonly` **\_panel**: `WebviewPanel`

#### Defined in

[src/DashboardPanel.ts:11](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/DashboardPanel.ts#L11)

___

### \_rootPath

• `Private` **\_rootPath**: `undefined` \| `string`

#### Defined in

[src/DashboardPanel.ts:13](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/DashboardPanel.ts#L13)

___

### currentPanel

▪ `Static` **currentPanel**: `undefined` \| [`DashboardPanel`](DashboardPanel.DashboardPanel.md)

#### Defined in

[src/DashboardPanel.ts:8](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/DashboardPanel.ts#L8)

___

### viewType

▪ `Static` `Private` `Readonly` **viewType**: ``"spectacularDashboard"``

#### Defined in

[src/DashboardPanel.ts:9](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/DashboardPanel.ts#L9)

## Methods

### \_getHtmlForWebview

▸ **_getHtmlForWebview**(): `string`

#### Returns

`string`

#### Defined in

[src/DashboardPanel.ts:385](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/DashboardPanel.ts#L385)

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

[src/DashboardPanel.ts:374](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/DashboardPanel.ts#L374)

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

[src/DashboardPanel.ts:209](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/DashboardPanel.ts#L209)

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

[src/DashboardPanel.ts:145](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/DashboardPanel.ts#L145)

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

[src/DashboardPanel.ts:221](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/DashboardPanel.ts#L221)

___

### \_handleSaveAllFiles

▸ **_handleSaveAllFiles**(`files`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `files` | \{ `content`: `string` ; `path`: `string`  }[] |

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/DashboardPanel.ts:256](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/DashboardPanel.ts#L256)

___

### \_handleSaveFile

▸ **_handleSaveFile**(`filePath`, `content`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |
| `content` | `string` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/DashboardPanel.ts:236](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/DashboardPanel.ts#L236)

___

### \_handleSelectDirectory

▸ **_handleSelectDirectory**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/DashboardPanel.ts:287](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/DashboardPanel.ts#L287)

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

[src/DashboardPanel.ts:381](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/DashboardPanel.ts#L381)

___

### \_sendConfig

▸ **_sendConfig**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/DashboardPanel.ts:350](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/DashboardPanel.ts#L350)

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

[src/DashboardPanel.ts:306](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/DashboardPanel.ts#L306)

___

### \_stopWatching

▸ **_stopWatching**(): `void`

#### Returns

`void`

#### Defined in

[src/DashboardPanel.ts:342](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/DashboardPanel.ts#L342)

___

### dispose

▸ **dispose**(): `void`

#### Returns

`void`

#### Defined in

[src/DashboardPanel.ts:435](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/DashboardPanel.ts#L435)

___

### notifyFileChange

▸ **notifyFileChange**(`filePath`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |

#### Returns

`void`

#### Defined in

[src/DashboardPanel.ts:133](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/DashboardPanel.ts#L133)

___

### reveal

▸ **reveal**(`preserveFocus?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `preserveFocus` | `boolean` | `false` |

#### Returns

`void`

#### Defined in

[src/DashboardPanel.ts:129](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/DashboardPanel.ts#L129)

___

### setRootPath

▸ **setRootPath**(`rootPath`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `rootPath` | `string` |

#### Returns

`void`

#### Defined in

[src/DashboardPanel.ts:113](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/DashboardPanel.ts#L113)

___

### showFile

▸ **showFile**(`filePath`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |

#### Returns

`void`

#### Defined in

[src/DashboardPanel.ts:119](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/DashboardPanel.ts#L119)

___

### createOrShow

▸ **createOrShow**(`extensionUri`, `rootPath?`, `column?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `extensionUri` | `Uri` | `undefined` |
| `rootPath?` | `string` | `undefined` |
| `column` | `ViewColumn` | `vscode.ViewColumn.One` |

#### Returns

`void`

#### Defined in

[src/DashboardPanel.ts:17](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/DashboardPanel.ts#L17)

___

### dispose

▸ **dispose**(): `void`

#### Returns

`void`

#### Defined in

[src/DashboardPanel.ts:49](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/DashboardPanel.ts#L49)
