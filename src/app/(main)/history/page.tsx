import { SessionHistoryClient } from '@/components/history/SessionHistoryClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { History } from 'lucide-react';

export const metadata = {
  title: 'セッション履歴 - 学習ワイズ',
};

export default function HistoryPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center">
            <History className="mr-3 h-8 w-8 text-primary" />
            セッション履歴
          </CardTitle>
          <CardDescription>
            過去のすべての学習セッションを確認し、メモを追加し、ログを管理します。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SessionHistoryClient />
        </CardContent>
      </Card>
    </div>
  );
}
