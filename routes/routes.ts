import { Router } from "express";
import { AuthController } from "../controllers/auth";
import { UserController } from "../controllers/users";
import { BookController } from "../controllers/books";

import { SignInDto, SignUpDto } from "../validation/auth";
import { CreateBookDto, UpdateBookDto } from "../validation/books";

import { validationMiddleware } from "../middlewares/validation-middleware";
import { authMiddleware } from "../middlewares/auth-middleware";

const router = Router();

const authController = new AuthController();
const userController = new UserController();
const booksController = new BookController();

router.post(
  "/signin",
  validationMiddleware(SignInDto),
  authController.signin.bind(authController),
);

router.post(
  "/signup",
  validationMiddleware(SignUpDto),
  authController.signup.bind(authController),
);

router.get(
  "/users",
  authMiddleware,
  userController.getAll.bind(userController),
);

router.get(
  "/users/:id",
  authMiddleware,
  userController.getById.bind(userController),
);

router.put(
  "/users/:id",
  authMiddleware,
  userController.update.bind(userController),
);

router.delete(
  "/users/:id",
  authMiddleware,
  userController.delete.bind(userController),
);

router.post(
  "/books",
  authMiddleware,
  validationMiddleware(CreateBookDto),
  booksController.create.bind(booksController),
);

router.get(
  "/books",
  authMiddleware,
  booksController.getAll.bind(booksController),
);

router.get(
  "/books/author/:id",
  authMiddleware,
  booksController.getByAuthor.bind(booksController),
);

router.put(
  "/books/:id",
  authMiddleware,
  validationMiddleware(UpdateBookDto),
  booksController.update.bind(booksController),
);

router.delete(
  "/books/:id",
  authMiddleware,
  booksController.delete.bind(booksController),
);

export default router;
