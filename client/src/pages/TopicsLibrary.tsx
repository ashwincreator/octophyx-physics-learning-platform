import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Loader2, Atom, Waves, Zap, Orbit, Flame, Eye, Rocket } from "lucide-react";
import { useLocation } from "wouter";

const categoryIcons = {
  mechanics: Rocket,
  waves: Waves,
  electromagnetism: Zap,
  quantum: Atom,
  thermodynamics: Flame,
  optics: Eye,
  relativity: Orbit,
};

const categoryDescriptions = {
  mechanics: "Classical mechanics, motion, forces, and energy",
  waves: "Wave phenomena, interference, and oscillations",
  electromagnetism: "Electric and magnetic fields, circuits, and electromagnetic waves",
  quantum: "Quantum mechanics, uncertainty, and particle physics",
  thermodynamics: "Heat, energy transfer, and thermodynamic processes",
  optics: "Light, lenses, and optical phenomena",
  relativity: "Special and general relativity, spacetime",
};

export default function TopicsLibrary() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>("mechanics");
  
  const { data: allTopics = [], isLoading } = trpc.physics.getAllTopics.useQuery();

  const categories = Object.keys(categoryIcons) as Array<keyof typeof categoryIcons>;
  
  const topicsByCategory = categories.reduce((acc, category) => {
    acc[category] = allTopics.filter(topic => topic.category === category);
    return acc;
  }, {} as Record<string, typeof allTopics>);

  const handleTopicClick = (topicName: string) => {
    setLocation(`/?topic=${encodeURIComponent(topicName)}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Physics Topics Library</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore fundamental physics concepts across different domains
            </p>
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-7 bg-card/50 border border-border h-auto p-1">
              {categories.map((category) => {
                const Icon = categoryIcons[category];
                return (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    className="flex flex-col items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs capitalize">{category}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category} value={category} className="mt-8">
                <Card className="border-2 border-border bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      {(() => {
                        const Icon = categoryIcons[category];
                        return <Icon className="h-7 w-7 text-primary" />;
                      })()}
                      <span className="capitalize">{category}</span>
                    </CardTitle>
                    <CardDescription className="text-base">
                      {categoryDescriptions[category]}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {topicsByCategory[category]?.map((topic) => (
                        <Card 
                          key={topic.id}
                          className="border border-border bg-background/50 hover:bg-accent/50 hover:border-primary transition-all cursor-pointer group"
                          onClick={() => handleTopicClick(topic.name)}
                        >
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base group-hover:text-primary transition-colors">
                              {topic.name}
                            </CardTitle>
                            {topic.description && (
                              <CardDescription className="text-sm line-clamp-2">
                                {topic.description}
                              </CardDescription>
                            )}
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                    
                    {topicsByCategory[category]?.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        No topics available in this category yet
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          {/* Back to Home */}
          <div className="text-center pt-8">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => setLocation("/")}
              className="border-2"
            >
              Back to Learning Interface
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
