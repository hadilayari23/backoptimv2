import { Type } from "src/schemas/schemas-devices";

export class CreateDeviceDto {
name :string;
deveui:string;
type:Type;
}