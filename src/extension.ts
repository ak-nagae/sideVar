import * as vscode from "vscode";
import OpenAI from "openai";

interface LLMResponse {
  variables: Array<{
    name: string;
    role: string;
    type?: string;
  }>;
}

class LLMClient {
  private readonly defaultBaseUrl = "http://127.0.0.1:1234/v1";

  async analyzeCode(fileName: string, content: string, languageId: string): Promise<LLMResponse> {
    // VSCode設定からベースURLを取得
    const config = vscode.workspace.getConfiguration("sidevar");
    const baseURL = config.get<string>("llmServerUrl", this.defaultBaseUrl);

    // OpenAIクライアント初期化
    const client = new OpenAI({
      baseURL,
      apiKey: "lm-studio", // ダミー値（ローカルLLMでは不要な場合が多い）
    });

    const prompt = `このコードファイルの全ての変数とその役割を日本語で分析してください：

ファイル名: ${fileName}
言語: ${languageId}

コード内容:
${content}

重要な指示：
- 役割説明は必ず日本語で記述してください
- 変数の用途や目的を具体的に説明してください
- 技術的な内容も日本語で表現してください

JSON形式で以下の構造で変数名と役割説明を返してください：
{
  "variables": [
    {"name": "変数名", "role": "日本語での役割説明", "type": "変数タイプ（オプション）"}
  ]
}

回答例：
{
  "variables": [
    {"name": "userName", "role": "ユーザーの名前を保存する文字列変数", "type": "string"},
    {"name": "count", "role": "処理回数をカウントする数値変数", "type": "number"}
  ]
}`;

    try {
      // LM Studio / OpenAI互換API呼び出し
      const completion = await client.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        max_tokens: 2000,
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error("LLMからの応答が空です");
      }

      return this.parseResponse(content);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`LLM通信エラー: ${error.message}`);
      }
      throw new Error("不明なエラーが発生しました");
    }
  }

  private parseResponse(content: string): LLMResponse {
    try {
      const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/) || content.match(/(\{[\s\S]*\})/);
      if (!jsonMatch) {
        throw new Error("JSON形式の応答が見つかりません");
      }

      const jsonText = jsonMatch[1] || jsonMatch[0];
      const parsed = JSON.parse(jsonText);

      if (!parsed.variables || !Array.isArray(parsed.variables)) {
        throw new Error("変数配列が見つかりません");
      }
      
      return parsed as LLMResponse;
    } catch (error) {
      throw new Error(`応答の解析に失敗: ${error}`);
    }
  }
}

export function activate(context: vscode.ExtensionContext) {
  const provider = new SideVarViewProvider(context);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      SideVarViewProvider.viewType,
      provider
    )
  );
}

export function deactivate() {}

class SideVarViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "sidevar.view";
  private webviewView: vscode.WebviewView | undefined;
  private llmClient: LLMClient;

  constructor(private readonly context: vscode.ExtensionContext) {
    this.llmClient = new LLMClient();
  }

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this.webviewView = webviewView;
    const webview = webviewView.webview;

    webview.options = {
      enableScripts: true,
      localResourceRoots: [this.context.extensionUri],
    };

    webview.html = this.getHtml(webview);

    webview.onDidReceiveMessage(async (msg) => {
      if (msg?.type === "analyzeFile") {
        await this.analyzeWithLLM();
      }
    });
  }

  private async analyzeWithLLM() {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      this.sendMessage({
        type: "error",
        data: { message: "アクティブなファイルがありません" },
      });
      return;
    }

    const document = activeEditor.document;
    const fileName = document.fileName.split("/").pop() || "";
    const fileContent = document.getText();

    // ローディング状態を送信
    this.sendMessage({
      type: "llmLoading",
      data: { message: "LLMで変数を解析中..." },
    });

    try {
      const result = await this.llmClient.analyzeCode(
        fileName,
        fileContent,
        document.languageId
      );

      this.sendMessage({
        type: "llmResponse",
        data: {
          fileName,
          languageId: document.languageId,
          variables: result.variables,
        },
      });

      vscode.window.showInformationMessage(
        `${result.variables.length}個の変数を解析しました`
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "不明なエラー";

      this.sendMessage({
        type: "llmError",
        data: {
          message: errorMessage,
          details: "LLMサーバーの設定を確認してください",
        },
      });

      vscode.window.showErrorMessage(`変数解析に失敗: ${errorMessage}`);
    }
  }

  private sendMessage(message: any) {
    if (this.webviewView) {
      this.webviewView.webview.postMessage(message);
    }
  }

  private getHtml(webview: vscode.Webview): string {
    const nonce = getNonce();
    
    // CSS and script URIs for modular structure
    const stylesUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, "assets", "webview", "styles.css")
    );
    const loggerUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, "assets", "webview", "logger.js")
    );
    const editableCellUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, "assets", "webview", "editable-cell.js")
    );
    const tableRendererUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, "assets", "webview", "table-renderer.js")
    );
    const messageHandlerUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, "assets", "webview", "message-handler.js")
    );
    const mainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, "assets", "webview", "main.js")
    );
    const csp = [
      "default-src 'none';",
      `img-src ${webview.cspSource} https:;`,
      `style-src 'nonce-${nonce}' ${webview.cspSource};`,
      // Allow scripts that either have the right nonce or are served from this webview origin
      `script-src 'nonce-${nonce}' ${webview.cspSource};`,
    ].join(" ");

    return /* html */ `
      <!DOCTYPE html>
      <html lang="ja">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="Content-Security-Policy" content="${csp}">
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>SideVar</title>
          <link rel="stylesheet" href="${stylesUri}">
        </head>
        <body>
          <h3>SideVar</h3>
          <p>現在のファイルの変数をLLMで解析します。</p>
          <button id="analyzeBtn">🤖 変数を解析</button>
          <div class="box" id="log"></div>
          <div class="box" id="table"></div>

          <!-- Load scripts in dependency order -->
          <script nonce="${nonce}" src="${loggerUri}"></script>
          <script nonce="${nonce}" src="${editableCellUri}"></script>
          <script nonce="${nonce}" src="${tableRendererUri}"></script>
          <script nonce="${nonce}" src="${messageHandlerUri}"></script>
          <script nonce="${nonce}" src="${mainUri}"></script>
        </body>
      </html>
    `;
  }
}

function getNonce() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
