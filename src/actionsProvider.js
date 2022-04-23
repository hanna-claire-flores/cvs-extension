const vscode = require("vscode");

const myActions = [
  {
    label: "Format document",
    collapsibleState: vscode.TreeItemCollapsibleState.None,
    command: "crt.formatDocument",
    iconPath: new vscode.ThemeIcon("heart"),
  },
];

class ActionsProvider {
  constructor() {}

  getTreeItem(element) {
    return element;
  }

  getChildren(element) {
    if (element) {
      return [];
    } else {
      return myActions;
    }
  }
}

module.exports = ActionsProvider;
