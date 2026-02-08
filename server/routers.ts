import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { invokeLLM } from "./_core/llm";
import { generateImage } from "./_core/imageGeneration";
import { transcribeAudio } from "./_core/voiceTranscription";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  physics: router({
    // Search physics topics for autocomplete
    searchTopics: publicProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ input }) => {
        return await db.searchPhysicsTopics(input.query);
      }),
    
    // Get topics by category
    getTopicsByCategory: publicProcedure
      .input(z.object({ category: z.string() }))
      .query(async ({ input }) => {
        return await db.getTopicsByCategory(input.category);
      }),
    
    // Get all topics
    getAllTopics: publicProcedure.query(async () => {
      return await db.getAllTopics();
    }),
    
    // Transcribe voice input
    transcribeVoice: publicProcedure
      .input(z.object({ audioUrl: z.string() }))
      .mutation(async ({ input }) => {
        const result = await transcribeAudio({
          audioUrl: input.audioUrl,
          language: "en",
          prompt: "Transcribe physics topic or concept"
        });
        
        if ('error' in result) {
          throw new Error(result.error);
        }
        
        return { text: result.text };
      }),
    
    // Generate physics explanation and content
    generateContent: publicProcedure
      .input(z.object({ 
        topic: z.string(),
        userId: z.number().optional()
      }))
      .mutation(async ({ input }) => {
        // Create initial content record
        const contentId = await db.createGeneratedContent({
          topic: input.topic,
          userId: input.userId,
          status: "generating",
        });
        
        // Generate explanation in background
        (async () => {
          try {
            // Generate physics explanation
            const explanationResponse = await invokeLLM({
              messages: [
                {
                  role: "system",
                  content: "You are a physics expert. Provide clear, detailed explanations of physics concepts with formulas and real-world applications. Format formulas in LaTeX notation."
                },
                {
                  role: "user",
                  content: `Explain the physics concept: ${input.topic}. Include key formulas, principles, and practical applications.`
                }
              ]
            });
            
            const explanationContent = explanationResponse.choices[0]?.message?.content;
            const explanation = typeof explanationContent === 'string' ? explanationContent : "";
            
            // Generate Manim-style animation code
            const codeResponse = await invokeLLM({
              messages: [
                {
                  role: "system",
                  content: "You are a Manim animation expert. Generate Python code using Manim library to visualize physics concepts."
                },
                {
                  role: "user",
                  content: `Generate Manim Python code to visualize: ${input.topic}. Include comments explaining each part.`
                }
              ]
            });
            
            const codeContent = codeResponse.choices[0]?.message?.content;
            const animationCode = typeof codeContent === 'string' ? codeContent : "";
            
            // Generate physics diagram
            let diagramUrl = "";
            try {
              const diagramResult = await generateImage({
                prompt: `Technical physics diagram illustrating ${input.topic}. Include labels, arrows, and clear visual representation. Style: educational textbook diagram with clean lines and annotations.`
              });
              diagramUrl = diagramResult.url || "";
            } catch (error) {
              console.error("Failed to generate diagram:", error);
            }
            
            // Update content with generated data
            await db.updateGeneratedContent(contentId, {
              explanation,
              animationCode,
              diagramUrl,
              status: "completed"
            });
          } catch (error) {
            console.error("Content generation failed:", error);
            await db.updateGeneratedContent(contentId, {
              status: "failed"
            });
          }
        })();
        
        return { contentId };
      }),
    
    // Get generated content by ID
    getContent: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getGeneratedContentById(input.id);
      }),
    
    // Get user's generated content history
    getUserContent: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserGeneratedContent(ctx.user.id);
    }),
  }),
});

export type AppRouter = typeof appRouter;
