// The module 'vscode' contains the VS Code extensibility API
const vscode = require("vscode");
const prettier = require("prettier");
const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.resolve(__dirname, "index.html"), "utf8");
const info = prettier.getSupportInfo();

module.exports = {
  activate,
  deactivate,
};

// This method is called when your extension is activated
function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("cvs.formatDocument", formatter)
  );

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("crt-web", {
      resolveWebviewView(view, content, token) {
        view.webview.options = {
          enableScripts: true,
          localResourceRoots: [context.extensionUri],
        };

        view.webview.html = html;

        view.webview.onDidReceiveMessage(
          (message) => {
            switch (message.action) {
              case "format":
                vscode.commands.executeCommand("cvs.formatDocument");
                break;
              case "alert":
                vscode.window.showInformationMessage(message.text);
                break;
              default:
                break;
            }
          },
          undefined,
          context.subscriptions
        );
      },
    })
  );
}

function formatter() {
  const editor = vscode.window.activeTextEditor;

  if (editor) {
    const document = editor.document;

    const fullText = document.getText();
    const fullRange = new vscode.Range(
      document.positionAt(0),
      document.positionAt(fullText.length - 1)
    );

    const parser = getParser(document.languageId);

    if (parser) {
      const formattedText = prettier.format(fullText, { parser: parser });

      editor.edit((editBuilder) => {
        editBuilder.replace(fullRange, formattedText);
      });
    } else {
      vscode.window.showErrorMessage(
        "Prettier doesn't have a parser for this language! VSCode Language ID: " +
          document.languageId
      );
    }
  }
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
