"use client";

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'; // Cardコンポーネントをインポート
import { Lightbulb } from 'lucide-react'; // タスクがない場合のアイコンをインポート
import { useStudyStore } from '@/store/useStudyStore'; // Zustandストアをインポート
import { TaskItem } from './TaskItem'; // TaskItemコンポーネントをインポート
import type { Task } from '@/lib/types'; // Task型をインポート

/**
 * タスクのリストを表示し、アクティブなタスクを管理する親コンポーネント
 */
export function TaskList() {
  // useStudyStoreからタスクリストとアクティブセッションの状態を取得
  const tasks = useStudyStore((state) => state.tasks);
  const activeSession = useStudyStore((state) => state.activeSession);

  // アクティブなタスクをリストの先頭に表示するためのソート
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.id === activeSession.taskId) return -1; // アクティブなタスクを先頭に
    if (b.id === activeSession.taskId) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // それ以外は作成日で降順
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>あなたの学習タスク</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedTasks.length > 0 ? (
            sortedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                // TaskItemはuseStudyStoreからactiveSessionを直接読み込むため、activeTaskIdとonToggleは不要
                // ただし、TaskItemがactiveTaskIdとonToggleをpropsとして期待している場合、
                // TaskItemの定義を修正するか、ここにダミーのpropsを渡す必要があります。
                // 以下のTaskItemの修正で、これらのpropsは不要になります。
              />
            ))
          ) : (
            <div className="text-center py-10">
              <Lightbulb className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold font-headline">まだタスクがありません！</h3>
              <p className="text-muted-foreground">
                新しい学習タスクを追加して始めましょう。
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}