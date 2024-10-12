import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { JWTPayload } from 'src/types';

export class GetChat {
  @IsString()
  @IsNotEmpty()
  _id: string;

  @IsObject()
  @IsNotEmpty()
  user: JWTPayload;
}
