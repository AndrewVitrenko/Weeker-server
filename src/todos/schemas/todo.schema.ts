import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TodoDocument = Todo & Document;

@Schema()
export class Todo {
  @Prop()
  ownerId: string;

  @Prop()
  text: string;

  @Prop()
  startTime: string;

  @Prop()
  endTime: string;

  @Prop()
  background?: string;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
