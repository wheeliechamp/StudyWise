import { NoteSummarizerClient } from '@/components/summarizer/NoteSummarizerClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Brain } from 'lucide-react';

export const metadata = {
  title: 'AIノート要約 - 学習ワイズ',
};

export default function SummarizerPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-xl mb-6 bg-gradient-to-br from-primary/10 via-background to-background border-primary/20">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center text-primary">
            <Brain className="mr-3 h-8 w-8" />
            AIノート要約
          </CardTitle>
          <CardDescription className="text-lg">
            AIの力で学習ノートから重要なポイントを抽出します。本質に焦点を当てることで学習を強化しましょう。
          </CardDescription>
        </CardHeader>
      </Card>
      <NoteSummarizerClient />
    </div>
  );
}
