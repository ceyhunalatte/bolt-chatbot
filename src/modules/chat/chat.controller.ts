import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '../auth/auth.guard';
import { Chat } from 'src/models/chat.model';
import { CreateChat } from './dto/createChat';
import { GetChat } from './dto/getChat';
import { MessagesService } from '../messages/messages.service';
import { Message } from 'src/models/message.model';
import { GetChats } from './dto/getChats';
import { GetMessages } from '../messages/dto/getMessages';

interface IChatController {
  create: (body: CreateChat) => Promise<Chat>;
  get: (query: GetChat) => Promise<Chat>;
  getMany: (query: GetChats) => Promise<Chat[]>;
  getMessages: (query: GetMessages) => Promise<Message[]>;
}

@UseGuards(AuthGuard)
@Controller('api/chats')
export class ChatController implements IChatController {
  constructor(
    private chatService: ChatService,
    private messageService: MessagesService,
  ) {}

  @Post('create')
  create(@Body() body: CreateChat): Promise<Chat> {
    return this.chatService.create(body);
  }

  @Get()
  get(@Query() query: GetChat): Promise<Chat> {
    return this.chatService.get(query);
  }

  @Get('/all')
  getMany(@Query() query: GetChats): Promise<Chat[]> {
    return this.chatService.getMany(query);
  }

  @Get('/messages')
  getMessages(@Query() query: GetMessages): Promise<Message[]> {
    return this.messageService.getMany(query);
  }
}
