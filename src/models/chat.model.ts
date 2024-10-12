import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type ChatDocument = HydratedDocument<Chat>;

@Schema({ timestamps: true })
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
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
