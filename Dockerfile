# Dockerfile

# ベースイメージとしてNode.jsの軽量版を使用
FROM node:20-alpine AS builder

# 作業ディレクトリの設定
WORKDIR /app

# package.json と yarn.lock/package-lock.json をコピー
# キャッシュを有効活用するため、先にこれらをコピーしてインストール
COPY package.json yarn.lock* package-lock.json* ./

# 依存関係のインストール (yarn もしくは npm を選択)
# RUN yarn install --frozen-lockfile
RUN npm install

# アプリケーションのソースコードをコピー
COPY . .

# Next.jsアプリケーションのビルド
RUN npm run build

# 本番環境用のイメージ
FROM node:20-alpine

WORKDIR /app

# ビルドステージから必要なファイルをコピー
COPY . .
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
#COPY --from=builder /app/public ./public # publicディレクトリもコピー

# 環境変数を設定 (必要に応じて変更)
# ENV NODE_ENV=production
# ENV NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
# ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
# ...など、Firebaseプロジェクトに応じた環境変数を追加

# ポートの公開 (Next.jsのデフォルトポートは3000)
EXPOSE 3000

# アプリケーションの起動コマンド
CMD ["npm", "start"]