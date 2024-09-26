import { UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JoinSessionDto } from './dto/joinSessionDto.dto';
import { SessionsService } from './sessions.service';
import { WsAuthGuard } from '../auth/auth.guard';

interface SocketWithUser extends Socket {
  user: {
    id: string;
  };
}

export interface ISessionGateway {}

/**
 * Session socket service as gateway.
 */
@WebSocketGateway({ cors: '*:*', namespace: 'session' })
@UseGuards(WsAuthGuard)
export class SessionsGateway implements ISessionGateway {
  @WebSocketServer()
  server: Server;

  constructor(private sessionsService: SessionsService) {}

  /**
   * Add your connection handlers here.
   */
  handleConnection(client: Socket) {
    console.log('client connected');
  }

  /**
   * Join a session with a bot.
   * @param {Socket} client
   * @param {JoinSessionDto} dto
   */
  @SubscribeMessage('joinSession')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: JoinSessionDto,
  ) {
    client.join(dto.sessionId);
    this.server
      .to(dto.sessionId)
      .emit('joinedToSession', `Succesfully joined to ${dto.sessionId}`);
  }

  /**
   * Sends a new message to the session room. Also listens to follow ups
   * of the event. Handles the bot response generation.
   * @param {Socket} client
   * @param {string} data
   */
  @SubscribeMessage('newMessage')
  async handleMessage(
    @ConnectedSocket() client: SocketWithUser,
    @MessageBody() data: { message: string; sessionId: string; user: any },
  ) {
    const message = await this.sessionsService.sendMessage({
      message: data.message,
      sessionId: data.sessionId,
      owner: client.data.user.id,
      role: 'USER',
    });

    this.server.to(data.sessionId).emit('newMessage', message);
    if (message.status === 'finished') return;
    const response = await this.sessionsService.generateBotResponse(
      data.sessionId,
    );
    this.server.to(data.sessionId).emit('newMessage', response);
  }
}
