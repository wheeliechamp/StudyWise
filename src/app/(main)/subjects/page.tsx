import { SubjectAnalyticsClient } from '@/components/subjects/SubjectAnalyticsClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

export const metadata = {
  title: 'Subject Analytics - StudyWise',
};

export default function SubjectAnalyticsPage() {
  return (
    <div className="container mx-auto py-8">
       <Card className="shadow-xl mb-6 bg-gradient-to-br from-primary/10 via-background to-background border-primary/20">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center text-primary">
            <BookOpen className="mr-3 h-8 w-8" />
            Subject Analytics
          </CardTitle>
          <CardDescription className="text-lg">
            Gain insights into your study habits. See where your time goes and how you're progressing across different subjects and categories.
          </CardDescription>
        </CardHeader>
      </Card>
      <SubjectAnalyticsClient />
    </div>
  );
}
