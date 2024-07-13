import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, } from "class-validator";
import { Types } from "mongoose";
import { Role, } from "src/schemas/schemas-users";

export class UsersDto {
    @MaxLength(10)
    @IsString()
    @IsNotEmpty()
    name :string;
    @MaxLength(10)
    @IsString()
    @IsNotEmpty()
    lastname:string;
    @IsEmail()
    @IsNotEmpty()
    email:string;
    
    @IsNotEmpty()
    @IsEnum(Role, { each: true })
    roles: Role;  
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    pass:string;
    @IsArray()
    @IsOptional()
    devices?: Types.ObjectId[];
    @IsArray()
    @IsOptional()
    users?: Types.ObjectId[];
}
