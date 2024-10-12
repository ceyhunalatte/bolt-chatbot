import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { Chat } from 'src/models/chat.model';
import { JWTPayload } from 'src/types';

export class UpdateChat {
  @IsString()
  @IsNotEmpty()
  _id: string;

  @IsNotEmpty()
  chat: Partial<Chat>;

  @IsObject()
  @IsNotEmpty()
  user: JWTPayload;
}
