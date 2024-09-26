import { Injectable } from '@nestjs/common';
import { CohereClient } from 'cohere-ai';

export type chatHistoryItemProps = {
  role: string;
  message: string;
};

export interface ILlmService {
  chat(data: { message: string; chatHistory }): Promise<string>;
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

  async chat(data: { message: string; chatHistory }): Promise<string> {
    const response = await this.llmService.chat({
      model: this.model,
      ...data,
    });

    return response.text;
  }
}
