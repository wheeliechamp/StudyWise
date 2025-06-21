import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // 本番環境では falseにすべき
    ignoreBuildErrors: true,
  },
  eslint: {
    // 本番環境では falseにすべき
    ignoreDuringBuilds: true,
  },
  // Next.jsのImageコンポーネントが、
  // https://placehold.coドメインから画像を最適化してロードすることを許可しています。
  // これにより、外部の画像ソースもNext.jsの画像最適化機能の恩恵を受けられます。
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // サブパスでホスト
  basePath: '/studywise',
  assetPrefix: '/studywise',
};

export default nextConfig;
