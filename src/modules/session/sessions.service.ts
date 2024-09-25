import { Injectable } from '@nestjs/common';
import { SessionsRepository } from './sessions.repository';
import { Session } from 'src/models/session.model';

@Injectable()
export class SessionsService {
  constructor(private sessionsRepository: SessionsRepository) {}

  async createSession(dto: any): Promise<Session> {
    return await this.sessionsRepository.create(dto);
  }

  async getSession(dto: any): Promise<Session> {
    return await this.sessionsRepository.findById(dto);
  }
}
