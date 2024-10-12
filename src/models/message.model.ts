import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { ChatRoles } from 'src/types';

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message extends Document {
  @Prop({ type: String })
  chatId: string;

  @Prop({ type: String })
  message: string;

  @Prop({ type: String, enum: ChatRoles, required: true })
  role: string;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
