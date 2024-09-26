import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from 'src/models/message.model'; // Import Message schema
import { CreateMessageDto } from './dto/createMessage.dto';

export interface IMessagesRepository {
  create(dto: CreateMessageDto): Promise<Message>;
  createMany(dto: CreateMessageDto[]): Promise<Message[]>;
  getMessagesBySessionId(sessionId: string): Promise<Message[]>;
}

@Injectable()
export class MessagesRepository implements IMessagesRepository {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
  ) {}

  async create(dto: CreateMessageDto): Promise<Message> {
    return await this.messageModel.create(dto);
  }

  async createMany(dto: CreateMessageDto[]): Promise<Message[]> {
    return await this.messageModel.insertMany(dto);
  }

  async getMessagesBySessionId(sessionId: string): Promise<Message[]> {
    return this.messageModel
      .find({ sessionId })
      .sort({ createdAt: 1 })
      .select('role message sessionId')
      .lean();
  }
}
