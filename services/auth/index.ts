import { AppDataSource } from "../../data-source";
import { User } from "../../entities/users";
import { SignInDto, SignUpDto } from "../../validation/auth";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "";

export class AuthService {
  private userRepo = AppDataSource.getRepository(User);

  async signin(dto: SignInDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    const isPasswordMatched = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordMatched) {
      throw new Error("INVALID_CREDENTIALS");
    }

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET_NOT_DEFINED");
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    const { password: _, ...safeUser } = user;

    return { token, user: safeUser };
  }

  async signup(dto: SignUpDto) {
    const existingUser = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new Error("USER_ALREADY_EXISTS");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = this.userRepo.create({
      fullName: dto.fullName,
      email: dto.email,
      password: hashedPassword,
    });

    const savedUser = await this.userRepo.save(newUser);

    const { password: _, ...safeUser } = savedUser;

    return safeUser;
  }
}
