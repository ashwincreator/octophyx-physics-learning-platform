import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, BarChart3, Zap } from "lucide-react";

interface DataVisualizationsProps {
  visualData?: string;
  topic: string;
}

// Sample visualization data for different physics topics
const sampleVisualizations: Record<string, any> = {
  "Newton's Laws": {
    forceAcceleration: [
      { force: 0, acceleration: 0 },
      { force: 10, acceleration: 2 },
      { force: 20, acceleration: 4 },
      { force: 30, acceleration: 6 },
      { force: 40, acceleration: 8 },
    ],
    description: "Relationship between Force and Acceleration (F = ma)",
  },
  "Projectile Motion": {
    trajectory: [
      { x: 0, y: 0 },
      { x: 10, y: 8.5 },
      { x: 20, y: 14.2 },
      { x: 30, y: 17.1 },
      { x: 40, y: 17.2 },
      { x: 50, y: 14.5 },
      { x: 60, y: 8.9 },
      { x: 70, y: 0.5 },
    ],
    description: "Parabolic trajectory of a projectile",
  },
  "Wave Interference": {
    waves: [
      { x: 0, wave1: 0, wave2: 0, resultant: 0 },
      { x: 1, wave1: 0.5, wave2: 0.3, resultant: 0.8 },
      { x: 2, wave1: 0.9, wave2: 0.6, resultant: 1.5 },
      { x: 3, wave1: 1, wave2: 0.8, resultant: 1.8 },
      { x: 4, wave1: 0.8, wave2: 0.9, resultant: 1.7 },
      { x: 5, wave1: 0.3, wave2: 0.7, resultant: 1.0 },
      { x: 6, wave1: -0.3, wave2: 0.4, resultant: 0.1 },
    ],
    description: "Constructive interference of two waves",
  },
  "Circular Motion": {
    centripetal: [
      { velocity: 5, force: 5 },
      { velocity: 10, force: 20 },
      { velocity: 15, force: 45 },
      { velocity: 20, force: 80 },
      { velocity: 25, force: 125 },
    ],
    description: "Centripetal force vs velocity (F = mv²/r)",
  },
};

export function DataVisualizations({ visualData, topic }: DataVisualizationsProps) {
  // Parse visual data or use sample data
  let data = sampleVisualizations[topic] || null;
  
  if (visualData) {
    try {
      data = JSON.parse(visualData);
    } catch (e) {
      console.error("Failed to parse visual data");
    }
  }

  if (!data) {
    return null;
  }

  return (
    <Card className="border-2 border-border bg-card/50 backdrop-blur mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Interactive Visualizations
        </CardTitle>
        <CardDescription>{data.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chart1" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50">
            <TabsTrigger value="chart1">Force & Acceleration</TabsTrigger>
            <TabsTrigger value="chart2">Trajectory</TabsTrigger>
            <TabsTrigger value="chart3">Wave Pattern</TabsTrigger>
          </TabsList>

          <TabsContent value="chart1" className="mt-6">
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.forceAcceleration || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis stroke="rgba(255,255,255,0.5)" label={{ value: "Force (N)", position: "insideBottomRight", offset: -5 }} />
                  <YAxis stroke="rgba(255,255,255,0.5)" label={{ value: "Acceleration (m/s²)", angle: -90, position: "insideLeft" }} />
                  <Tooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", border: "1px solid rgba(255,255,255,0.2)" }} />
                  <Legend />
                  <Line type="monotone" dataKey="force" stroke="#3b82f6" strokeWidth={2} name="Force (N)" />
                  <Line type="monotone" dataKey="acceleration" stroke="#06b6d4" strokeWidth={2} name="Acceleration (m/s²)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="chart2" className="mt-6">
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={data.trajectory || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis stroke="rgba(255,255,255,0.5)" dataKey="x" label={{ value: "Horizontal Distance (m)", position: "insideBottomRight", offset: -5 }} />
                  <YAxis stroke="rgba(255,255,255,0.5)" label={{ value: "Height (m)", angle: -90, position: "insideLeft" }} />
                  <Tooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", border: "1px solid rgba(255,255,255,0.2)" }} />
                  <Scatter name="Trajectory" data={data.trajectory || []} fill="#06b6d4" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="chart3" className="mt-6">
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.waves || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis stroke="rgba(255,255,255,0.5)" dataKey="x" label={{ value: "Position", position: "insideBottomRight", offset: -5 }} />
                  <YAxis stroke="rgba(255,255,255,0.5)" label={{ value: "Amplitude", angle: -90, position: "insideLeft" }} />
                  <Tooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", border: "1px solid rgba(255,255,255,0.2)" }} />
                  <Legend />
                  <Line type="monotone" dataKey="wave1" stroke="#3b82f6" strokeWidth={2} name="Wave 1" />
                  <Line type="monotone" dataKey="wave2" stroke="#f59e0b" strokeWidth={2} name="Wave 2" />
                  <Line type="monotone" dataKey="resultant" stroke="#10b981" strokeWidth={3} name="Resultant" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
