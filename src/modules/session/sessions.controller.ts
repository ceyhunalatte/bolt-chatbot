import { Controller, Get, Param, Query } from '@nestjs/common';
import { SessionsService } from './sessions.service';

interface ISessionsController {
  get: (query: { id: any }) => string;
}

@Controller('api/sessions')
export class SessionsController implements ISessionsController {
  constructor(private readonly sessionService: SessionsService) {}

  @Get()
  get(@Query() query: any): string {
    return this.sessionService.getSession(query);
  }
}
