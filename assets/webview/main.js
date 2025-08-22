(function () {
  const vscode = acquireVsCodeApi();

  const log = (t) => {
    const el = document.getElementById("log");
    if (el) {
      el.innerText = t;
    }
    console.log(t);
  };

  const showFileAnalysis = (data) => {
    const container = document.getElementById("table");
    if (!container) return;

    container.innerHTML = `
      <div style="padding: 10px;">
        <h4>ファイル解析結果</h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
          <tr>
            <td style="border: 1px solid #8883; padding: 4px; font-weight: bold;">ファイル名:</td>
            <td style="border: 1px solid #8883; padding: 4px;">${data.fileName}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #8883; padding: 4px; font-weight: bold;">言語:</td>
            <td style="border: 1px solid #8883; padding: 4px;">${data.languageId}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #8883; padding: 4px; font-weight: bold;">行数:</td>
            <td style="border: 1px solid #8883; padding: 4px;">${data.lineCount}</td>
          </tr>
        </table>
        <div style="background: #2d2d30; padding: 10px; border-radius: 4px; max-height: 200px; overflow-y: auto;">
          <h5 style="margin: 0 0 10px 0; color: #cccccc;">ファイル内容 (プレビュー):</h5>
          <pre style="margin: 0; white-space: pre-wrap; color: #d4d4d4; font-size: 12px;">${data.content.substring(0, 500)}${data.content.length > 500 ? '...' : ''}</pre>
        </div>
        <p style="margin-top: 10px; color: #6c9bd2;">✅ ファイル内容を取得しました。LLM送信機能は次のPBIで実装予定です。</p>
      </div>
    `;
  };

  const showError = (data) => {
    const container = document.getElementById("table");
    if (!container) return;

    container.innerHTML = `
      <div style="padding: 10px; color: #f48771;">
        <h4>エラー</h4>
        <p>${data.message}</p>
      </div>
    `;
  };

  log("JavaScript読み込み完了");

  const btn = document.getElementById("analyzeBtn");
  if (btn) {
    btn.addEventListener("click", () => {
      vscode.postMessage({ type: "analyzeFile" });
      log("ファイル解析開始...");
    });
  }

  window.addEventListener("message", (event) => {
    const message = event.data;
    log("received: " + JSON.stringify(message));

    switch (message.type) {
      case 'fileAnalysis':
        showFileAnalysis(message.data);
        break;
      case 'error':
        showError(message.data);
        break;
      default:
        log(`未知のメッセージタイプ: ${message.type}`);
    }
  });
})();
