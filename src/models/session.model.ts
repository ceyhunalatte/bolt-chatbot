import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SessionDocument = HydratedDocument<Session>;

@Schema()
export class Session {
  @Prop()
  owner: string;

  @Prop()
  chatId: string;

  @Prop({ default: 0 })
  answerCount: number;

  @Prop({ default: new Date() })
  createdAt: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
