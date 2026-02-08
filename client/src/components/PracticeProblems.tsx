import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, ChevronDown } from "lucide-react";

interface Problem {
  id: number;
  question: string;
  difficulty: "easy" | "medium" | "hard";
  solution: string;
  explanation: string;
  answer: string;
}

interface PracticeProblemsProps {
  problems?: Problem[];
  topic: string;
}

// Sample practice problems for different topics
const sampleProblems: Record<string, Problem[]> = {
  "Newton's Laws": [
    {
      id: 1,
      question: "A 5 kg object experiences a net force of 20 N. What is its acceleration?",
      difficulty: "easy",
      solution: "Using F = ma, we have: a = F/m = 20 N / 5 kg = 4 m/s²",
      explanation: "Newton's second law states that acceleration is directly proportional to the net force and inversely proportional to mass.",
      answer: "4 m/s²",
    },
    {
      id: 2,
      question: "A car with mass 1000 kg accelerates at 2 m/s². What is the net force acting on it?",
      difficulty: "easy",
      solution: "Using F = ma: F = 1000 kg × 2 m/s² = 2000 N",
      explanation: "The net force is the product of mass and acceleration according to Newton's second law.",
      answer: "2000 N",
    },
    {
      id: 3,
      question: "Two forces of 30 N and 40 N act on an object at right angles. Find the resultant force.",
      difficulty: "medium",
      solution: "Using Pythagoras theorem: R = √(30² + 40²) = √(900 + 1600) = √2500 = 50 N",
      explanation: "When forces act at right angles, the resultant is found using vector addition (Pythagorean theorem).",
      answer: "50 N",
    },
  ],
  "Projectile Motion": [
    {
      id: 1,
      question: "A ball is thrown horizontally with speed 20 m/s from a height of 45 m. How long does it take to hit the ground?",
      difficulty: "medium",
      solution: "Using h = ½gt², we have: 45 = ½(10)t² → t² = 9 → t = 3 seconds",
      explanation: "The vertical motion is independent of horizontal motion. We use the equation of motion for vertical displacement.",
      answer: "3 seconds",
    },
    {
      id: 2,
      question: "In the above problem, how far horizontally does the ball travel?",
      difficulty: "medium",
      solution: "Horizontal distance = horizontal velocity × time = 20 m/s × 3 s = 60 m",
      explanation: "Horizontal velocity remains constant throughout the motion (no air resistance).",
      answer: "60 m",
    },
  ],
};

export function PracticeProblems({ problems, topic }: PracticeProblemsProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  
  // Use provided problems or sample problems
  const problemList = problems || sampleProblems[topic] || [];

  if (problemList.length === 0) {
    return null;
  }

  const difficultyColors = {
    easy: "bg-green-500/20 text-green-300 border-green-500/50",
    medium: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50",
    hard: "bg-red-500/20 text-red-300 border-red-500/50",
  };

  return (
    <Card className="border-2 border-border bg-card/50 backdrop-blur mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-primary" />
          Practice Problems
        </CardTitle>
        <CardDescription>
          Test your understanding with these practice questions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {problemList.map((problem) => (
          <div key={problem.id} className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setExpandedId(expandedId === problem.id ? null : problem.id)}
              className="w-full p-4 flex items-start justify-between hover:bg-accent/50 transition-colors text-left"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge className={`border ${difficultyColors[problem.difficulty]}`}>
                    {problem.difficulty}
                  </Badge>
                  <span className="text-sm text-muted-foreground">Problem {problem.id}</span>
                </div>
                <p className="text-foreground font-medium">{problem.question}</p>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-muted-foreground shrink-0 ml-4 transition-transform ${
                  expandedId === problem.id ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedId === problem.id && (
              <div className="border-t border-border p-4 bg-background/50 space-y-4">
                {/* Answer */}
                <div>
                  <p className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Answer
                  </p>
                  <p className="text-lg font-mono text-accent">{problem.answer}</p>
                </div>

                {/* Solution */}
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">Step-by-Step Solution</p>
                  <p className="text-sm text-muted-foreground bg-background/50 p-3 rounded border border-border font-mono">
                    {problem.solution}
                  </p>
                </div>

                {/* Explanation */}
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">Explanation</p>
                  <p className="text-sm text-muted-foreground">{problem.explanation}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
