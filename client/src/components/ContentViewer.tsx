import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, FileCode, Image as ImageIcon, BookOpen } from "lucide-react";
import { Streamdown } from "streamdown";
import type { GeneratedContent } from "../../../drizzle/schema";

interface ContentViewerProps {
  content: GeneratedContent | null;
  isLoading: boolean;
}

export function ContentViewer({ content, isLoading }: ContentViewerProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <div className="space-y-2">
            <p className="text-lg font-medium">Generating Physics Content...</p>
            <p className="text-sm text-muted-foreground">
              Creating explanation, diagrams, and animation code
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
              Enter a physics topic above to generate AI-powered explanations with interactive visualizations
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PanelGroup direction="horizontal" className="h-full">
      {/* Left Panel - Diagram/Visualization */}
      <Panel defaultSize={40} minSize={30}>
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
              <div className="flex-1 flex items-center justify-center">
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

      {/* Right Panel - Explanation and Code */}
      <Panel defaultSize={60} minSize={40}>
        <Card className="h-full border-2 border-border bg-card/50 backdrop-blur">
          <Tabs defaultValue="explanation" className="h-full flex flex-col">
            <div className="px-6 pt-6">
              <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                <TabsTrigger value="explanation" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Explanation
                </TabsTrigger>
                <TabsTrigger value="code" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <FileCode className="h-4 w-4 mr-2" />
                  Animation Code
                </TabsTrigger>
              </TabsList>
            </div>

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
                    <code className="text-sm text-foreground font-mono">{content.animationCode}</code>
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
