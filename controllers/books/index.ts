import { Request, Response } from "express";
import { BookService } from "../../services/books";
import { AuthRequest } from "../../middlewares/auth-middleware";
import { UpdateBookDto } from "../../validation/books";

const bookService = new BookService();

type Params = {
  id: string;
};
export class BookController {
  async create(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;

      const book = await bookService.createBook(userId, req.body);

      res.status(201).json(book);
    } catch (e: any) {
      if (e.message === "AUTHOR_NOT_FOUND") {
        return res.status(404).json({ message: "Author not found" });
      }
      res.status(500).json({ message: "Error creating book" });
    }
  }

  async update(req: Request<Params, {}, UpdateBookDto>, res: Response) {
    try {
      const book = await bookService.updateBook(req.params.id, req.body);
      res.json(book);
    } catch (e: any) {
      if (e.message === "BOOK_NOT_FOUND") {
        return res.status(404).json({ message: "Book not found" });
      }
      res.status(500).json({ message: "Error updating book" });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const books = await bookService.getBooks(page, limit);

      res.json(books);
    } catch {
      res.status(500).json({ message: "Error fetching books" });
    }
  }

  async getByAuthor(req: Request<Params>, res: Response) {
    try {
      const books = await bookService.getBooksByAuthor(req.params.id);
      res.json(books);
    } catch {
      res.status(500).json({ message: "Error fetching books" });
    }
  }

  async delete(req: Request<Params>, res: Response) {
    try {
      const result = await bookService.deleteBook(req.params.id);
      res.json(result);
    } catch {
      res.status(500).json({ message: "Error deleting book" });
    }
  }
}
