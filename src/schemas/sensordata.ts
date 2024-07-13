import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'IoT' })
export class IoT extends Document {
  @Prop({ required: true })
  DevEUI: string;

  @Prop({ required: true })
  Temperature: number;

  @Prop({ required: true })
  Humidity: number;

  @Prop({ required: true })
  DateTime: string;
}

export const SensorData = SchemaFactory.createForClass(IoT);
