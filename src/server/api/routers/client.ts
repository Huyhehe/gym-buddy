import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const clientRouter = createTRPCRouter({
  preSign: protectedProcedure
    .input(
      z.object({
        file: z.custom<File | null>(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call

      return input.file;
    }),
});
