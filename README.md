# SideVar - AI Variable Dictionary

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://marketplace.visualstudio.com/items?itemName=ak-nagae.sidevar)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

VSCodeのサイドバーに現在開いているファイルの変数辞書をAI生成で表示する革新的な拡張機能です。ローカルLLMが各変数の役割を日本語で自動解析・説明します。

![SideVar Demo](assets/images/header.png)

## ✨ 主な機能

- 🤖 **AI自動解析**: ローカルLLMがファイル内の全変数を自動識別
- 📝 **日本語変数辞書**: 変数名・役割・型を見やすいカード形式で表示
- ✏️ **インタラクティブ編集**: 生成された説明を直接編集可能
- 🌐 **全言語対応**: JavaScript, Python, Java, C++, Go, Rust など全言語をサポート
- 🔒 **プライバシー重視**: ローカルLLMのみ使用、コードが外部送信されません
- ⚙️ **柔軟な設定**: お使いのローカルLLMに合わせてURL設定可能

## 🚀 使用方法

1. **LM StudioなどのローカルLLMサーバーを起動**
2. **VSCode左サイドバーのSideVarアイコンをクリック**
3. **ファイルを開いて「🤖 変数辞書を作成開始」ボタンを押下**
4. **AI生成された変数説明を確認・必要に応じて編集**

### 📹 デモ動画

[![sideVar](http://img.youtube.com/vi/YGnFqchZJ7I/sddefault.jpg)](https://youtu.be/YGnFqchZJ7I)

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

## 💡 使用例

```typescript
// 解析対象のTypeScriptファイル例
const userName = "John Doe";           // → "ユーザーの名前を保存する文字列変数"
let processCount = 0;                  // → "処理回数をカウントする数値変数"  
const apiEndpoint = "https://api...";  // → "API通信先のエンドポイントURL"
```

## 🐛 既知の問題

- ネットワーク切断時にOpenAIライブラリが接続を試行する警告が表示される場合があります
- 大きなファイル（1000行以上）では解析に時間がかかる場合があります

## 📝 リリースノート

### 1.0.0 (2024-08-23)

**🎉 初回リリース**
- ✅ AI駆動型変数辞書機能
- ✅ ローカルLLMサーバー対応（LM Studio, Ollama等）
- ✅ 日本語での変数役割解説
- ✅ インタラクティブ編集機能
- ✅ 全プログラミング言語サポート
- ✅ プライバシー重視設計（ローカル処理のみ）

## 🤝 コントリビュート

バグ報告や機能要望は[GitHub Issues](https://github.com/ak-nagae/sidevar/issues)でお願いします。

## 📜 ライセンス

このプロジェクトはMITライセンスの下で提供されています。詳細は[LICENSE](LICENSE)ファイルをご覧ください。

---

**🚀 開発効率を向上させるAI変数辞書をぜひお試しください！**
