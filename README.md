# SideVar - 変数はサイドバーに

VSCodeのサイドバーに現在開いているファイルの変数名を辞書形式で表示する拡張機能です。ローカルLLMが各変数の役割を自動で解析・説明します。

## ✨ Features

- 🤖 **LLM自動解析**: ローカルLLMがファイル内の全変数を自動識別
- 📝 **変数辞書表示**: 変数名・役割・型を見やすいテーブルで表示
- 🌐 **全言語対応**: JavaScript, Python, Java, C++, Go など全言語をサポート
- ⚙️ **柔軟な設定**: お使いのローカルLLMに合わせてURL設定可能

## 🔧 Requirements

ローカルLLMサーバーが必要です。以下のいずれかを推奨：

- **LM Studio** - GUI で簡単セットアップ
- **Ollama** - コマンドラインベース 
- **text-generation-webui** - Web UI付き
- **LocalAI** - OpenAI API互換

## ⚙️ Extension Settings

この拡張機能は以下の設定を提供します：

### `sidevar.llmServerUrl`
- **型**: string
- **デフォルト**: `http://127.0.0.1:1234/v1`
- **説明**: OpenAI互換LLMサーバーのベースURL

### 🛠️ 設定方法

#### 方法1: VSCode設定画面
1. `Cmd/Ctrl + ,` で設定画面を開く
2. 検索バーに「sidevar」と入力
3. **SideVar: Llm Server Url** を設定

#### 方法2: settings.json に直接記述
```json
{
  "sidevar.llmServerUrl": "http://localhost:8080/api/chat"
}
```

### 📋 主要LLMツールのベースURL例

| LLMツール | ベースURL | 備考 |
|-----------|-----|------|
| **LM Studio** | `http://127.0.0.1:1234/v1` | デフォルト値・OpenAI互換 |
| **Ollama** | `http://localhost:11434/v1` | OpenAI互換エンドポイント |
| **text-generation-webui** | `http://127.0.0.1:5000/v1` | OpenAI互換モード |
| **LocalAI** | `http://localhost:8080/v1` | OpenAI互換 |
| **Llama.cpp server** | `http://localhost:8080/v1` | OpenAI互換モード |

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
