import { Request, Response } from "express";
import { AuthService } from "../../services/auth";
import { SignInDto, SignUpDto } from "../../validation/auth";

const authService = new AuthService();
export class AuthController {
  async signin(req: Request<{}, {}, SignInDto>, res: Response) {
    try {
      const result = await authService.signin(req.body);

      return res.status(200).json({
        message: "User signed in successfully",
        body: result,
      });
    } catch (error: any) {
      switch (error.message) {
        case "USER_NOT_FOUND":
          return res.status(404).json({ message: "User not found" });

        case "INVALID_CREDENTIALS":
          return res.status(401).json({ message: "Invalid credentials" });

        default:
          return res.status(500).json({
            message: "Internal server error",
            error: error.message,
          });
      }
    }
  }

  async signup(req: Request<{}, {}, SignUpDto>, res: Response) {
    try {
      const user = await authService.signup(req.body);

      return res.status(201).json({
        message: "User created successfully",
        body: { user },
      });
    } catch (error: any) {
      switch (error.message) {
        case "USER_ALREADY_EXISTS":
          return res.status(409).json({
            message: "User already exists",
          });

        default:
          return res.status(500).json({
            message: "Error creating user",
            error: error.message,
          });
      }
    }
  }
}
