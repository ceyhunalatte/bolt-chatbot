import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateOrLoginDto {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  username: string;

  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  password: string;
}
