import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthUser {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  username: string;

  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  password: string;
}
