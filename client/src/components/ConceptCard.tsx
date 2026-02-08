import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, BookMarked, Zap } from "lucide-react";
import { Streamdown } from "streamdown";

interface ConceptCardProps {
  title: string;
  description: string;
  formula?: string;
  keyPoints?: string[];
  difficulty?: "beginner" | "intermediate" | "advanced";
  category?: string;
}

export function ConceptCard({
  title,
  description,
  formula,
  keyPoints = [],
  difficulty = "intermediate",
  category,
}: ConceptCardProps) {
  const difficultyColors = {
    beginner: "bg-green-500/20 text-green-300 border-green-500/50",
    intermediate: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50",
    advanced: "bg-red-500/20 text-red-300 border-red-500/50",
  };

  return (
    <Card className="border-2 border-border bg-card/50 backdrop-blur hover:border-primary/50 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Lightbulb className="h-5 w-5 text-primary" />
              {title}
            </CardTitle>
            <CardDescription className="mt-2">{description}</CardDescription>
          </div>
          <Badge className={`shrink-0 border ${difficultyColors[difficulty]}`}>
            {difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Formula Section */}
        {formula && (
          <div className="bg-background/50 p-4 rounded-lg border border-border">
            <p className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Key Formula
            </p>
            <div className="font-mono text-lg text-primary break-words">
              {formula}
            </div>
          </div>
        )}

        {/* Key Points Section */}
        {keyPoints.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
              <BookMarked className="h-4 w-4" />
              Key Points
            </p>
            <ul className="space-y-2">
              {keyPoints.map((point, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="text-primary font-bold shrink-0">•</span>
                  <span className="text-sm text-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Category Badge */}
        {category && (
          <div className="pt-2 border-t border-border">
            <Badge variant="outline" className="text-xs">
              {category}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
