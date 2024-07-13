import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./createuserdto";

export class Updateuserdto extends PartialType(CreateUserDto){}