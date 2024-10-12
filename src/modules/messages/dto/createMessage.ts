import { IsString } from 'class-validator';
import { ChatRoles } from 'src/types';

export class CreateMessage {
  @IsString()
  chatId: string;

  @IsString()
  message: string;

  @IsString()
  role: ChatRoles;

  @IsString()
  owner: String;
}
