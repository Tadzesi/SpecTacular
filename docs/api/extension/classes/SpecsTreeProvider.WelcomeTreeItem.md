[spectacular-dashboard](../README.md) / [SpecsTreeProvider](../modules/SpecsTreeProvider.md) / WelcomeTreeItem

# Class: WelcomeTreeItem

[SpecsTreeProvider](../modules/SpecsTreeProvider.md).WelcomeTreeItem

## Hierarchy

- `TreeItem`

  ↳ **`WelcomeTreeItem`**

## Table of contents

### Constructors

- [constructor](SpecsTreeProvider.WelcomeTreeItem.md#constructor)

### Properties

- [accessibilityInformation](SpecsTreeProvider.WelcomeTreeItem.md#accessibilityinformation)
- [checkboxState](SpecsTreeProvider.WelcomeTreeItem.md#checkboxstate)
- [collapsibleState](SpecsTreeProvider.WelcomeTreeItem.md#collapsiblestate)
- [command](SpecsTreeProvider.WelcomeTreeItem.md#command)
- [contextValue](SpecsTreeProvider.WelcomeTreeItem.md#contextvalue)
- [description](SpecsTreeProvider.WelcomeTreeItem.md#description)
- [iconPath](SpecsTreeProvider.WelcomeTreeItem.md#iconpath)
- [id](SpecsTreeProvider.WelcomeTreeItem.md#id)
- [label](SpecsTreeProvider.WelcomeTreeItem.md#label)
- [resourceUri](SpecsTreeProvider.WelcomeTreeItem.md#resourceuri)
- [tooltip](SpecsTreeProvider.WelcomeTreeItem.md#tooltip)

## Constructors

### constructor

• **new WelcomeTreeItem**(`label`, `tooltip`, `command?`): [`WelcomeTreeItem`](SpecsTreeProvider.WelcomeTreeItem.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `label` | `string` |
| `tooltip` | `string` |
| `command?` | `Command` |

#### Returns

[`WelcomeTreeItem`](SpecsTreeProvider.WelcomeTreeItem.md)

#### Overrides

vscode.TreeItem.constructor

#### Defined in

[src/SpecsTreeProvider.ts:267](https://github.com/Tadzesi/SpecTacular/blob/3badce729de7355deffd88e1073860333951ebd7/spectacular-vscode/src/SpecsTreeProvider.ts#L267)

## Properties

### accessibilityInformation

• `Optional` **accessibilityInformation**: `AccessibilityInformation`

Accessibility information used when screen reader interacts with this tree item.
Generally, a TreeItem has no need to set the `role` of the accessibilityInformation;
however, there are cases where a TreeItem is not displayed in a tree-like way where setting the `role` may make sense.

#### Inherited from

vscode.TreeItem.accessibilityInformation

#### Defined in

node_modules/@types/vscode/index.d.ts:12339

___

### checkboxState

• `Optional` **checkboxState**: `TreeItemCheckboxState` \| \{ `accessibilityInformation?`: `AccessibilityInformation` ; `state`: `TreeItemCheckboxState` ; `tooltip?`: `string`  }

TreeItemCheckboxState TreeItemCheckboxState of the tree item.
TreeDataProvider.onDidChangeTreeData onDidChangeTreeData should be fired when TreeItem.checkboxState checkboxState changes.

#### Inherited from

vscode.TreeItem.checkboxState

#### Defined in

node_modules/@types/vscode/index.d.ts:12345

___

### collapsibleState

• `Optional` **collapsibleState**: `TreeItemCollapsibleState`

TreeItemCollapsibleState of the tree item.

#### Inherited from

vscode.TreeItem.collapsibleState

#### Defined in

node_modules/@types/vscode/index.d.ts:12312

___

### command

• `Optional` **command**: `Command`

The Command that should be executed when the tree item is selected.

Please use `vscode.open` or `vscode.diff` as command IDs when the tree item is opening
something in the editor. Using these commands ensures that the resulting editor will
appear consistent with how other built-in trees open editors.

#### Inherited from

vscode.TreeItem.command

#### Defined in

node_modules/@types/vscode/index.d.ts:12307

___

### contextValue

• `Optional` **contextValue**: `string`

Context value of the tree item. This can be used to contribute item specific actions in the tree.
For example, a tree item is given a context value as `folder`. When contributing actions to `view/item/context`
using `menus` extension point, you can specify context value for key `viewItem` in `when` expression like `viewItem == folder`.
```json
"contributes": {
  "menus": {
    "view/item/context": [
      {
        "command": "extension.deleteFolder",
        "when": "viewItem == folder"
      }
    ]
  }
}
```
This will show action `extension.deleteFolder` only for items with `contextValue` is `folder`.

#### Inherited from

vscode.TreeItem.contextValue

#### Defined in

node_modules/@types/vscode/index.d.ts:12332

___

### description

• `Optional` **description**: `string` \| `boolean`

A human-readable string which is rendered less prominent.
When `true`, it is derived from [resourceUri](SpecsTreeProvider.WelcomeTreeItem.md#resourceuri) and when `falsy`, it is not shown.

#### Inherited from

vscode.TreeItem.description

#### Defined in

node_modules/@types/vscode/index.d.ts:12285

___

### iconPath

• `Optional` **iconPath**: `string` \| `IconPath`

The icon path or ThemeIcon for the tree item.
When `falsy`, ThemeIcon.Folder Folder Theme Icon is assigned, if item is collapsible otherwise ThemeIcon.File File Theme Icon.
When a file or folder ThemeIcon is specified, icon is derived from the current file icon theme for the specified theme icon using [resourceUri](SpecsTreeProvider.WelcomeTreeItem.md#resourceuri) (if provided).

#### Inherited from

vscode.TreeItem.iconPath

#### Defined in

node_modules/@types/vscode/index.d.ts:12279

___

### id

• `Optional` **id**: `string`

Optional id for the tree item that has to be unique across tree. The id is used to preserve the selection and expansion state of the tree item.

If not provided, an id is generated using the tree item's label. **Note** that when labels change, ids will change and that selection and expansion state cannot be kept stable anymore.

#### Inherited from

vscode.TreeItem.id

#### Defined in

node_modules/@types/vscode/index.d.ts:12272

___

### label

• `Optional` **label**: `string` \| `TreeItemLabel`

A human-readable string describing this item. When `falsy`, it is derived from [resourceUri](SpecsTreeProvider.WelcomeTreeItem.md#resourceuri).

#### Inherited from

vscode.TreeItem.label

#### Defined in

node_modules/@types/vscode/index.d.ts:12265

___

### resourceUri

• `Optional` **resourceUri**: `Uri`

The Uri of the resource representing this item.

Will be used to derive the TreeItem.label label, when it is not provided.
Will be used to derive the icon from current file icon theme, when TreeItem.iconPath iconPath has ThemeIcon value.

#### Inherited from

vscode.TreeItem.resourceUri

#### Defined in

node_modules/@types/vscode/index.d.ts:12293

___

### tooltip

• `Optional` **tooltip**: `string` \| `MarkdownString`

The tooltip text when you hover over this item.

#### Inherited from

vscode.TreeItem.tooltip

#### Defined in

node_modules/@types/vscode/index.d.ts:12298
