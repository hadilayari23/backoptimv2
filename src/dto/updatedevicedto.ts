import { PartialType } from "@nestjs/mapped-types";
import { DevicesDto } from "./devicedto";
import { CreateDeviceDto } from "./createdevicedto";

export class Updatdevicedto extends PartialType(CreateDeviceDto ){}