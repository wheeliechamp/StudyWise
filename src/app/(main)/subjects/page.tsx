import { SubjectAnalyticsClient } from '@/components/subjects/SubjectAnalyticsClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

export const metadata = {
  title: '科目別分析 - 学習ワイズ',
};

export default function SubjectAnalyticsPage() {
  return (
    <div className="container mx-auto py-8">
       <Card className="shadow-xl mb-6 bg-gradient-to-br from-primary/10 via-background to-background border-primary/20">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center text-primary">
            <BookOpen className="mr-3 h-8 w-8" />
            科目別分析
          </CardTitle>
          <CardDescription className="text-lg">
            学習習慣についての洞察を得ましょう。どの科目に時間を費やし、さまざまな科目やカテゴリでどのように進捗しているかを確認できます。
          </CardDescription>
        </CardHeader>
      </Card>
      <SubjectAnalyticsClient />
    </div>
  );
}
