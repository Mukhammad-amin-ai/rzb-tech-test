import "reflect-metadata";

import { AppDataSource } from "./data-source";
import router from "./routes/routes";

import Express from "express";
import env from "dotenv";

const app = Express();

env.config();

app.use(Express.json());

app.use("/api", router);

AppDataSource.initialize().then(() => {
  console.log("DB connected");
  app.listen(3000, () => {
    console.log("Server started");
  });
});
