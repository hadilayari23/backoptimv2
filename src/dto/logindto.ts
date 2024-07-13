import { IsEmail, IsString } from "class-validator";

export class LoginUserDto {
  email: string;
  pass: string;
  }
