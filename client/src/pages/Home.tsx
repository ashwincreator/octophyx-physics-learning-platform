import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Library } from "lucide-react";
import { TopicInput } from "@/components/TopicInput";
import { ContentViewer } from "@/components/ContentViewer";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import type { GeneratedContent } from "../../../drizzle/schema";

export default function Home() {
  const [location, setLocation] = useLocation();
  const [currentContent, setCurrentContent] = useState<GeneratedContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentId, setContentId] = useState<number | null>(null);

  // Check for topic in URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const topic = params.get('topic');
    if (topic) {
      handleTopicSubmit(topic);
      // Clear URL params
      window.history.replaceState({}, '', '/');
    }
  }, [location]);

  const generateMutation = trpc.physics.generateContent.useMutation({
    onSuccess: (data) => {
      setContentId(data.contentId);
    },
    onError: (error) => {
      console.error("Generation failed:", error);
      setIsGenerating(false);
    },
  });

  const { data: content } = trpc.physics.getContent.useQuery(
    { id: contentId! },
    { 
      enabled: contentId !== null,
      refetchInterval: (query) => {
        // Poll every 2 seconds while generating
        const data = query.state.data;
        if (data && (data.status === "generating" || data.status === "pending")) {
          return 2000;
        }
        return false;
      },
    }
  );

  // Update current content when query data changes
  useEffect(() => {
    if (content) {
      setCurrentContent(content);
      if (content.status === "completed" || content.status === "failed") {
        setIsGenerating(false);
      }
    }
  }, [content]);

  const handleTopicSubmit = (topic: string) => {
    setIsGenerating(true);
    setCurrentContent(null);
    generateMutation.mutate({ topic });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b-2 border-border bg-card/30 backdrop-blur">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/20 border-2 border-primary flex items-center justify-center">
                <BookOpen className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Physics Learning Platform</h1>
                <p className="text-sm text-muted-foreground">AI-Powered Interactive Physics Education</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setLocation("/library")}
              className="border-2"
            >
              <Library className="mr-2 h-4 w-4" />
              Topics Library
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Topic Input Section */}
        <div className="border-b-2 border-border bg-card/20 backdrop-blur py-8">
          <div className="container">
            <TopicInput onSubmit={handleTopicSubmit} isLoading={isGenerating} />
          </div>
        </div>

        {/* Content Display Section */}
        <div className="flex-1 py-8">
          <div className="container h-full">
            <div className="h-full min-h-[600px]">
              <ContentViewer content={currentContent} isLoading={isGenerating} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-border bg-card/30 backdrop-blur py-6">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Powered by AI • Blueprint-inspired design for technical precision</p>
        </div>
      </footer>
    </div>
  );
}
