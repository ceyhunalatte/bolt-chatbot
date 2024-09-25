import { Injectable } from '@nestjs/common';
import { SessionsRepository } from './sessions.repository';
import { Session } from 'src/models/session.model';
import { CreateSessionDto } from './dto/createSession.dto';
import { FindOneByOwnerDto } from './dto/findOneByOwner.dto';
import { FindOneByOwnerAndUpdateDto } from './dto/findOneByOwnerAndUpdate.dto';

export interface ISessionservice {
  createSession(dto: CreateSessionDto): Promise<Session>;
  getSession(dto: FindOneByOwnerDto): Promise<Session>;
  updateSessionByOwner(dto: FindOneByOwnerAndUpdateDto): Promise<Session>;
}

/**
 * Service for managing sessions.
 */
@Injectable()
export class SessionsService implements ISessionservice {
  constructor(private sessionsRepository: SessionsRepository) {}

  /**
   * Creates a new session.
   * @param {CreateSessionDto} dto
   * @returns {Session} session
   */
  async createSession(dto: CreateSessionDto): Promise<Session> {
    return await this.sessionsRepository.create(dto);
  }

  /**
   * Gets a session by owner.
   * @param {FindOneByOwnerDto} dto
   * @returns {Session} session
   */
  async getSession(dto: FindOneByOwnerDto): Promise<Session> {
    return await this.sessionsRepository.findOneByOwner(dto);
  }

  /**
   * Updates a session by owner.
   * @param {FindOneByOwnerAndUpdateDto} dto
   * @returns {Session} session
   */
  async updateSessionByOwner(
    dto: FindOneByOwnerAndUpdateDto,
  ): Promise<Session> {
    return await this.sessionsRepository.findOneByOwnerAndUpdate(dto);
  }
}
