import * as vscode from "vscode";

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

  constructor(private readonly context: vscode.ExtensionContext) {}

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    const webview = webviewView.webview;

    webview.options = {
      enableScripts: true,
      localResourceRoots: [this.context.extensionUri],
    };

    webview.html = this.getHtml(webview);

    webview.onDidReceiveMessage((msg) => {
      if (msg?.type === "ping") {
        vscode.window.showInformationMessage("pong from extension 🤖");
      }
    });
  }

  private getHtml(webview: vscode.Webview): string {
    const nonce = getNonce();
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this.context.extensionUri,
        "assets",
        "webview",
        "main.js"
      )
    );
    const csp = [
      "default-src 'none';",
      `img-src ${webview.cspSource} https:;`,
      "style-src 'nonce-" + nonce + "';",
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
          <style nonce="${nonce}">
            body { font: 13px/1.4 -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif; padding: 10px; }
            button { padding: 6px 10px; border-radius: 8px; border: 1px solid #8883; }
            .box { padding: 10px; border: 1px solid #8883; border-radius: 8px; margin-top: 8px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #8883; padding: 4px 6px; text-align: left; }
            th { background: color-mix(in srgb, var(--vscode-sideBar-background) 80%, #ffffff 20%);
            color: var(--vscode-sideBar-foreground); }
          </style>
        </head>
        <body>
          <h3>SideVar Webview</h3>
          <p>サイドバー内で HTML を自由に描画できます。</p>
          <button id="pingBtn">拡張へメッセージ送信</button>
          <div class="box" id="log"></div>
          <div class="box" id="table"></div>

          <script nonce="${nonce}" src="${scriptUri}"></script>
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
