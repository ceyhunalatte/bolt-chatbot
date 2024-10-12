import { IsNotEmpty, IsString } from 'class-validator';

export class JoinChat {
  @IsString()
  @IsNotEmpty()
  chatId: string;
}
