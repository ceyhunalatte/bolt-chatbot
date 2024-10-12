import { IsString, MinLength } from 'class-validator';
import { ChatRoles } from 'src/types';

export class CreateMessageDto {
  @IsString()
  chatId: string;

  @IsString()
  message: string;

  @IsString()
  role: ChatRoles;

  @IsString()
  owner: string;
}
