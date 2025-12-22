[spectacular-dashboard](../README.md) / [VersionCheckService](../modules/VersionCheckService.md) / VersionCheckService

# Class: VersionCheckService

[VersionCheckService](../modules/VersionCheckService.md).VersionCheckService

## Table of contents

### Constructors

- [constructor](VersionCheckService.VersionCheckService.md#constructor)

### Properties

- [cachedVersionInfo](VersionCheckService.VersionCheckService.md#cachedversioninfo)
- [hasShownNotification](VersionCheckService.VersionCheckService.md#hasshownnotification)
- [GITHUB\_API\_URL](VersionCheckService.VersionCheckService.md#github_api_url)
- [GITHUB\_RELEASES\_URL](VersionCheckService.VersionCheckService.md#github_releases_url)
- [instance](VersionCheckService.VersionCheckService.md#instance)

### Methods

- [checkForUpdates](VersionCheckService.VersionCheckService.md#checkforupdates)
- [fetchLatestVersion](VersionCheckService.VersionCheckService.md#fetchlatestversion)
- [getCurrentVersion](VersionCheckService.VersionCheckService.md#getcurrentversion)
- [getVersionInfo](VersionCheckService.VersionCheckService.md#getversioninfo)
- [isNewerVersion](VersionCheckService.VersionCheckService.md#isnewerversion)
- [showUpdateNotificationIfNeeded](VersionCheckService.VersionCheckService.md#showupdatenotificationifneeded)
- [getInstance](VersionCheckService.VersionCheckService.md#getinstance)

## Constructors

### constructor

• **new VersionCheckService**(): [`VersionCheckService`](VersionCheckService.VersionCheckService.md)

#### Returns

[`VersionCheckService`](VersionCheckService.VersionCheckService.md)

## Properties

### cachedVersionInfo

• `Private` **cachedVersionInfo**: ``null`` \| [`VersionInfo`](../interfaces/VersionCheckService.VersionInfo.md) = `null`

#### Defined in

[src/VersionCheckService.ts:16](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/VersionCheckService.ts#L16)

___

### hasShownNotification

• `Private` **hasShownNotification**: `boolean` = `false`

#### Defined in

[src/VersionCheckService.ts:17](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/VersionCheckService.ts#L17)

___

### GITHUB\_API\_URL

▪ `Static` `Private` `Readonly` **GITHUB\_API\_URL**: ``"https://api.github.com/repos/Tadzesi/SpecTacular/releases/latest"``

#### Defined in

[src/VersionCheckService.ts:14](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/VersionCheckService.ts#L14)

___

### GITHUB\_RELEASES\_URL

▪ `Static` `Private` `Readonly` **GITHUB\_RELEASES\_URL**: ``"https://github.com/Tadzesi/SpecTacular/releases"``

#### Defined in

[src/VersionCheckService.ts:13](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/VersionCheckService.ts#L13)

___

### instance

▪ `Static` `Private` **instance**: [`VersionCheckService`](VersionCheckService.VersionCheckService.md)

#### Defined in

[src/VersionCheckService.ts:12](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/VersionCheckService.ts#L12)

## Methods

### checkForUpdates

▸ **checkForUpdates**(): `Promise`\<[`VersionInfo`](../interfaces/VersionCheckService.VersionInfo.md)\>

#### Returns

`Promise`\<[`VersionInfo`](../interfaces/VersionCheckService.VersionInfo.md)\>

#### Defined in

[src/VersionCheckService.ts:31](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/VersionCheckService.ts#L31)

___

### fetchLatestVersion

▸ **fetchLatestVersion**(): `Promise`\<``null`` \| `string`\>

#### Returns

`Promise`\<``null`` \| `string`\>

#### Defined in

[src/VersionCheckService.ts:92](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/VersionCheckService.ts#L92)

___

### getCurrentVersion

▸ **getCurrentVersion**(): `string`

#### Returns

`string`

#### Defined in

[src/VersionCheckService.ts:26](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/VersionCheckService.ts#L26)

___

### getVersionInfo

▸ **getVersionInfo**(): ``null`` \| [`VersionInfo`](../interfaces/VersionCheckService.VersionInfo.md)

#### Returns

``null`` \| [`VersionInfo`](../interfaces/VersionCheckService.VersionInfo.md)

#### Defined in

[src/VersionCheckService.ts:88](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/VersionCheckService.ts#L88)

___

### isNewerVersion

▸ **isNewerVersion**(`latest`, `current`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `latest` | `string` |
| `current` | `string` |

#### Returns

`boolean`

#### Defined in

[src/VersionCheckService.ts:145](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/VersionCheckService.ts#L145)

___

### showUpdateNotificationIfNeeded

▸ **showUpdateNotificationIfNeeded**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/VersionCheckService.ts:66](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/VersionCheckService.ts#L66)

___

### getInstance

▸ **getInstance**(): [`VersionCheckService`](VersionCheckService.VersionCheckService.md)

#### Returns

[`VersionCheckService`](VersionCheckService.VersionCheckService.md)

#### Defined in

[src/VersionCheckService.ts:19](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/VersionCheckService.ts#L19)
