import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Loader2, Mic } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface ProblemSolverInputProps {
  onProblemSubmitted?: (problemId: number, solutionId: number) => void;
}

export default function ProblemSolverInput({
  onProblemSubmitted,
}: ProblemSolverInputProps) {
  const [problemText, setProblemText] = useState("");
  const [problemImage, setProblemImage] = useState<File | null>(null);
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const submitProblem = trpc.problemSolver.submitProblem.useMutation();
  const generateSolution = trpc.problemSolver.generateSolution.useMutation();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProblemImage(file);
      toast.success("Image selected");
    }
  };

  const handleSubmit = async () => {
    if (!problemText.trim()) {
      toast.error("Please enter a physics problem");
      return;
    }

    setIsLoading(true);
    try {
      // Submit the problem
      const result = await submitProblem.mutateAsync({
        problemText,
        category,
      });

      toast.success("Problem submitted! Generating solution...");

      // Generate the solution
      await generateSolution.mutateAsync({
        problemId: result.problemId,
      });

      if (onProblemSubmitted) {
        onProblemSubmitted(result.problemId, result.solutionId);
      }

      // Reset form
      setProblemText("");
      setProblemImage(null);
      setCategory("");
    } catch (error) {
      toast.error("Failed to submit problem");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Physics Problem
        </label>
        <Textarea
          placeholder="Describe your physics problem in detail. Include all given values, units, and what you need to find."
          value={problemText}
          onChange={(e) => setProblemText(e.target.value)}
          className="min-h-[150px] resize-none"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Category (Optional)
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={isLoading}
        >
          <option value="">Select a category</option>
          <option value="mechanics">Mechanics</option>
          <option value="waves">Waves</option>
          <option value="electromagnetism">Electromagnetism</option>
          <option value="quantum">Quantum Mechanics</option>
          <option value="thermodynamics">Thermodynamics</option>
          <option value="optics">Optics</option>
          <option value="relativity">Relativity</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Problem Image (Optional)
        </label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border bg-background/50 p-6 transition-colors hover:border-primary hover:bg-background"
        >
          <div className="text-center">
            <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              Click to upload problem image
            </p>
            {problemImage && (
              <p className="mt-1 text-xs text-primary">{problemImage.name}</p>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            disabled={isLoading}
          />
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isLoading || !problemText.trim()}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Solution...
          </>
        ) : (
          <>
            <Mic className="mr-2 h-4 w-4" />
            Solve Problem
          </>
        )}
      </Button>
    </div>
  );
}
