import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Zap, TrendingUp, Clock, Award } from "lucide-react";
import { ImprovedMarkdownRenderer } from "./ImprovedMarkdownRenderer";
import { FormulaCard, QuantumStateCard } from "./MathRenderer";
import type { GeneratedContent } from "../../../drizzle/schema";

interface LearnerDashboardProps {
  content: GeneratedContent;
  topic: string;
}

/**
 * Professional learner dashboard with Claude-like formatting
 * Displays content in an organized, readable manner
 */
export function LearnerDashboard({ content, topic }: LearnerDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">{topic}</h1>
        <p className="text-muted-foreground text-lg">
          Master this physics concept with AI-powered explanations and interactive visualizations
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2 border-border bg-card/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="text-lg font-bold text-foreground">{content.category || "Physics"}</p>
              </div>
              <BookOpen className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-border bg-card/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className={content.status === "completed" ? "bg-green-500/20 text-green-300" : "bg-yellow-500/20 text-yellow-300"}>
                  {content.status}
                </Badge>
              </div>
              <Zap className="h-8 w-8 text-accent opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-border bg-card/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="text-sm font-bold text-foreground">{new Date(content.createdAt).toLocaleDateString()}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-400 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-border bg-card/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Difficulty</p>
                <Badge variant="outline">Intermediate</Badge>
              </div>
              <Award className="h-8 w-8 text-purple-400 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="explanation" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-muted/50 h-auto p-1">
          <TabsTrigger value="explanation" className="text-xs sm:text-sm">
            <BookOpen className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Explanation</span>
            <span className="sm:hidden">Explain</span>
          </TabsTrigger>
          <TabsTrigger value="formulas" className="text-xs sm:text-sm">
            <Zap className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Formulas</span>
            <span className="sm:hidden">Formula</span>
          </TabsTrigger>
          <TabsTrigger value="concepts" className="text-xs sm:text-sm">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Concepts</span>
            <span className="sm:hidden">Concept</span>
          </TabsTrigger>
          <TabsTrigger value="examples" className="text-xs sm:text-sm">
            <Award className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Examples</span>
            <span className="sm:hidden">Example</span>
          </TabsTrigger>
          <TabsTrigger value="code" className="text-xs sm:text-sm">
            <BookOpen className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Code</span>
          </TabsTrigger>
        </TabsList>

        {/* Explanation Tab */}
        <TabsContent value="explanation" className="mt-6">
          <Card className="border-2 border-border bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Detailed Explanation</CardTitle>
              <CardDescription>
                Comprehensive breakdown of the concept with clear examples and applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                {content.explanation ? (
                  <ImprovedMarkdownRenderer content={content.explanation} />
                ) : (
                  <p className="text-muted-foreground">No explanation available yet</p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Formulas Tab */}
        <TabsContent value="formulas" className="mt-6">
          <Card className="border-2 border-border bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Key Formulas & Equations</CardTitle>
              <CardDescription>
                Important mathematical expressions and their applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-6">
                  {content.formulas ? (
                    <>
                      <div className="text-foreground">
                        <ImprovedMarkdownRenderer content={content.formulas} />
                      </div>

                      {/* Example Quantum States if applicable */}
                      {topic.toLowerCase().includes("quantum") && (
                        <div className="space-y-4 mt-6 pt-6 border-t border-border">
                          <h3 className="text-lg font-bold text-foreground">Quantum States Example</h3>

                          <QuantumStateCard
                            title="Singlet State"
                            state="|\Psi^-\rangle = \\frac{1}{\\sqrt{2}}(|01\\rangle - |10\\rangle)"
                            description="Antisymmetric quantum state with total spin 0"
                          />

                          <QuantumStateCard
                            title="Triplet State (Symmetric)"
                            state="|\Psi^+\rangle = \\frac{1}{\\sqrt{2}}(|01\\rangle + |10\\rangle)"
                            description="Symmetric quantum state with total spin 1"
                          />

                          <QuantumStateCard
                            title="Bell State |Φ⁺⟩"
                            state="|\\Phi^+\\rangle = \\frac{1}{\\sqrt{2}}(|00\\rangle + |11\\rangle)"
                            description="Maximally entangled state"
                          />

                          <QuantumStateCard
                            title="Bell State |Φ⁻⟩"
                            state="|\\Phi^-\\rangle = \\frac{1}{\\sqrt{2}}(|00\\rangle - |11\\rangle)"
                            description="Maximally entangled state with phase difference"
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-muted-foreground">No formulas available yet</p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Concepts Tab */}
        <TabsContent value="concepts" className="mt-6">
          <Card className="border-2 border-border bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Core Concepts</CardTitle>
              <CardDescription>
                Essential ideas and principles you need to understand
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {/* Placeholder concepts - will be populated from AI */}
                  <div className="p-4 bg-background/50 rounded-lg border border-border">
                    <h4 className="font-bold text-foreground mb-2">Fundamental Principle</h4>
                    <p className="text-muted-foreground text-sm">
                      Understanding the core principles is essential for mastering this topic. The AI-generated explanation above provides detailed insights into these concepts.
                    </p>
                  </div>

                  <div className="p-4 bg-background/50 rounded-lg border border-border">
                    <h4 className="font-bold text-foreground mb-2">Mathematical Framework</h4>
                    <p className="text-muted-foreground text-sm">
                      The mathematical formulas and equations are presented in the Formulas tab above, with proper LaTeX rendering for clarity.
                    </p>
                  </div>

                  <div className="p-4 bg-background/50 rounded-lg border border-border">
                    <h4 className="font-bold text-foreground mb-2">Real-World Applications</h4>
                    <p className="text-muted-foreground text-sm">
                      Learn how these concepts apply to real-world scenarios and practical problems in the Examples tab.
                    </p>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Examples Tab */}
        <TabsContent value="examples" className="mt-6">
          <Card className="border-2 border-border bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Examples & Applications</CardTitle>
              <CardDescription>
                Practical examples showing how this concept is used
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-6">
                  <div className="p-4 bg-green-500/5 rounded-lg border border-green-500/30">
                    <h4 className="font-bold text-green-300 mb-2">✓ Real-World Example</h4>
                    <p className="text-muted-foreground text-sm">
                      The AI-generated explanation includes practical examples demonstrating how this physics concept applies to real-world situations.
                    </p>
                  </div>

                  <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/30">
                    <h4 className="font-bold text-blue-300 mb-2">💡 Practical Application</h4>
                    <p className="text-muted-foreground text-sm">
                      Understanding these applications helps connect theoretical knowledge to practical engineering and scientific problems.
                    </p>
                  </div>

                  <div className="p-4 bg-purple-500/5 rounded-lg border border-purple-500/30">
                    <h4 className="font-bold text-purple-300 mb-2">🔬 Scientific Context</h4>
                    <p className="text-muted-foreground text-sm">
                      Learn about the historical development and scientific significance of this concept in the field of physics.
                    </p>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Code Tab */}
        <TabsContent value="code" className="mt-6">
          <Card className="border-2 border-border bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Animation Code</CardTitle>
              <CardDescription>
                Manim-style Python code for creating physics animations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                {content.animationCode ? (
                  <pre className="bg-background/80 p-4 rounded-lg border border-border overflow-x-auto">
                    <code className="text-sm text-foreground font-mono whitespace-pre-wrap break-words">
                      {content.animationCode}
                    </code>
                  </pre>
                ) : (
                  <p className="text-muted-foreground">No animation code available yet</p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
