const vscode = require("vscode");

class QuickActionsProvider {
  constructor() {
    this.quickActions = [
      new vscode.TreeItem("Format", vscode.TreeItemCollapsibleState.None),
    ];
  }

  getTreeItem(element) {
    return element;
  }

  getChildren(element) {
    if (element) {
      return [];
    } else {
      return this.quickActions;
    }
  }
}

module.exports = QuickActionsProvider;
