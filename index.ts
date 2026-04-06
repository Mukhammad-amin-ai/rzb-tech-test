import Express from "express";

import { AppDataSource } from "./data-source";

const app = Express();

app.use(Express.json());

AppDataSource.initialize().then(() => {
  console.log("DB connected");
  app.listen(3000, () => {
    console.log("Server started");
  });
});
