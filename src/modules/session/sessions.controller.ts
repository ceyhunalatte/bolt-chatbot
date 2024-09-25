import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { AuthGuard } from '../auth/auth.guard';
import { Session } from 'src/models/session.model';
import { CreateSessionDto } from './dto/create.dto';
import { JWTPayload } from 'src/types';
import { GetSessionDto } from './dto/getSession.dto';

interface ISessionsController {
  create: (request: { user: { id: string } }) => Promise<Session>;
  get: (dto: GetSessionDto) => Promise<Session>;
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
  get(@Query() dto: GetSessionDto): Promise<Session> {
    return this.sessionService.getSession(dto);
  }
}
