import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from 'src/types';

export interface IAuthService {
  signJwt(payload: Record<string, string | number>): Promise<JWTPayload>;
}

/**
 * Service for managing authentication.
 */
@Injectable()
export class AuthService implements IAuthService {
  constructor(private jwtService: JwtService) {}

  /**
   * Signs a JWT token with the given payload.
   * @param {Record<string, string | number>} payload
   * @returns {Promise<JWTPayload>} jwt
   */
  async signJwt(payload: Record<string, string | number>): Promise<JWTPayload> {
    return { token: await this.jwtService.signAsync(payload) };
  }
}
