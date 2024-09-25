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

interface ISessionsController {
  create: (request: { user: { id: string } }) => Promise<Session>;
  get: (
    request: {
      user: { id: string };
    },
    query: { id: string },
  ) => Promise<Session>;
}

@Controller('api/sessions')
export class SessionsController implements ISessionsController {
  constructor(private readonly sessionService: SessionsService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  create(@Request() request: { user: { id: string } }): Promise<Session> {
    const dto: CreateSessionDto = { owner: request.user.id };
    return this.sessionService.createSession(dto);
  }

  @UseGuards(AuthGuard)
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
}
