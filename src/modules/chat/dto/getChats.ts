import { IsNotEmpty, IsObject } from 'class-validator';
import { JWTPayload } from 'src/types';

export class GetChats {
  @IsObject()
  @IsNotEmpty()
  user: JWTPayload;
}
