[spectacular-dashboard](../README.md) / [TaskStatusService](../modules/TaskStatusService.md) / TaskStatusService

# Class: TaskStatusService

[TaskStatusService](../modules/TaskStatusService.md).TaskStatusService

Service for managing task file status based on acceptance criteria

## Table of contents

### Constructors

- [constructor](TaskStatusService.TaskStatusService.md#constructor)

### Properties

- [\_disposables](TaskStatusService.TaskStatusService.md#_disposables)
- [instance](TaskStatusService.TaskStatusService.md#instance)

### Methods

- [dispose](TaskStatusService.TaskStatusService.md#dispose)
- [findMainTasksFile](TaskStatusService.TaskStatusService.md#findmaintasksfile)
- [isTaskFile](TaskStatusService.TaskStatusService.md#istaskfile)
- [parseTaskFile](TaskStatusService.TaskStatusService.md#parsetaskfile)
- [processTaskFileChange](TaskStatusService.TaskStatusService.md#processtaskfilechange)
- [updateMainTasksTable](TaskStatusService.TaskStatusService.md#updatemaintaskstable)
- [updateTaskStatus](TaskStatusService.TaskStatusService.md#updatetaskstatus)
- [getInstance](TaskStatusService.TaskStatusService.md#getinstance)

## Constructors

### constructor

• **new TaskStatusService**(): [`TaskStatusService`](TaskStatusService.TaskStatusService.md)

#### Returns

[`TaskStatusService`](TaskStatusService.TaskStatusService.md)

## Properties

### \_disposables

• `Private` **\_disposables**: `Disposable`[] = `[]`

#### Defined in

[src/TaskStatusService.ts:30](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/TaskStatusService.ts#L30)

___

### instance

▪ `Static` `Private` **instance**: [`TaskStatusService`](TaskStatusService.TaskStatusService.md)

#### Defined in

[src/TaskStatusService.ts:29](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/TaskStatusService.ts#L29)

## Methods

### dispose

▸ **dispose**(): `void`

#### Returns

`void`

#### Defined in

[src/TaskStatusService.ts:331](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/TaskStatusService.ts#L331)

___

### findMainTasksFile

▸ **findMainTasksFile**(`taskFilePath`): `Promise`\<``null`` \| `string`\>

Find the main tasks.md file for a given task file

#### Parameters

| Name | Type |
| :------ | :------ |
| `taskFilePath` | `string` |

#### Returns

`Promise`\<``null`` \| `string`\>

#### Defined in

[src/TaskStatusService.ts:181](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/TaskStatusService.ts#L181)

___

### isTaskFile

▸ **isTaskFile**(`filePath`): `boolean`

Check if a file is a task file (in tasks folder with task frontmatter)

#### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |

#### Returns

`boolean`

#### Defined in

[src/TaskStatusService.ts:42](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/TaskStatusService.ts#L42)

___

### parseTaskFile

▸ **parseTaskFile**(`content`): ``null`` \| [`TaskParseResult`](../interfaces/TaskStatusService.TaskParseResult.md)

Parse a task file and extract frontmatter and acceptance criteria

#### Parameters

| Name | Type |
| :------ | :------ |
| `content` | `string` |

#### Returns

``null`` \| [`TaskParseResult`](../interfaces/TaskStatusService.TaskParseResult.md)

#### Defined in

[src/TaskStatusService.ts:52](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/TaskStatusService.ts#L52)

___

### processTaskFileChange

▸ **processTaskFileChange**(`filePath`): `Promise`\<\{ `mainTasksUpdated`: `boolean` ; `newStatus`: `undefined` \| `string` ; `oldStatus`: `undefined` \| `string` ; `statusChanged`: `boolean`  }\>

Process a task file change and update status if needed

#### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |

#### Returns

`Promise`\<\{ `mainTasksUpdated`: `boolean` ; `newStatus`: `undefined` \| `string` ; `oldStatus`: `undefined` \| `string` ; `statusChanged`: `boolean`  }\>

#### Defined in

[src/TaskStatusService.ts:258](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/TaskStatusService.ts#L258)

___

### updateMainTasksTable

▸ **updateMainTasksTable**(`mainTasksPath`, `taskFileName`, `newStatus`): `Promise`\<`boolean`\>

Update the status tag in the main tasks.md table for a specific task

#### Parameters

| Name | Type |
| :------ | :------ |
| `mainTasksPath` | `string` |
| `taskFileName` | `string` |
| `newStatus` | `string` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/TaskStatusService.ts:206](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/TaskStatusService.ts#L206)

___

### updateTaskStatus

▸ **updateTaskStatus**(`content`, `newStatus`): `string`

Update the status in frontmatter based on acceptance criteria

#### Parameters

| Name | Type |
| :------ | :------ |
| `content` | `string` |
| `newStatus` | `string` |

#### Returns

`string`

#### Defined in

[src/TaskStatusService.ts:143](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/TaskStatusService.ts#L143)

___

### getInstance

▸ **getInstance**(): [`TaskStatusService`](TaskStatusService.TaskStatusService.md)

#### Returns

[`TaskStatusService`](TaskStatusService.TaskStatusService.md)

#### Defined in

[src/TaskStatusService.ts:32](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/TaskStatusService.ts#L32)
