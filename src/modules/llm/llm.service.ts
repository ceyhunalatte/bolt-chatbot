import { Injectable } from '@nestjs/common';
import { CohereClient } from 'cohere-ai';

@Injectable()
export class LlmService {
  llmService: CohereClient;

  constructor() {
    this.llmService = new CohereClient({
      token: process.env.COHERE_API_SECRET,
    });
  }
}
