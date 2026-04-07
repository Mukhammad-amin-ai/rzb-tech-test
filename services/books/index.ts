import { AppDataSource } from "../../data-source";
import { Book } from "../../entities/books";
import { User } from "../../entities/users";
import { CreateBookDto } from "../../validation/books";

export class BookService {
  private bookRepo = AppDataSource.getRepository(Book);
  private userRepo = AppDataSource.getRepository(User);

  async createBook(userId: string, dto: CreateBookDto) {
    const author = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!author) throw new Error("AUTHOR_NOT_FOUND");

    const book = this.bookRepo.create({
      title: dto.title,
      description: dto.description,
      author,
    });

    return this.bookRepo.save(book);
  }

  async updateBook(id: string, data: Partial<Book>) {
    const book = await this.bookRepo.findOne({ where: { id } });

    if (!book) throw new Error("BOOK_NOT_FOUND");

    Object.assign(book, data);

    return this.bookRepo.save(book);
  }

  async getBooks(page = 1, limit = 10) {
    const [books, total] = await this.bookRepo.findAndCount({
      relations: ["author"],
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: books,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async getBooksByAuthor(authorId: string) {
    return this.bookRepo.find({
      where: { author: { id: authorId } },
      relations: ["author"],
    });
  }

  async deleteBook(id: string) {
    const book = await this.bookRepo.findOne({ where: { id } });

    if (!book) throw new Error("BOOK_NOT_FOUND");

    await this.bookRepo.remove(book);

    return { message: "Book deleted" };
  }
}
