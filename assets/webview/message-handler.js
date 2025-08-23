// Message handling for VSCode communication
class MessageHandler {
  constructor(vscode) {
    this.vscode = vscode;
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // ボタンクリックイベント
    const analyzeBtn = document.getElementById("analyzeBtn");
    if (analyzeBtn) {
      analyzeBtn.addEventListener("click", () => {
        this.vscode.postMessage({ type: "analyzeFile" });
        Logger.log("LLM解析開始...");
      });
    }

    // VSCodeからのメッセージリスナー
    window.addEventListener("message", (event) => {
      const message = event.data;

      switch (message.type) {
        case "llmLoading":
          TableRenderer.showLLMLoading(message.data);
          break;
        case "llmResponse":
          TableRenderer.showLLMResponse(message.data);
          break;
        case "llmError":
          TableRenderer.showLLMError(message.data);
          break;
        default:
          Logger.log(`未知のメッセージタイプ: ${message.type}`);
      }
    });
  }
}
