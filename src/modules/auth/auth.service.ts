import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from 'src/types';

export interface IAuthService {
  signJwt(payload: Record<string, string | number>): Promise<JWTPayload>;
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(private jwtService: JwtService) {}

  async signJwt(payload: Record<string, string | number>): Promise<JWTPayload> {
    return { accessToken: await this.jwtService.signAsync(payload) };
  }
}
