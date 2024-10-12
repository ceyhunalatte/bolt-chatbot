import { UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JoinChat } from './dto/joinChat';
import { ChatService } from './chat.service';
import { WsAuthGuard } from '../auth/auth.guard';
import { ChatRoles } from 'src/types';

interface SocketWithUser extends Socket {
  user: {
    id: string;
  };
}

export interface IChatGateway {}

/**
 * Chat socket service as gateway.
 */
@WebSocketGateway({ cors: '*:*', namespace: 'chat' })
@UseGuards(WsAuthGuard)
export class ChatGateway implements IChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  /**
   * Add your connection handlers here.
   */
  handleConnection(client: Socket) {
    console.log('client connected');
  }

  /**
   * Join a chat with a bot.
   * @param {Socket} client
   * @param {JoinChat} dto
   */
  @SubscribeMessage('joinchat')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: JoinChat,
  ) {
    client.join(dto.chatId);
    this.server
      .to(dto.chatId)
      .emit('joinedToChat', `Succesfully joined to ${dto.chatId}`);
  }

  /**
   * Sends a new message to the chat room. Also listens to follow ups
   * of the event. Handles the bot response generation.
   * @param {Socket} client
   * @param {string} data
   */
  @SubscribeMessage('newMessage')
  async handleMessage(
    @ConnectedSocket() client: SocketWithUser,
    @MessageBody() data: { message: string; chatId: string; user: any },
  ) {
    const message = await this.chatService.sendMessage({
      message: data.message,
      chatId: data.chatId,
      user: client.data.user,
      role: ChatRoles.USER,
    });

    this.server.to(data.chatId).emit('newMessage', message);

    if (message.status === 'finished') return;
    const response = await this.chatService.generateBotResponse(
      data.chatId,
      data.user.id,
    );
    this.server.to(data.chatId).emit('newMessage', response);
  }
}
