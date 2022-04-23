const vscode = require("vscode");
const path = require("path");
const fs = require("fs");

const mySnips = JSON.parse(
  fs.readFileSync(path.join(__dirname, "snippets.code-snippets"))
);

class SnipsProvider {
  constructor() {
    this.snipTreeItems = this.convertSnipsToTreeItems();
  }

  getTreeItem(element) {
    return element;
  }

  getChildren(element) {
    if (element) {
      return [];
    } else {
      return this.snipTreeItems;
    }
  }

  convertSnipsToTreeItems() {
    let snips = [];
    for (const [key, value] of Object.entries(mySnips)) {
      snips.push({
        label: key,
        collapsibleState: vscode.TreeItemCollapsibleState.None,
        iconPath: new vscode.ThemeIcon("symbol-constant"),
      });
    }
    return snips;
  }
}

module.exports = SnipsProvider;
