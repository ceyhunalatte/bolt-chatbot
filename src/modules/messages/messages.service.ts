import { Injectable } from '@nestjs/common';
import { MessagesRepository } from './messages.repository';
import { CreateMessageDto } from './dto/createMessage.dto';
import { Message } from 'src/models/message.model';

interface IMessagesService {
  createMessage(dto: CreateMessageDto): Promise<Message>;
  createMany(dto: CreateMessageDto[]): Promise<Message[]>;
  getMessagesBySessionId(sessionId: string): Promise<Message[]>;
}

@Injectable()
export class MessagesService implements IMessagesService {
  constructor(private messageRepository: MessagesRepository) {}

  async createMessage(dto: CreateMessageDto): Promise<Message> {
    return await this.messageRepository.create(dto);
  }

  async createMany(dto: CreateMessageDto[]): Promise<Message[]> {
    return await this.messageRepository.createMany(dto);
  }

  async getMessagesBySessionId(sessionId: string): Promise<Message[]> {
    return await this.messageRepository.getMessagesBySessionId(sessionId);
  }
}
