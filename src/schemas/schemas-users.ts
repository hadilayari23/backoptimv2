import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Devices } from "./schemas-devices";
export enum Role {
    SuperAdmin = 'super admin',
    Admin='admin',
  }

@Schema()
export class Users extends Document {
    
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    lastname: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    pass: string;

    @Prop({ required: true })
    roles: Role;

    @Prop({ required: false })
    avatar?: string;

    
    @Prop({ type: [{ type: Types.ObjectId, ref: 'Users' }] })
    users?: Types.Array<Users>;
    @Prop({ type: [{ type: Types.ObjectId, ref: 'Devices' }] })
    devices?: Types.Array<Devices>;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
