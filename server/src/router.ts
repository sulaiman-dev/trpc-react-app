import { z } from "zod";
import * as trpcExpress from "@trpc/server/adapters/express";
import { inferAsyncReturnType, initTRPC, TRPCError } from "@trpc/server";

let pets: Pet[] = [];

const Pet = z.object({
  id: z.number(),
  name: z.string(),
  type: z.string(),
});

const Pets = z.array(Pet);

function newId(): number {
  return Math.floor(Math.random() * 10000);
}

// created for each request
export const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({}); // no context
type Context = inferAsyncReturnType<typeof createContext>;
const t = initTRPC.context<Context>().create();

const trpcRouter = t.router({
  create: t.procedure
    .input(z.object({ name: z.string().max(50) }))
    .mutation((opts) => {
      const { input } = opts;
      const newPet: Pet = { id: newId(), name: input.name };
      pets.push(newPet);
      return newPet;
    }),
  get: t.procedure
    .input(z.number())
    .output(Pet)
    .query((opts) => {
      const { input } = opts;
      const foundPet = pets.find((pet) => pet.id === input);
      if (!foundPet) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `could not find pet with id ${input}`,
        });
      }
      return foundPet;
    }),
  list: t.procedure.output(Pets).query(() => {
    return pets;
  }),
  delete: t.procedure
    .output(z.string())
    .input(z.object({ id: z.number() }))
    .mutation((opts) => {
      const { input } = opts;

      pets = pets.filter((pet) => pet.id !== input.id);
      return "success";
    }),
});

export type Pet = z.infer<typeof Pet>;
export type Pets = z.infer<typeof Pets>;

export type TRPCRouter = typeof trpcRouter;
export default trpcRouter;
