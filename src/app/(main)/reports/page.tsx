import { Separator } from "@/components/ui/separator";

/**
 * Reports page for displaying detailed analytics and reports.
 */
export default function ReportsPage() {
  return (
    <main className="py-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">
          Detailed reports and analytics will be displayed here.
        </p>
        <Separator />
        {/* Placeholder for future report components */}
        <div className="flex h-96 items-center justify-center rounded-lg border border-dashed">
          <p className="text-sm text-muted-foreground">
            Report content coming soon...
          </p>
        </div>
      </div>
    </main>
  );
}