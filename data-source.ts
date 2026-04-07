import "reflect-metadata";

import { DataSource } from "typeorm";

import dotenv from "dotenv";
import { User } from "./entities/users";
import { Book } from "./entities/books";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL!,
  logging: false,
  synchronize: true,
  entities: [User, Book],
});
