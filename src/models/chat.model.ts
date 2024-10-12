import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type ChatDocument = HydratedDocument<Chat>;

@Schema()
export class Chat extends Document {
  @Prop({ type: String })
  owner: string;

  @Prop({ type: String })
  chatId: string;

  @Prop({ type: Number, default: 0 })
  step: number;

  @Prop({
    type: String,
    default: 'active',
    enum: ['active', 'generating', 'finisihed'],
  })
  status: string;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
