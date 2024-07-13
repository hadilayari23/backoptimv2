import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength, } from "class-validator";
import { Type } from "src/schemas/schemas-devices";

export class DevicesDto {
    @MaxLength(10)
    @IsString()
    @IsNotEmpty()
    name :string;
    @IsString()
    @IsNotEmpty()
    deveui:string;
    @IsNotEmpty()
    type:Type;
    @IsString()
    @IsNotEmpty()
    @MaxLength(2)
    onoff?:string

}
