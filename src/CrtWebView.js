const vscode = require("vscode");
const path = require("path");

class CrtWebView {
  constructor(context) {
    this.context = context;
  }

  resolveWebviewView(view, content, token) {
    view.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.context.extensionUri],
    };

    const cssPath = view.webview.asWebviewUri(
      this.getPath("resources/styles.css")
    );
    const jsPath = view.webview.asWebviewUri(
      this.getPath("resources/script.js")
    );

    // view.webview.html = html;
    view.webview.html = this.getHtml(cssPath, jsPath);

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
      this.context.subscriptions
    );
  }

  getPath(filename) {
    return vscode.Uri.file(path.join(this.context.extensionPath, filename));
  }

  getHtml(cssPath, jsPath) {
    return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <link rel="stylesheet" type="text/css" href="${cssPath}">
  </head>
  <body>
    <div class="content">
      <div class="button-container">
        <a class="button text-button" id="format" role="button">Format current document with Prettier</a>
      </div>
    </div>
  </body>
  <script src="${jsPath}"></script>
</html>
    `;
  }
}

module.exports = CrtWebView;
