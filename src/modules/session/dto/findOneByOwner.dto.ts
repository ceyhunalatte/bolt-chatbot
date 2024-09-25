import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class FindOneByOwnerDto {
  @IsString()
  @IsNotEmpty()
  _id: string;

  @IsString()
  @IsNotEmpty()
  owner: string;
}
