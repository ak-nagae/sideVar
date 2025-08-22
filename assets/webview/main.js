(function () {
  const vscode = acquireVsCodeApi();

  const log = (t) => {
    const el = document.getElementById("log");
    if (el) {
      el.innerText = t;
    }
    // コンソールにもログを出力
    console.log(t);
  };

  // 初期化ログ
  log("JavaScript読み込み完了");

  // テーブル作成関数を定義
  const createTable = () => {
    log("createTable関数が呼ばれました");

    const data = [
      ["名前", "年齢", "職業"],
      ["Alice", 25, "エンジニア"],
      ["Bob", 30, "デザイナー"],
      ["Carol", 28, "マネージャー"],
    ];

    const container = document.getElementById("table");
    log(`テーブルコンテナ: ${container ? "見つかりました" : "見つかりません"}`);

    if (container) {
      // 既存のテーブルがあれば削除
      container.innerHTML = "";
      log("既存のテーブルをクリアしました");

      const table = document.createElement("table");
      table.border = "1";
      log("テーブル要素を作成しました");

      data.forEach((row, rowIndex) => {
        const tr = document.createElement("tr");

        row.forEach((cell, cellIndex) => {
          const td = document.createElement("td");
          td.innerText = cell;
          tr.appendChild(td);
        });

        table.appendChild(tr);
        log(`行${rowIndex + 1}を追加しました`);
      });

      container.appendChild(table);
      log("テーブルをコンテナに追加しました");
    } else {
      log("エラー: テーブルコンテナが見つかりません");
    }
  };

  const btn = document.getElementById("pingBtn");
  log(`ボタン: ${btn ? "見つかりました" : "見つかりません"}`);

  if (btn) {
    btn.addEventListener("click", () => {
      log("ボタンがクリックされました");
      vscode.postMessage({ type: "ping" });
      log("sent: ping");
      // ボタンクリック時にテーブルを作成
      createTable();
    });
  } else {
    log("エラー: ボタンが見つかりません");
  } // 拡張→Webview のメッセージも受け取れます
  window.addEventListener("message", (event) => {
    log("received: " + JSON.stringify(event.data));
  });
})();
