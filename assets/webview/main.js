(function () {
  const vscode = acquireVsCodeApi();

  const log = (t) => {
    const el = document.getElementById("log");
    if (el) {
      el.innerText = t;
    }
    console.log(t);
  };


  const showLLMLoading = (data) => {
    const container = document.getElementById("table");
    if (!container) return;

    // ボタンを非活性にする
    const analyzeBtn = document.getElementById("analyzeBtn");
    if (analyzeBtn) {
      analyzeBtn.disabled = true;
      analyzeBtn.textContent = "解析中...";
    }

    container.innerHTML = `
      <div class="box" style="text-align: center;">
        <div class="spinner"></div>
        <h4 class="loading-text">🤖 LLM解析中...</h4>
        <p>${data.message}</p>
      </div>
    `;
  };

  const showLLMResponse = (data) => {
    const container = document.getElementById("table");
    if (!container) return;

    // ボタンを再活性化する
    const analyzeBtn = document.getElementById("analyzeBtn");
    if (analyzeBtn) {
      analyzeBtn.disabled = false;
      analyzeBtn.textContent = "🤖 変数を解析";
    }

    let tableRows = data.variables.map(variable => `
      <tr>
        <td class="variable-name">${variable.name}</td>
        <td>${variable.role}</td>
        <td class="variable-type">${variable.type || ''}</td>
      </tr>
    `).join('');

    container.innerHTML = `
      <div class="box">
        <h4>🤖 LLM変数解析結果</h4>
        <div style="margin-bottom: 10px;">
          <strong>ファイル:</strong> ${data.fileName} | 
          <strong>言語:</strong> ${data.languageId} | 
          <strong>変数数:</strong> ${data.variables.length}
        </div>
        <table>
          <thead>
            <tr class="table-header">
              <th>変数名</th>
              <th>役割</th>
              <th>タイプ</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>
    `;
  };

  const showLLMError = (data) => {
    const container = document.getElementById("table");
    if (!container) return;

    // ボタンを再活性化する（エラー時）
    const analyzeBtn = document.getElementById("analyzeBtn");
    if (analyzeBtn) {
      analyzeBtn.disabled = false;
      analyzeBtn.textContent = "🤖 変数を解析";
    }

    container.innerHTML = `
      <div class="box error-text">
        <h4>❌ LLM解析エラー</h4>
        <p><strong>エラー:</strong> ${data.message}</p>
        ${data.details ? `<p><strong>詳細:</strong> ${data.details}</p>` : ''}
        <div class="info-box">
          <strong>対処方法:</strong>
          <ul>
            <li>LLM Studioサーバーが起動しているか確認</li>
            <li>拡張機能の設定でサーバーURLを確認</li>
            <li>ネットワーク接続を確認</li>
          </ul>
        </div>
      </div>
    `;
  };

  log("JavaScript読み込み完了");

  const analyzeBtn = document.getElementById("analyzeBtn");

  if (analyzeBtn) {
    analyzeBtn.addEventListener("click", () => {
      vscode.postMessage({ type: "analyzeFile" });
      log("LLM解析開始...");
    });
  }

  window.addEventListener("message", (event) => {
    const message = event.data;
    log("received: " + JSON.stringify(message));

    switch (message.type) {
      case 'llmLoading':
        showLLMLoading(message.data);
        break;
      case 'llmResponse':
        showLLMResponse(message.data);
        break;
      case 'llmError':
        showLLMError(message.data);
        break;
      default:
        log(`未知のメッセージタイプ: ${message.type}`);
    }
  });
})();
