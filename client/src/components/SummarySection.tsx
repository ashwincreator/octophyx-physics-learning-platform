import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Lightbulb, Zap, TrendingUp } from "lucide-react";
import { Streamdown } from "streamdown";

interface SummaryItem {
  title: string;
  content: string;
}

interface SummaryProps {
  topic: string;
  keyTakeaways?: string[];
  realWorldApplications?: string[];
  historicalContext?: string;
  relatedTopics?: string[];
}

// Sample summary data for different topics
const sampleSummaries: Record<string, SummaryProps> = {
  "Newton's Laws": {
    topic: "Newton's Laws",
    keyTakeaways: [
      "An object at rest stays at rest unless acted upon by an external force (First Law - Inertia)",
      "Force equals mass times acceleration (F = ma) - the more force applied, the greater the acceleration (Second Law)",
      "For every action, there is an equal and opposite reaction (Third Law)",
      "These laws form the foundation of classical mechanics and explain most everyday motion",
    ],
    realWorldApplications: [
      "Car seatbelts work because of the first law - your body wants to continue moving forward",
      "Rockets accelerate by pushing exhaust gases backward (third law reaction)",
      "Heavier objects require more force to accelerate at the same rate as lighter objects",
      "Understanding these laws helps engineers design safer vehicles and structures",
    ],
    historicalContext:
      "Isaac Newton published these laws in 1687 in his groundbreaking work 'Principia Mathematica'. They revolutionized physics and remained the foundation of mechanics for over 200 years until Einstein's relativity theory.",
    relatedTopics: ["Momentum", "Energy", "Circular Motion", "Gravity"],
  },
  "Projectile Motion": {
    topic: "Projectile Motion",
    keyTakeaways: [
      "Projectile motion can be analyzed as two independent motions: horizontal (constant velocity) and vertical (constant acceleration)",
      "The horizontal velocity remains constant throughout the motion (ignoring air resistance)",
      "The vertical motion follows the equations of motion under gravity (g = 9.8 m/s²)",
      "The trajectory is a parabola when plotted on a position graph",
    ],
    realWorldApplications: [
      "Sports: Understanding projectile motion helps in calculating optimal angles for throwing or kicking",
      "Military: Calculating artillery trajectories requires projectile motion equations",
      "Space exploration: Spacecraft trajectories are calculated using projectile motion principles",
      "Engineering: Designing water fountains and sprinkler systems",
    ],
    historicalContext:
      "Galileo Galilei was one of the first to analyze projectile motion scientifically in the 16th century, showing that the trajectory is parabolic.",
    relatedTopics: ["Kinematics", "Newton's Laws", "Energy", "Circular Motion"],
  },
};

export function SummarySection({
  topic,
  keyTakeaways,
  realWorldApplications,
  historicalContext,
  relatedTopics,
}: SummaryProps) {
  const summary = sampleSummaries[topic] || {
    topic,
    keyTakeaways: keyTakeaways || [],
    realWorldApplications: realWorldApplications || [],
    historicalContext,
    relatedTopics: relatedTopics || [],
  };

  return (
    <Card className="border-2 border-border bg-card/50 backdrop-blur mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Summary & Key Takeaways
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="takeaways" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50">
            <TabsTrigger value="takeaways" className="text-xs sm:text-sm">
              <Lightbulb className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Key Takeaways</span>
              <span className="sm:hidden">Takeaways</span>
            </TabsTrigger>
            <TabsTrigger value="applications" className="text-xs sm:text-sm">
              <Zap className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Applications</span>
              <span className="sm:hidden">Apps</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs sm:text-sm">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">History</span>
              <span className="sm:hidden">Hist</span>
            </TabsTrigger>
            <TabsTrigger value="related" className="text-xs sm:text-sm">
              <BookOpen className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Related</span>
              <span className="sm:hidden">Rel</span>
            </TabsTrigger>
          </TabsList>

          {/* Key Takeaways */}
          <TabsContent value="takeaways" className="mt-6">
            <div className="space-y-3">
              {summary.keyTakeaways?.map((takeaway, idx) => (
                <div key={idx} className="flex gap-3 p-3 bg-background/50 rounded-lg border border-border">
                  <div className="text-primary font-bold text-lg shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-primary/20">
                    {idx + 1}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{takeaway}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Real-World Applications */}
          <TabsContent value="applications" className="mt-6">
            <div className="space-y-3">
              {summary.realWorldApplications?.map((app, idx) => (
                <div key={idx} className="flex gap-3 p-3 bg-background/50 rounded-lg border border-border">
                  <Zap className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">{app}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Historical Context */}
          <TabsContent value="history" className="mt-6">
            <div className="p-4 bg-background/50 rounded-lg border border-border">
              <p className="text-sm text-foreground leading-relaxed">
                {summary.historicalContext || "Historical information coming soon..."}
              </p>
            </div>
          </TabsContent>

          {/* Related Topics */}
          <TabsContent value="related" className="mt-6">
            <div className="flex flex-wrap gap-2">
              {summary.relatedTopics?.map((relatedTopic, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="px-3 py-2 text-sm border-primary/50 hover:border-primary transition-colors cursor-pointer"
                >
                  {relatedTopic}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Click on any related topic to explore more concepts
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
