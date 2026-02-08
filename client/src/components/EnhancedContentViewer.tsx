import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, FileCode, Image as ImageIcon, BookOpen, BarChart3, AlertCircle, BookMarked } from "lucide-react";
import { Streamdown } from "streamdown";
import { DataVisualizations } from "./DataVisualizations";
import { ConceptCard } from "./ConceptCard";
import { PracticeProblems } from "./PracticeProblems";
import { SummarySection } from "./SummarySection";
import type { GeneratedContent } from "../../../drizzle/schema";

interface EnhancedContentViewerProps {
  content: GeneratedContent | null;
  isLoading: boolean;
}

// Sample concept data for different topics
const sampleConcepts: Record<string, any[]> = {
  "Newton's Laws": [
    {
      title: "First Law of Motion",
      description: "An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force.",
      formula: "F = 0 → a = 0",
      keyPoints: [
        "Objects resist changes in their state of motion (inertia)",
        "Without external force, velocity remains constant",
        "This explains why you slide forward when a car suddenly stops",
      ],
      difficulty: "beginner",
    },
    {
      title: "Second Law of Motion",
      description: "The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass.",
      formula: "F = ma",
      keyPoints: [
        "Greater force produces greater acceleration",
        "Heavier objects require more force for the same acceleration",
        "This is the most commonly used law in physics problems",
      ],
      difficulty: "intermediate",
    },
    {
      title: "Third Law of Motion",
      description: "For every action, there is an equal and opposite reaction.",
      formula: "F₁₂ = -F₂₁",
      keyPoints: [
        "Forces always come in pairs",
        "The forces act on different objects",
        "Explains how rockets and swimming work",
      ],
      difficulty: "beginner",
    },
  ],
  "Projectile Motion": [
    {
      title: "Horizontal Motion",
      description: "The horizontal component of motion remains constant throughout the flight.",
      formula: "x = v₀ₓ × t",
      keyPoints: [
        "No acceleration in horizontal direction (ignoring air resistance)",
        "Horizontal velocity remains constant",
        "Distance traveled depends on initial velocity and time",
      ],
      difficulty: "intermediate",
    },
    {
      title: "Vertical Motion",
      description: "The vertical component follows free fall motion under gravity.",
      formula: "y = v₀ᵧ × t - ½gt²",
      keyPoints: [
        "Constant acceleration due to gravity (g = 9.8 m/s²)",
        "Initial vertical velocity depends on launch angle",
        "Vertical velocity changes throughout the flight",
      ],
      difficulty: "intermediate",
    },
  ],
};

export function EnhancedContentViewer({ content, isLoading }: EnhancedContentViewerProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <div className="space-y-2">
            <p className="text-lg font-medium">Generating Physics Content...</p>
            <p className="text-sm text-muted-foreground">
              Creating explanations, diagrams, visualizations, and practice problems
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Ready to Learn Physics</h3>
            <p className="text-muted-foreground">
              Enter a physics topic above to generate AI-powered explanations with interactive visualizations, practice problems, and more
            </p>
          </div>
        </div>
      </div>
    );
  }

  const concepts = sampleConcepts[content.topic] || [];

  return (
    <PanelGroup direction="horizontal" className="h-full">
      {/* Left Panel - Diagram/Visualization */}
      <Panel defaultSize={35} minSize={25}>
        <Card className="h-full border-2 border-border bg-card/50 backdrop-blur">
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
              <ImageIcon className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-lg">Physics Diagram</h3>
            </div>

            {content.status === "generating" ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-3">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                  <p className="text-sm text-muted-foreground">Generating diagram...</p>
                </div>
              </div>
            ) : content.diagramUrl ? (
              <div className="flex-1 flex items-center justify-center overflow-auto">
                <img
                  src={content.diagramUrl}
                  alt={`Diagram for ${content.topic}`}
                  className="max-w-full max-h-full object-contain rounded-lg border border-border"
                />
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <p>No diagram available</p>
              </div>
            )}
          </div>
        </Card>
      </Panel>

      <PanelResizeHandle className="w-2 bg-border hover:bg-primary transition-colors" />

      {/* Right Panel - Explanation and Interactive Content */}
      <Panel defaultSize={65} minSize={40}>
        <Card className="h-full border-2 border-border bg-card/50 backdrop-blur">
          <Tabs defaultValue="explanation" className="h-full flex flex-col">
            <div className="px-6 pt-6">
              <TabsList className="grid w-full grid-cols-5 bg-muted/50 h-auto">
                <TabsTrigger value="explanation" className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <BookOpen className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Explanation</span>
                  <span className="sm:hidden">Explain</span>
                </TabsTrigger>
                <TabsTrigger value="concepts" className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <BookMarked className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Concepts</span>
                  <span className="sm:hidden">Concept</span>
                </TabsTrigger>
                <TabsTrigger value="visualizations" className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <BarChart3 className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Visualizations</span>
                  <span className="sm:hidden">Visual</span>
                </TabsTrigger>
                <TabsTrigger value="practice" className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Practice</span>
                  <span className="sm:hidden">Pract</span>
                </TabsTrigger>
                <TabsTrigger value="code" className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <FileCode className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Code</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Explanation Tab */}
            <TabsContent value="explanation" className="flex-1 overflow-hidden mt-0 p-6">
              <ScrollArea className="h-full pr-4">
                {content.status === "generating" ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-3">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                      <p className="text-sm text-muted-foreground">Generating explanation...</p>
                    </div>
                  </div>
                ) : content.explanation ? (
                  <div className="prose prose-invert max-w-none">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">{content.topic}</h2>
                    <Streamdown>{content.explanation}</Streamdown>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No explanation available</p>
                )}
              </ScrollArea>
            </TabsContent>

            {/* Concepts Tab */}
            <TabsContent value="concepts" className="flex-1 overflow-hidden mt-0 p-6">
              <ScrollArea className="h-full pr-4">
                <div className="space-y-4">
                  {concepts.length > 0 ? (
                    concepts.map((concept, idx) => (
                      <ConceptCard
                        key={idx}
                        title={concept.title}
                        description={concept.description}
                        formula={concept.formula}
                        keyPoints={concept.keyPoints}
                        difficulty={concept.difficulty}
                      />
                    ))
                  ) : (
                    <p className="text-muted-foreground">No concept cards available</p>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Visualizations Tab */}
            <TabsContent value="visualizations" className="flex-1 overflow-hidden mt-0 p-6">
              <ScrollArea className="h-full pr-4">
                <DataVisualizations topic={content.topic} />
              </ScrollArea>
            </TabsContent>

            {/* Practice Tab */}
            <TabsContent value="practice" className="flex-1 overflow-hidden mt-0 p-6">
              <ScrollArea className="h-full pr-4">
                <div className="space-y-4">
                  <PracticeProblems topic={content.topic} />
                  <SummarySection topic={content.topic} />
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Code Tab */}
            <TabsContent value="code" className="flex-1 overflow-hidden mt-0 p-6">
              <ScrollArea className="h-full pr-4">
                {content.status === "generating" ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-3">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                      <p className="text-sm text-muted-foreground">Generating animation code...</p>
                    </div>
                  </div>
                ) : content.animationCode ? (
                  <pre className="bg-background/50 p-4 rounded-lg border border-border overflow-x-auto">
                    <code className="text-sm text-foreground font-mono whitespace-pre-wrap break-words">
                      {content.animationCode}
                    </code>
                  </pre>
                ) : (
                  <p className="text-muted-foreground">No animation code available</p>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </Card>
      </Panel>
    </PanelGroup>
  );
}
