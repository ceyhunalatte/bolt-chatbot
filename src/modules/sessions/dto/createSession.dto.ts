import { IsNotEmpty, IsString } from 'class-validator';
import { chatHistoryItemProps } from 'src/modules/llm/llm.service';

export class CreateSessionDto {
  @IsString()
  @IsNotEmpty()
  owner: string;

  @IsNotEmpty()
  chatHistory: chatHistoryItemProps[];
}
