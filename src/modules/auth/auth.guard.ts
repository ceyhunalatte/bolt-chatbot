import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { request } from 'http';
import { Socket } from 'socket.io';
import { JWTPayload } from 'src/types';

/**
 * Guard for authenticating http requests.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const httpRequest = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromHeader(httpRequest);
    if (!token) throw new UnauthorizedException();

    try {
      const payload: JWTPayload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      const requestPayloadKey =
        Object.keys(httpRequest.route.methods)[0] === 'get' ? 'query' : 'body';

      httpRequest[requestPayloadKey] = {
        ...httpRequest[requestPayloadKey],
        user: payload,
      };

      httpRequest['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

/**
 * Guard for authenticating websocket connections.
 */
@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const socket = context.switchToWs().getClient<Socket>();

    // Extract token from handshake query
    const token = socket.handshake.auth?.token;
    if (!token) {
      throw new UnauthorizedException('Missing authorization token');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      socket.data.user = payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return true;
  }
}