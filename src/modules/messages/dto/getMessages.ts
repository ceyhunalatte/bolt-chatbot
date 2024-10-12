import { IsObject, IsString } from 'class-validator';
import { JWTPayload } from 'src/types';

export class GetMessages {
  @IsString()
  chatId: string;

  @IsObject()
  user: JWTPayload;
}
