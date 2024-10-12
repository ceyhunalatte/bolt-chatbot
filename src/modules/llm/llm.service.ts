import { Injectable } from '@nestjs/common';
import { CohereClient } from 'cohere-ai';
import { ChatRoles } from 'src/types';

export type chatHistoryItemProps = {
  role: ChatRoles;
  message: string;
};

export interface ILlmService {
  generateResponse(data: {
    message: string;
    chatHistory: chatHistoryItemProps[];
  }): Promise<string>;
}

@Injectable()
export class LlmService implements ILlmService {
  private llmService: CohereClient;
  private model: string = 'command-r-plus-08-2024';

  constructor() {
    this.llmService = new CohereClient({
      token: process.env.COHERE_API_SECRET,
    });
  }

  async generateResponse(data: {
    message: string;
    chatHistory: chatHistoryItemProps[];
  }): Promise<string> {
    const response = await this.llmService.chat({
      model: this.model,
      ...data,
    });

    return response.text;
  }
}
