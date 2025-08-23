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
      <div class="box">
        <div class="start-animation">
          <div class="pulse-icon">🤖</div>
          <h3 class="start-title">変数辞書を作成開始</h3>
          <div class="progress-dots">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <p class="start-subtitle">ファイルをLLMに送信中...</p>
        </div>
      </div>
    `;

    // Show table container when content is added
    container.style.display = "block";
  }
  static showLLMLoading() {
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

    // スケルトンローダー用のカードを生成
    const skeletonCards = Array.from({ length: 4 }, () => `
      <div class="skeleton-card">
        <div class="skeleton-card-header">
          <div class="skeleton-line skeleton-variable-name"></div>
          <div class="skeleton-line skeleton-variable-type"></div>
        </div>
        <div class="skeleton-line skeleton-role-line1"></div>
        <div class="skeleton-line skeleton-role-line2"></div>
      </div>
    `).join("");

    container.innerHTML = `
      <div class="box">
        <div class="loading-header">
          <div class="loading-spinner"></div>
          <h4 class="loading-text">🤖 変数辞書を作成中...</h4>
          <p class="loading-subtitle">LLMが変数を解析しています</p>
        </div>
        <div class="skeleton-cards-container">
          ${skeletonCards}
        </div>
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

    let variableCards = data.variables
      .map(
        (variable, index) => `
      <div class="variable-card">
        <div class="variable-card-header">
          <h3 class="variable-card-name">${variable.name}</h3>
          <p class="variable-card-type">${variable.type || ""}</p>
        </div>
        <p class="variable-card-role editable-cell" data-variable-index="${index}">${
          variable.role
        }</p>
      </div>
    `
      )
      .join("");

    container.innerHTML = `
      <div class="box">
        <h4>🤖 LLM変数解析結果</h4>
        <div class="results-info">
          <strong>ファイル:</strong> ${data.fileName} | 
          <strong>言語:</strong> ${data.languageId} | 
          <strong>変数数:</strong> ${data.variables.length}
        </div>
        <div class="variable-cards-container">
          ${variableCards}
        </div>
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
