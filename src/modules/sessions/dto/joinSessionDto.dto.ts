import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class JoinSessionDto {
  @IsString()
  @IsNotEmpty()
  sessionId: string;
}
