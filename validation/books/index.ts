import { IsString, IsOptional } from "class-validator";

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
