import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bookmark, Lightbulb, Loader2 } from "lucide-react";
import { ImprovedMarkdownRenderer } from "@/components/ImprovedMarkdownRenderer";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface SolutionDisplayProps {
  problemId: number;
  problemText: string;
  solution: any;
}

export default function SolutionDisplay({
  problemId,
  problemText,
  solution,
}: SolutionDisplayProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [hints, setHints] = useState<string[]>([]);
  const [loadingHints, setLoadingHints] = useState(false);

  const toggleBookmark = trpc.problemSolver.toggleBookmark.useMutation();
  const getHintsMutation = trpc.problemSolver.getHints.useQuery(
    { problemId },
    { enabled: false }
  );

  const handleBookmark = async () => {
    try {
      await toggleBookmark.mutateAsync({ problemId });
      setIsBookmarked(!isBookmarked);
      toast.success(isBookmarked ? "Removed from bookmarks" : "Added to bookmarks");
    } catch (error) {
      toast.error("Failed to toggle bookmark");
    }
  };

  const handleGetHints = async () => {
    setLoadingHints(true);
    try {
      const result = await getHintsMutation.refetch();
      if (result.data) {
        setHints(result.data.hints);
        setShowHints(true);
      }
    } catch (error) {
      toast.error("Failed to get hints");
    } finally {
      setLoadingHints(false);
    }
  };

  const steps = solution?.steps ? JSON.parse(solution.steps) : [];

  return (
    <div className="space-y-4">
      <Card className="border-border bg-card p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">Problem</h3>
            <p className="mt-2 text-sm text-muted-foreground">{problemText}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmark}
            className={isBookmarked ? "text-primary" : ""}
          >
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      <Tabs defaultValue="solution" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="solution">Solution</TabsTrigger>
          <TabsTrigger value="steps">Steps</TabsTrigger>
          <TabsTrigger value="diagram">Diagram</TabsTrigger>
        </TabsList>

        <TabsContent value="solution" className="space-y-4">
          <Card className="border-border bg-card p-6">
            <ImprovedMarkdownRenderer content={solution?.solution || ""} />
          </Card>
        </TabsContent>

        <TabsContent value="steps" className="space-y-4">
          {steps.length > 0 ? (
            steps.map((step: string, index: number) => (
              <Card key={index} className="border-border bg-card p-4">
                <div className="flex items-start space-x-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <ImprovedMarkdownRenderer content={step} />
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="border-border bg-card p-6">
              <p className="text-center text-muted-foreground">
                No step-by-step breakdown available yet
              </p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="diagram" className="space-y-4">
          {solution?.diagramUrl ? (
            <Card className="border-border bg-card p-6">
              <img
                src={solution.diagramUrl}
                alt="Solution diagram"
                className="w-full rounded-lg"
              />
            </Card>
          ) : (
            <Card className="border-border bg-card p-6">
              <p className="text-center text-muted-foreground">
                Diagram generation in progress or not available
              </p>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Card className="border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <span className="font-medium text-foreground">Need help?</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGetHints}
            disabled={loadingHints}
          >
            {loadingHints ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Getting Hints...
              </>
            ) : (
              "Get Hints"
            )}
          </Button>
        </div>

        {showHints && hints.length > 0 && (
          <div className="mt-4 space-y-2">
            {hints.map((hint: string, index: number) => (
              <div
                key={index}
                className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-200"
              >
                <span className="font-semibold">Hint {index + 1}:</span> {hint}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
