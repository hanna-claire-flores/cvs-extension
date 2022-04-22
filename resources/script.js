const vscode = acquireVsCodeApi();
(function () {
  let butt = document.getElementById("format");

  butt.onclick = function () {
    vscode.postMessage({
      action: "format",
    });
  };
})();
