import { IsString, MinLength } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  sessionId: string;

  @IsString()
  message: string;

  @IsString()
  role: string;

  @IsString()
  owner: string;
}
