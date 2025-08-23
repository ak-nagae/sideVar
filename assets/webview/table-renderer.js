// Table rendering functionality
class TableRenderer {
  static showDictionaryStart() {
    const container = document.getElementById("table");
    if (!container) {
      return;
    }

    // ボタンを非活性にする
    const analyzeBtn = document.getElementById("analyzeBtn");
    if (analyzeBtn) {
      analyzeBtn.disabled = true;
      analyzeBtn.textContent = "変数辞書作成中...";
    }

    container.innerHTML = `
      <div class="box dictionary-creating" style="text-align: center;">
        <h3>🤖 変数辞書を作成開始</h3>
        <p>LLMが変数を解析中です...</p>
      </div>
    `;

    // Show table container when content is added
    container.style.display = "block";
  }
  static showLLMLoading(data) {
    const container = document.getElementById("table");
    if (!container) {
      return;
    }

    // ボタンを非活性にする
    const analyzeBtn = document.getElementById("analyzeBtn");
    if (analyzeBtn) {
      analyzeBtn.disabled = true;
      analyzeBtn.textContent = "変数辞書作成中...";
    }

    container.innerHTML = `
      <div class="box" style="text-align: center;">
        <div class="spinner"></div>
        <h4 class="loading-text">🤖 変数辞書を作成中...</h4>
      </div>
    `;

    // Show table container when content is added
    container.style.display = "block";
  }

  static showLLMResponse(data) {
    const container = document.getElementById("table");
    if (!container) {
      return;
    }

    // ボタンを再活性化する
    const analyzeBtn = document.getElementById("analyzeBtn");
    if (analyzeBtn) {
      analyzeBtn.disabled = false;
      analyzeBtn.textContent = "🤖 変数辞書を再生成";
    }

    let tableRows = data.variables
      .map(
        (variable, index) => `
      <tr>
        <td class="variable-name">${variable.name}</td>
        <td class="variable-role editable-cell" data-variable-index="${index}">${
          variable.role
        }</td>
        <td class="variable-type">${variable.type || ""}</td>
      </tr>
    `
      )
      .join("");

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

    // Show table container when content is added
    container.style.display = "block";

    // 編集機能を有効化
    EditableCell.attachEditListeners(container);
  }

  static showLLMError(data) {
    const container = document.getElementById("table");
    if (!container) {
      return;
    }

    // ボタンを再活性化する（エラー時）
    const analyzeBtn = document.getElementById("analyzeBtn");
    if (analyzeBtn) {
      analyzeBtn.disabled = false;
      analyzeBtn.textContent = "🤖 変数辞書を作成開始";
    }

    container.innerHTML = `
      <div class="box error-text">
        <h4>❌ 変数辞書の作成に失敗しました</h4>
        <p><strong>エラー:</strong> ${data.message}</p>
        ${data.details ? `<p><strong>詳細:</strong> ${data.details}</p>` : ""}
        <div class="info-box">
          <p><strong>💡 解決方法:</strong></p>
          <ul>
            <li>LLM Studioサーバーが起動しているか確認</li>
            <li>拡張機能の設定でサーバーURLを確認</li>
            <li>ネットワーク接続を確認</li>
          </ul>
          <p style="margin-top: 15px; font-weight: bold; color: #0e639c;">
            上記を確認後、「🤖 変数辞書を作成開始」ボタンをクリックして再生成してください
          </p>
        </div>
      </div>
    `;

    // Show table container when content is added
    container.style.display = "block";
  }
}
