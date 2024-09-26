import { Injectable } from '@nestjs/common';
import { SessionsRepository } from './sessions.repository';
import { Session } from 'src/models/session.model';
import { CreateSessionDto } from './dto/createSession.dto';
import { FindOneByOwnerDto } from './dto/findOneByOwner.dto';
import { FindOneByOwnerAndUpdateDto } from './dto/findOneByOwnerAndUpdate.dto';
import { questions, ResponseFactory } from './response.factory';
import { MessagesService } from '../messages/messages.service';
import { Message } from 'src/models/message.model';

export interface ISessionStatus {
  status?: string;
  message?: Message;
}

export interface ISessionservice {
  createSession({ owner }: { owner: string }): Promise<Session>;
  getSession(dto: FindOneByOwnerDto): Promise<Session>;
  getManyByOwner(dto: { owner: string }): Promise<Session[]>;
  sendMessage(data: {
    message: string;
    sessionId: string;
    owner: string;
    role: string;
  }): Promise<ISessionStatus>;
  generateBotResponse(sessionId: string): Promise<ISessionStatus>;
}

/**
 * Service for managing sessions.
 */
@Injectable()
export class SessionsService implements ISessionservice {
  constructor(
    private sessionsRepository: SessionsRepository,
    private messagesService: MessagesService,
  ) {}

  /**
   * Creates a new session with default messages.
   * @param {CreateSessionDto} dto
   * @returns {Session} session
   */
  async createSession({ owner }: { owner: string }): Promise<Session> {
    const dto: CreateSessionDto = {
      owner,
      chatHistory: [
        {
          role: 'SYSTEM',
          message:
            'You are a friendly, conversational chatbot asking questions about cats.',
        },
      ],
    };
    const session = await this.sessionsRepository.create(dto);
    await this.messagesService.createMany([
      {
        sessionId: session._id.toString(),
        role: 'SYSTEM',
        message:
          'You are a friendly, conversational chatbot asking questions about cats.',
        owner,
      },
    ]);

    await this.generateBotResponse(session._id.toString());

    return session;
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
   * Gets many sessions by owner.
   * @param {FindOneByOwnerDto} dto
   * @returns {Session[]} sessions
   */
  async getManyByOwner(dto: { owner: string }): Promise<Session[]> {
    return await this.sessionsRepository.findMany(dto);
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

  /**
   * Updates a session by id.
   * @param {FindOneByOwnerAndUpdateDto} dto
   * @returns {Session} session
   */
  async updateById(dto: {
    _id: string;
    session: Record<string, any>;
  }): Promise<Session> {
    return this.sessionsRepository.updateById(dto);
  }

  /**
   * User sends a message.
   * @param data
   * @returns Created message.
   */
  async sendMessage(data: {
    message: string;
    sessionId: string;
    owner: string;
    role: string;
  }): Promise<ISessionStatus> {
    const session = await this.getSession({
      owner: data.owner,
      _id: data.sessionId,
    });
    if (!session || ['generating', 'finished'].includes(session.status)) {
      return {
        status: session.status,
      };
    }

    return {
      message: await this.messagesService.createMessage(data),
    };
  }

  /**
   * Generate a response for the current message.
   * @param sessionId
   * @returns
   */
  async generateBotResponse(sessionId: string): Promise<ISessionStatus> {
    const [session, chatHistory] = await Promise.all([
      this.updateById({
        _id: sessionId,
        session: { status: 'generating' },
      }),
      this.messagesService.getMessagesBySessionId(sessionId),
    ]);
    if (!session || session.status === 'finished') {
      return {
        status: session.status,
      };
    }

    const responseFactory = new ResponseFactory(session, chatHistory);
    const response = await responseFactory.generate();
    const shouldFinish = session.step + 1 >= questions.length;

    const [newMessage] = await Promise.all([
      this.messagesService.createMessage({
        sessionId,
        message: response,
        role: 'CHATBOT',
        owner: '66f3d6443fda4a7b27adfed5',
      }),
      this.updateById({
        _id: sessionId,
        session: {
          step: session.step + 1,
          status: shouldFinish ? 'finished' : 'active',
        },
      }),
    ]);

    return {
      status: shouldFinish && 'finished',
      message: newMessage,
    };
  }
}
