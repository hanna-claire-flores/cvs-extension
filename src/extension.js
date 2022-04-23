// The module 'vscode' contains the VS Code extensibility API
const vscode = require("vscode");
const prettier = require("prettier");
const CrtWebView = require("./CrtWebView.js");
const info = prettier.getSupportInfo();
const SnipsProvider = require("./snipsProvider");
const ActionsProvider = require("./actionsProvider");

module.exports = {
  activate,
  deactivate,
};

// This method is called when your extension is activated
function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("crt.formatDocument", () => {
      formatTextDocument(false)
        .then((m) => {
          console.log("formatted");
        })
        .catch((e) => {});
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("crt.insertCRTSnippet", function (e) {
      vscode.commands.executeCommand("editor.action.insertSnippet", {
        name: e.label,
      });
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("crt.runCRTAction", function (e) {
      vscode.commands.executeCommand(e.command);
    })
  );

  context.subscriptions.push(
    vscode.workspace.onWillSaveTextDocument((saveEvent) => {
      let crtSettings = vscode.workspace.getConfiguration("CRT");
      if (crtSettings.formatOnSave) {
        saveEvent.waitUntil(formatTextDocument(true));
      }
    })
  );

  context.subscriptions.push(
    vscode.window.createTreeView("crt-snips", {
      treeDataProvider: new SnipsProvider(),
    })
  );

  context.subscriptions.push(
    vscode.window.createTreeView("crt-actions", {
      treeDataProvider: new ActionsProvider(),
    })
  );
}

function formatTextDocument(onSave) {
  return new Promise((resolve, reject) => {
    const editor = vscode.window.activeTextEditor;
    let msg = "";
    if (editor) {
      const document = editor.document;
      const fullText = document.getText();

      const parser = getParser(document.languageId);

      if (parser) {
        try {
          const formattedText = prettier.format(fullText, { parser: parser });
          const fullRange = new vscode.Range(
            document.positionAt(0),
            document.positionAt(fullText.length)
          );

          if (onSave) {
            resolve([new vscode.TextEdit(fullRange, formattedText)]);
          } else {
            editor.edit((editBuilder) => {
              editBuilder.replace(fullRange, formattedText);
            });
            resolve("done");
          }
        } catch (error) {
          msg = "Prettier couldnt format: " + error.message;
          vscode.window.showErrorMessage(msg);
          reject(msg);
        }
      } else {
        msg = "Prettier doesnt have a parser for this language";
        vscode.window.showErrorMessage(msg);
        reject(msg);
      }
    } else {
      msg = "No editor open";
      vscode.window.showErrorMessage(msg);
      reject(msg);
    }
  });
}

function getParser(langID) {
  let match = info.languages.find((language) =>
    language.vscodeLanguageIds.includes(langID)
  );
  if (match) {
    return match.parsers[0];
  } else {
    return null;
  }
}

// this method is called when your extension is deactivated
function deactivate() {}
