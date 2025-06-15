"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { summarizeNotes, type SummarizeNotesInput } from '@/ai/flows/summarize-notes';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2, Loader2, ClipboardCopy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const summarizerSchema = z.object({
  notes: z.string().min(50, "ノートは50文字以上で入力してください。").max(10000, "ノートは10,000文字以内で入力してください。"),
});

type SummarizerFormData = z.infer<typeof summarizerSchema>;

export function NoteSummarizerClient() {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<SummarizerFormData>({
    resolver: zodResolver(summarizerSchema),
    defaultValues: {
      notes: "",
    },
  });

  const onSubmit: SubmitHandler<SummarizerFormData> = async (data) => {
    setIsLoading(true);
    setSummary(null);
    try {
      const result = await summarizeNotes({ notes: data.notes });
      setSummary(result.summary);
      toast({
        title: "要約が生成されました！",
        description: "ノートが正常に要約されました。",
      });
    } catch (error) {
      console.error("Error summarizing notes:", error);
      toast({
        title: "エラー",
        description: "ノートの要約に失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySummary = () => {
    if (summary) {
      navigator.clipboard.writeText(summary)
        .then(() => {
          setIsCopied(true);
          toast({ title: "コピーしました！", description: "要約がクリップボードにコピーされました。" });
          setTimeout(() => setIsCopied(false), 2000);
        })
        .catch(err => {
          toast({ title: "コピー失敗", description: "要約をコピーできませんでした。", variant: "destructive" });
        });
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-xl">学習ノートを入力</CardTitle>
              <CardDescription>簡潔な要約を得るために、学習ノートを以下に貼り付けてください。</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="notes-textarea" className="sr-only">学習ノート</FormLabel>
                    <FormControl>
                      <Textarea
                        id="notes-textarea"
                        placeholder="詳細な学習ノートをここに入力または貼り付けてください..."
                        rows={10}
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                ノートを要約
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>

      {isLoading && (
        <Card className="shadow-lg animate-pulse">
          <CardHeader>
            <CardTitle className="font-headline text-xl">要約を生成中...</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </CardContent>
        </Card>
      )}

      {summary && !isLoading && (
        <Card className="shadow-xl bg-gradient-to-br from-primary/5 via-background to-background">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="font-headline text-xl text-primary">生成された要約</CardTitle>
            <Button variant="ghost" size="icon" onClick={handleCopySummary} aria-label="要約をコピー">
              {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <ClipboardCopy className="h-4 w-4" />}
            </Button>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-foreground leading-relaxed">{summary}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
