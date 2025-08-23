// Main entry point for SideVar webview
(function () {
  const vscode = acquireVsCodeApi();

  // Initialize message handler
  new MessageHandler(vscode);
})();
