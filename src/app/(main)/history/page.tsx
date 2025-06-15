import { SessionHistoryClient } from '@/components/history/SessionHistoryClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { History } from 'lucide-react';

export const metadata = {
  title: 'Session History - StudyWise',
};

export default function HistoryPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center">
            <History className="mr-3 h-8 w-8 text-primary" />
            Session History
          </CardTitle>
          <CardDescription>
            Review all your past study sessions, add notes, and manage your log.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SessionHistoryClient />
        </CardContent>
      </Card>
    </div>
  );
}
