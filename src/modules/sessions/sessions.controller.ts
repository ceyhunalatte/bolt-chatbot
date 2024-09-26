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
import { SessionsService } from './sessions.service';
import { AuthGuard } from '../auth/auth.guard';
import { Session } from 'src/models/session.model';
import { CreateSessionDto } from './dto/createSession.dto';
import { FindOneByOwnerDto } from './dto/findOneByOwner.dto';
import { chatHistoryItemProps } from '../llm/llm.service';
import { MessagesService } from '../messages/messages.service';

interface ISessionsController {
  create: (request: { user: { id: string } }) => Promise<Session>;
  get: (
    request: {
      user: { id: string };
    },
    query: { id: string },
  ) => Promise<Session>;
  getMessages: (
    query: { id: string },
    request: {
      user: { id: string };
    },
  ) => Promise<chatHistoryItemProps[]>;
}

@UseGuards(AuthGuard)
@Controller('api/sessions')
export class SessionsController implements ISessionsController {
  constructor(
    private sessionService: SessionsService,
    private messagesService: MessagesService,
  ) {}

  @Post('create')
  create(@Request() request: { user: { id: string } }): Promise<Session> {
    return this.sessionService.createSession({ owner: request.user.id });
  }

  @Get()
  get(
    @Request() request: { user: { id: string } },
    @Query() query: { id: string },
  ): Promise<Session> {
    const dto: FindOneByOwnerDto = {
      owner: request.user.id,
      _id: query.id,
    };
    return this.sessionService.getSession(dto);
  }

  @Get('/all')
  getSessions(
    @Request() request: { user: { id: string } },
  ): Promise<Session[]> {
    return this.sessionService.getManyByOwner({ owner: request.user.id });
  }

  @Get('/messages')
  getMessages(
    @Query() query: { id: string },
    @Request() request: { user: { id: string } },
  ): Promise<chatHistoryItemProps[]> {
    return this.messagesService.getMessagesBySessionId(query.id);
  }
}
