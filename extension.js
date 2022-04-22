// The module 'vscode' contains the VS Code extensibility API
const vscode = require("vscode");
const prettier = require("prettier");

const info = prettier.getSupportInfo();

module.exports = {
  activate,
  deactivate,
};

// This method is called when your extension is activated
function activate(context) {
  const commandID = "cvs.formatDocument";

  let disposable = vscode.commands.registerCommand(commandID, formatter);

  context.subscriptions.push(disposable);
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
