import { Injectable } from '@nestjs/common';
import { Chat, ChatSchema } from 'src/models/chat.model';
import { CreateChat } from './dto/createChat';
import { GetChat } from './dto/getChat';
import { UpdateChat } from './dto/updateChat';
import { questions, ResponseFactory } from './response.factory';
import { MessagesService } from '../messages/messages.service';
import { Message } from 'src/models/message.model';
import { ChatDocument } from 'cohere-ai/api';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ChatRoles, JWT, JWTPayload } from 'src/types';
import { chatHistoryItemProps } from '../llm/llm.service';
import { GetChats } from './dto/getChats';

export interface IChatStatus {
  status?: string;
  message?: Message;
  error?: string;
}

export interface IChatService {
  create(dto: CreateChat): Promise<Chat>;
  get(dto: GetChat): Promise<Chat>;
  getMany(dto: GetChats): Promise<Chat[]>;
  update(dto: UpdateChat): Promise<Chat>;
  sendMessage(data: {
    message: string;
    chatId: string;
    user: JWTPayload;
    role: string;
  }): Promise<IChatStatus>;
  generateBotResponse(chatId: string, user: JWTPayload): Promise<IChatStatus>;
}

/**
 * Service for managing sessions.
 */
@Injectable()
export class ChatService implements IChatService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
    private messagesService: MessagesService,
  ) {}

  /**
   * Creates a new chat with default messages.
   * @param {string} owner Owner id of the document.
   * @returns {Chat} New chat.
   */
  async create(dto: CreateChat): Promise<Chat> {
    const chat = await this.chatModel.create({
      owner: dto.user.id,
      chatHistory: [
        {
          role: ChatRoles.SYSTEM,
          message:
            'You are a friendly, conversational chatbot asking questions about cats.',
        },
      ],
    });

    await this.messagesService.createMany([
      {
        chatId: chat._id.toString(),
        role: ChatRoles.SYSTEM,
        message:
          'You are a friendly, conversational chatbot asking questions about cats.',
        owner: dto.user.id,
      },
    ]);

    await this.generateBotResponse(chat._id.toString(), dto.user);
    return chat;
  }

  /**
   * Get a chat by owner.
   * @param {GetChat} dto
   * @returns {Chat}
   */
  async get(dto: GetChat): Promise<Chat> {
    return await this.chatModel.findOne({
      owner: dto.user.id,
      _id: dto._id,
    });
  }

  /**
   * Gets many chats by owner.
   * @param {string} owner
   * @returns {Chat[]}
   */
  async getMany(dto: GetChats): Promise<Chat[]> {
    return await this.chatModel.find({ owner: dto.user.id });
  }

  /**
   * Updates a chat by owner.
   * @param {UpdateChat} dto
   * @returns {Chat}
   */
  async update(dto: UpdateChat): Promise<Chat> {
    return await this.chatModel.findOneAndUpdate(
      {
        owner: dto.user.id,
        _id: dto._id,
      },
      {
        $set: dto.chat,
      },
      {
        new: true,
      },
    );
  }

  /**
   * User sends a message.
   * @param data
   * @returns Created message.
   */
  async sendMessage(data: {
    message: string;
    chatId: string;
    user: JWTPayload;
    role: ChatRoles;
  }): Promise<IChatStatus> {
    const chat = await this.get({
      user: data.user,
      _id: data.chatId,
    });

    if (!chat || ['generating', 'finished'].includes(chat.status)) {
      return {
        status: chat.status,
      };
    }

    return {
      message: await this.messagesService.createMessage({
        ...data,
        owner: data.user.id,
      }),
      status: 'generating',
    };
  }

  /**
   * Generate a response for the current message.
   * @param chatId
   * @returns
   */
  async generateBotResponse(
    chatId: string,
    user: JWTPayload,
  ): Promise<IChatStatus> {
    const [chat, chatHistory] = await Promise.all([
      this.update({
        _id: chatId,
        user,
        chat: { status: 'generating' },
      }),
      this.messagesService.getMessagesBySessionId(chatId),
    ]);

    console.log(
      '---------------------------------------------------------------------------------',
    );
    console.log(chat);
    console.log(
      '---------------------------------------------------------------------------------',
    );
    if (!chat || chat.status === 'finished') {
      return {
        status: chat.status,
      };
    }

    const mappedMessages: chatHistoryItemProps[] = chatHistory.map((c) => ({
      role: c.role as ChatRoles,
      message: c.message,
    }));

    let response: string;
    try {
      const responseFactory = new ResponseFactory(chat, mappedMessages);
      response = await responseFactory.generate();
    } catch (error) {
      this.update({
        _id: chatId,
        user,
        chat: {
          status: 'active',
        },
      });
      return {
        error:
          'uh oh! we have reached the rate limit! please wait around a minute in order to continue using the bot',
      };
    }

    const shouldFinish = chat.step + 1 >= questions.length;

    const [newMessage] = await Promise.all([
      this.messagesService.createMessage({
        chatId,
        message: response,
        role: ChatRoles.BOT,
        owner: chat.owner,
      }),
      this.update({
        user,
        _id: chatId,
        chat: {
          step: chat.step + 1,
          status: shouldFinish ? 'finished' : 'active',
        },
      }),
    ]);

    return {
      status: shouldFinish ? 'finished' : 'active',
      message: newMessage,
    };
  }
}
