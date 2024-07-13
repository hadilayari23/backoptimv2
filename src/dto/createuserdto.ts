import { Role } from "src/schemas/schemas-users";

export class CreateUserDto {
  name: string;
  lastname: string;
  email: string;
  pass: string;
  roles: Role;
  avatar?: string;
  users?: string[];
  devices?: string[];
  }
  