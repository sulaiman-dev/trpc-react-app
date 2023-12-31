import express, { Application } from "express";
import cors from "cors";
import * as trpcExpress from "@trpc/server/adapters/express";
import trpcRouter, { createContext } from "./router";

const app: Application = express();

app.use(express.json());
app.use(cors());
app.use(
  "/pet",
  trpcExpress.createExpressMiddleware({
    router: trpcRouter,
    createContext,
  })
);

app.listen(8080, () => {
  console.log("Server running on port 8080");
});
