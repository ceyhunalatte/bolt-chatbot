import { IsNotEmpty, IsObject } from 'class-validator';
import { JWTPayload } from 'src/types';

export class CreateChat {
  @IsObject()
  @IsNotEmpty()
  user: JWTPayload;
}
