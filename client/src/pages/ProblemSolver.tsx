import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, History } from "lucide-react";
import { Link } from "wouter";
import ProblemSolverInput from "@/components/ProblemSolverInput";
import SolutionDisplay from "@/components/SolutionDisplay";
import { trpc } from "@/lib/trpc";
import { AnimatedOctoPhyxLogo } from "@/components/AnimatedOctoPhyxLogo";

export default function ProblemSolver() {
  const { user } = useAuth();
  const [selectedProblemId, setSelectedProblemId] = useState<number | null>(null);
  const [selectedSolutionId, setSelectedSolutionId] = useState<number | null>(null);

  const { data: problemHistory, isLoading: historyLoading } =
    trpc.problemSolver.getProblemHistory.useQuery();

  const { data: problemData, isLoading: problemLoading } =
    trpc.problemSolver.getProblemWithSolution.useQuery(
      { problemId: selectedProblemId! },
      { enabled: !!selectedProblemId }
    );

  const handleProblemSubmitted = (problemId: number, solutionId: number) => {
    setSelectedProblemId(problemId);
    setSelectedSolutionId(solutionId);
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">Please log in to use the problem solver</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Physics Problem Solver</h1>
            <div className="w-20" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="solver" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="solver">Solve Problem</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="solver" className="space-y-6">
            {selectedProblemId && problemData ? (
              <div className="space-y-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedProblemId(null)}
                  className="mb-4"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  New Problem
                </Button>
                {problemLoading ? (
                  <div className="flex justify-center">
                    <AnimatedOctoPhyxLogo />
                  </div>
                ) : (
                  <SolutionDisplay
                    problemId={selectedProblemId}
                    problemText={problemData.problem.problemText}
                    solution={problemData.solution}
                  />
                )}
              </div>
            ) : (
              <div className="grid gap-8 lg:grid-cols-2">
                <Card className="border-border bg-card p-6">
                  <h2 className="mb-4 text-xl font-semibold text-foreground">
                    Enter Your Problem
                  </h2>
                  <ProblemSolverInput onProblemSubmitted={handleProblemSubmitted} />
                </Card>

                <Card className="border-border bg-card p-6">
                  <h2 className="mb-4 text-xl font-semibold text-foreground">
                    Tips for Better Solutions
                  </h2>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start">
                      <span className="mr-3 text-primary">•</span>
                      <span>Include all given values with their units</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-primary">•</span>
                      <span>Clearly state what you need to find</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-primary">•</span>
                      <span>Mention the physics topic or concept involved</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-primary">•</span>
                      <span>Upload a diagram or image if available</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-primary">•</span>
                      <span>Be specific about any assumptions or constraints</span>
                    </li>
                  </ul>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {historyLoading ? (
              <div className="flex justify-center">
                <AnimatedOctoPhyxLogo />
              </div>
            ) : problemHistory && problemHistory.length > 0 ? (
              <div className="space-y-3">
                {problemHistory.map((problem) => (
                  <Card
                    key={problem.id}
                    className="border-border bg-card p-4 cursor-pointer transition-colors hover:bg-card/80"
                    onClick={() => setSelectedProblemId(problem.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {problem.problemText.substring(0, 100)}...
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {problem.category && (
                            <span className="inline-block mr-3 px-2 py-1 rounded bg-primary/10 text-primary">
                              {problem.category}
                            </span>
                          )}
                          {new Date(problem.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        problem.difficulty === "easy"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : problem.difficulty === "medium"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                      }`}>
                        {problem.difficulty}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-border bg-card p-8 text-center">
                <History className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">
                  No problems solved yet. Start by creating a new problem!
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
