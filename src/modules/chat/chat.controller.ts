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

interface IChatController {
  create: (body: CreateChat) => Promise<Chat>;
  get: (body: GetChat) => Promise<Chat>;
  getMany: (query: GetChats) => Promise<Chat[]>;
  getMessages: (query: { id: string }) => Promise<Message[]>;
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
  get(@Body() body: GetChat): Promise<Chat> {
    return this.chatService.get(body);
  }

  @UseGuards(AuthGuard)
  @Get('/all')
  getMany(@Query() query: GetChats): Promise<Chat[]> {
    return this.chatService.getMany(query);
  }

  @Get('/messages')
  getMessages(@Query() query: { id: string }): Promise<Message[]> {
    return this.messageService.getMessagesBySessionId(query.id);
  }
}
