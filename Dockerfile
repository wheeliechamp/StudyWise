# 公式のNode.jsイメージを使用
FROM node:18-alpine

# 作業ディレクトリを設定
WORKDIR /app

# 依存関係をコピー
COPY package.json package-lock.json ./

# 必要なパッケージをインストール
RUN npm install

# アプリのソースコードをコピー
COPY . .

# Next.jsのビルド（もし使用していれば）
RUN npm run build

# ポートの公開
EXPOSE 3000

# アプリの起動
CMD ["npm", "start"]
