import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class GetSessionDto {
  @IsString()
  @IsNotEmpty()
  _id: string;
}
