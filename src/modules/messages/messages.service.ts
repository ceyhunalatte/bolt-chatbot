import { Injectable } from '@nestjs/common';
import { CreateMessage } from './dto/createMessage';
import { Message } from 'src/models/message.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatRoles, JWTPayload } from 'src/types';
import { GetMessages } from './dto/getMessages';

interface IMessagesService {
  create(dto: CreateMessage): Promise<Message>;
  createMany(dto: CreateMessage[]): Promise<Message[]>;
  getMany(dto: GetMessages): Promise<Message[]>;
}

@Injectable()
export class MessagesService implements IMessagesService {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
  ) {}

  async create(dto: CreateMessage): Promise<Message> {
    return await this.messageModel.create(dto);
  }

  async createMany(dto: CreateMessage[]): Promise<Message[]> {
    return await this.messageModel.insertMany(dto);
  }

  async getMany(dto: GetMessages): Promise<Message[]> {
    return await this.messageModel.find({
      owner: dto.user.id,
      role: { $ne: ChatRoles.SYSTEM },
    });
  }
}
