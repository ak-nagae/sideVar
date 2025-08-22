# SideVar 拡張機能 - 開発進捗レポート

## 📊 プロジェクト概要

VSCodeのサイドバーに現在開いているファイルの変数名を辞書形式で表示する拡張機能。  
変数の役割説明をローカルLLM（LLM Studioサーバー）から取得して表示します。

---

## 🏗️ アーキテクチャ図

```mermaid
graph TD
    A[VSCode Editor] -->|ファイル内容取得| B[SideVar Extension]
    B -->|HTTP POST| C[LLM Studio Server]
    C -->|JSON応答| B
    B -->|表示更新| D[WebView Panel]
    
    subgraph "SideVar Extension"
        B1[Extension Host]
        B2[WebView Provider]
        B3[LLM Client]
    end
    
    subgraph "WebView UI"
        D1[ファイル解析ボタン]
        D2[変数辞書テーブル]
        D3[ローディング表示]
    end
    
    B --> B1
    B1 --> B2
    B1 --> B3
    D --> D1
    D --> D2
    D --> D3
```

---

## 🚀 開発進捗状況

```mermaid
gantt
    title SideVar 拡張機能開発スケジュール
    dateFormat X
    axisFormat %d

    section Phase 1 - 基盤構築
    PBI-1 ファイル解析ボタン機能    :done, pbi1, 0, 3
    
    section Phase 2 - Core機能
    PBI-2 LLM通信機能              :active, pbi2, 3, 8
    PBI-3 変数辞書表示UI           :pbi3, 8, 12
    PBI-4 LLM応答表示機能          :pbi4, 12, 16
    
    section Phase 3 - 拡張機能
    PBI-5 設定管理機能             :pbi5, 16, 19
    PBI-6 エラーハンドリング       :pbi6, 19, 22
    PBI-7 テスト実装              :pbi7, 22, 27
```

---

## ✅ 完了したPBI

### PBI-1: ファイル解析ボタン機能 ✅

```mermaid
flowchart LR
    A[ユーザー] -->|クリック| B[ファイル解析ボタン]
    B -->|analyzeFile メッセージ| C[Extension Host]
    C -->|activeTextEditor| D[アクティブファイル取得]
    D -->|getText| E[ファイル内容取得]
    E -->|postMessage| F[WebView表示更新]
    
    style A fill:#e1f5fe
    style B fill:#c8e6c9
    style F fill:#c8e6c9
```

**実装内容:**
- ✅ 「ファイルを解析」ボタンの実装
- ✅ 現在のアクティブファイルの内容取得
- ✅ 全言語サポート（言語制限なし）
- ✅ ファイル情報とプレビューの表示

---

## 🔄 進行中のPBI

### PBI-2: LLM Studioサーバー通信機能 🚧

```mermaid
sequenceDiagram
    participant U as User
    participant W as WebView
    participant E as Extension
    participant L as LLM Studio

    U->>W: ファイルを解析ボタン押下
    W->>E: analyzeFile メッセージ
    E->>E: ファイル内容取得
    
    Note over E,L: LLM通信フロー（実装予定）
    E->>L: HTTP POST /api/chat
    Note over L: プロンプト: このコードファイルの全ての変数とその役割を分析
    L->>E: JSON応答（変数辞書）
    E->>W: 変数リスト表示更新
```

**予定プロンプト形式:**
```
このコードファイルの全ての変数とその役割を分析してください：

[ファイル内容]

JSON形式で変数名と役割説明を返してください。
```

---

## 🎯 今後のPBI予定

### PBI-3: 変数辞書表示WebView UI

```mermaid
graph TB
    A[LLM JSON応答] --> B[パース処理]
    B --> C[変数辞書テーブル]
    
    subgraph "WebView UI コンポーネント"
        C --> D[変数名列]
        C --> E[役割説明列]
        C --> F[検索フィルター]
        C --> G[ソート機能]
    end
    
    style C fill:#fff3e0
    style D fill:#e8f5e8
    style E fill:#e8f5e8
```

### PBI-4: LLM応答による役割説明表示

```mermaid
stateDiagram-v2
    [*] --> Loading: LLM通信開始
    Loading --> Success: JSON応答取得
    Loading --> Error: 通信エラー
    Success --> Display: パース完了
    Error --> Retry: ユーザー操作
    Retry --> Loading
    Display --> [*]
    
    Success: 成功状態
    Error: エラー状態
    Loading: ローディング状態
    Display: 表示状態
```

---

## 📈 設計変更履歴

### 重要な設計決定

```mermaid
graph LR
    A[初期設計] -->|設計変更| B[最終設計]
    
    subgraph "初期設計"
        A1[自動ファイル監視]
        A2[AST変数パーサー]
        A3[言語制限あり]
    end
    
    subgraph "最終設計"
        B1[ボタン押下トリガー]
        B2[LLM全自動解析]
        B3[全言語サポート]
    end
    
    A1 -.->|シンプル化| B1
    A2 -.->|LLM活用| B2
    A3 -.->|汎用性向上| B3
    
    style A1 fill:#ffcdd2
    style A2 fill:#ffcdd2
    style A3 fill:#ffcdd2
    style B1 fill:#c8e6c9
    style B2 fill:#c8e6c9
    style B3 fill:#c8e6c9
```

**変更理由:**
- **ボタン押下方式**: ユーザーの意図的な実行、リソース効率化
- **LLM全自動解析**: 複雑なパーサー不要、全言語対応
- **シンプルなアーキテクチャ**: 開発速度向上、保守性向上

---

## 📊 ストーリーポイント進捗

```mermaid
pie title ストーリーポイント配分 (総計30pt)
    "完了" : 3
    "進行中" : 5
    "未着手" : 22
```

**詳細:**
- ✅ 完了: 3pt (10%)
- 🚧 進行中: 5pt (17%) 
- ⏳ 未着手: 22pt (73%)

---

## 🎯 MVP完成目標

**MVP完成条件**: PBI-1〜PBI-4の完了時点

```mermaid
graph LR
    A[PBI-1 ✅] --> B[PBI-2 🚧]
    B --> C[PBI-3 ⏳]
    C --> D[PBI-4 ⏳]
    D --> E[🎉 MVP完成]
    
    style A fill:#c8e6c9
    style B fill:#fff3e0
    style E fill:#e1f5fe
```

**推定完成**: 残り2-3週間