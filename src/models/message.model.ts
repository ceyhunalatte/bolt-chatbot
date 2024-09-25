import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message extends Document {
  @Prop({ type: String })
  sessionId: string;

  @Prop({ type: String })
  message: string;

  @Prop({ type: String, enum: ['SYSTEM', 'CHATBOT', 'USER'] })
  role: string;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
