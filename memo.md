# アプリ構成
```
StudyWise/
├── src/
│   ├── app/         # (App Router) ルーティング、レイアウト、ページのコアロジック
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── ... (他のルートやコンポーネント)
│   │
│   ├── components/  # 再利用可能なUIコンポーネント (ボタン、カードなど)
│   │   ├── ui/      # shadcn/uiのようなUIライブラリのコンポーネント
│   │   └── ...
│   │
│   ├── pages/       # (Pages Router) APIルートなど (App Routerと併用)
│   │   └── api/
│   │       └── ...
│   │
│   └── lib/         # ヘルパー関数、ユーティリティなど (推測)
│
├── public/          # 静的ファイル (画像、フォントなど)
│
├── next.config.ts   # Next.jsの設定ファイル
└── tailwind.config.ts # Tailwind CSSの設定ファイル
```
