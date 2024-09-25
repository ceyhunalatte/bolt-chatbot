import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SessionDocument = HydratedDocument<Session>;

@Schema()
export class Session {
  @Prop({ type: String })
  owner: string;

  @Prop({ type: String })
  chatId: string;

  @Prop({ type: Number, default: 0 })
  answerCount: number;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
