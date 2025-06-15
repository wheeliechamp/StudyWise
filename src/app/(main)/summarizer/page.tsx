import { NoteSummarizerClient } from '@/components/summarizer/NoteSummarizerClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Brain } from 'lucide-react';

export const metadata = {
  title: 'AI Note Summarizer - StudyWise',
};

export default function SummarizerPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-xl mb-6 bg-gradient-to-br from-primary/10 via-background to-background border-primary/20">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center text-primary">
            <Brain className="mr-3 h-8 w-8" />
            AI Note Summarizer
          </CardTitle>
          <CardDescription className="text-lg">
            Distill key points from your study notes with the power of AI. Reinforce your learning by focusing on the essentials.
          </CardDescription>
        </CardHeader>
      </Card>
      <NoteSummarizerClient />
    </div>
  );
}
