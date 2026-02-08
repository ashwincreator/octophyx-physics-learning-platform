import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { createPhysicsProblem, getPhysicsProblemById, getUserPhysicsProblems, updatePhysicsProblem, createProblemSolution, getProblemSolutionByProblemId, updateProblemSolution } from "./db";
import { invokeLLM } from "./_core/llm";
import { generateImage } from "./_core/imageGeneration";

export const problemSolverRouter = router({
  // Submit a new problem for solving
  submitProblem: protectedProcedure
    .input(
      z.object({
        problemText: z.string().min(10),
        problemImageUrl: z.string().optional(),
        category: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const problemId = await createPhysicsProblem({
        userId: ctx.user.id,
        problemText: input.problemText,
        problemImageUrl: input.problemImageUrl,
        category: input.category,
        difficulty: "medium",
        isBookmarked: 0,
      });

      // Create solution record with pending status
      const solutionId = await createProblemSolution({
        problemId,
        status: "generating",
      });

      return { problemId, solutionId };
    }),

  // Generate solution for a problem
  generateSolution: protectedProcedure
    .input(z.object({ problemId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const problem = await getPhysicsProblemById(input.problemId);
      if (!problem || problem.userId !== ctx.user.id) {
        throw new Error("Problem not found or unauthorized");
      }

      const solution = await getProblemSolutionByProblemId(input.problemId);
      if (!solution) {
        throw new Error("Solution record not found");
      }

      try {
        // Generate solution using LLM
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content:
                "You are an expert physics tutor. Provide detailed step-by-step solutions to physics problems with clear explanations, formulas, and reasoning.",
            },
            {
              role: "user",
              content: `Solve this physics problem and provide a detailed step-by-step solution:\n\n${problem.problemText}`,
            },
          ],
        });

        const solutionText =
          typeof response.choices[0].message.content === "string"
            ? response.choices[0].message.content
            : "";

        // Generate diagram for the problem
        let diagramUrl: string | undefined = undefined;
        try {
          const diagramResponse = await generateImage({
            prompt: `Create a physics diagram for this problem: ${problem.problemText.substring(0, 100)}. Include all relevant forces, vectors, and measurements.`,
          });
          diagramUrl = diagramResponse.url;
        } catch (err) {
          console.warn("Failed to generate diagram:", err);
        }

        // Parse solution into steps
        const steps = solutionText.split("\n\n").filter((s) => s.trim()).slice(0, 10);

        // Update solution with generated content
      await updateProblemSolution(solution.id, {
        solution: solutionText,
        steps: JSON.stringify(steps),
        diagramUrl: diagramUrl || undefined,
        status: "completed",
      });

        return { success: true, solutionId: solution.id };
      } catch (error) {
        await updateProblemSolution(solution.id, {
          status: "failed",
        });
        throw error;
      }
    }),

  // Get problem and its solution
  getProblemWithSolution: protectedProcedure
    .input(z.object({ problemId: z.number() }))
    .query(async ({ ctx, input }) => {
      const problem = await getPhysicsProblemById(input.problemId);
      if (!problem || problem.userId !== ctx.user.id) {
        throw new Error("Problem not found or unauthorized");
      }

      const solution = await getProblemSolutionByProblemId(input.problemId);

      return { problem, solution };
    }),

  // Get user's problem history
  getProblemHistory: protectedProcedure.query(async ({ ctx }) => {
    return await getUserPhysicsProblems(ctx.user.id);
  }),

  // Bookmark/unbookmark a problem
  toggleBookmark: protectedProcedure
    .input(z.object({ problemId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const problem = await getPhysicsProblemById(input.problemId);
      if (!problem || problem.userId !== ctx.user.id) {
        throw new Error("Problem not found or unauthorized");
      }

      await updatePhysicsProblem(input.problemId, {
        isBookmarked: problem.isBookmarked ? 0 : 1,
      });

      return { success: true };
    }),

  // Get hints for a problem
  getHints: protectedProcedure
    .input(z.object({ problemId: z.number() }))
    .query(async ({ ctx, input }) => {
      const problem = await getPhysicsProblemById(input.problemId);
      if (!problem || problem.userId !== ctx.user.id) {
        throw new Error("Problem not found or unauthorized");
      }

      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content:
              "You are a helpful physics tutor. Provide 3-4 helpful hints to guide students towards solving the problem without giving away the answer.",
          },
          {
            role: "user",
            content: `Provide hints for solving this physics problem:\n\n${problem.problemText}`,
          },
        ],
      });

      const hintsText =
        typeof response.choices[0].message.content === "string"
          ? response.choices[0].message.content
          : "";

      const hints = hintsText.split("\n").filter((h) => h.trim()).slice(0, 4);

      return { hints: hints.length > 0 ? hints : ["Think about the fundamental physics principles involved.", "Check if you have all the given values.", "Draw a diagram to visualize the problem."] };
    }),
});
