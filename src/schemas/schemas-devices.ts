import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { IoT } from "./sensordata";

export enum Type {
    Sensor = 'sensor',
    Actuator = 'actuator',
  }
  
@Schema()
export class Devices extends Document {
@Prop({required:true})
name:string;
@Prop({required:true ,unique:true})
deveui:string;
@Prop({required:true})
type:Type;
@Prop({required:false,default:'00'})
onoff?:string;
@Prop({ type: [{ type: Types.ObjectId, ref: 'IoT' }] })
  iotData?: Types.ObjectId[];
}
export const DevicesSchemas=SchemaFactory.createForClass(Devices)