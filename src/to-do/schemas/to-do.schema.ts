/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
// import { User } from '../../user/schemas/user.schema';

export type ToDoType = HydratedDocument<ToDo>;

@Schema({ timestamps: true })
export class ToDo {
    @Prop({ required: true })
    action: string;

    @Prop({ default: true })
    complete: boolean;

    // @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'user' })
    // createdBy: User;
}

export const ToDoSchema = SchemaFactory.createForClass(ToDo)