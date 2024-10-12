import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT } from 'src/types';

export interface IAuthService {
  signJwt(payload: Record<string, string | number>): Promise<JWT>;
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
   * @returns {Promise<JWT>} jwt
   */
  async signJwt(payload: Record<string, string | number>): Promise<JWT> {
    return { token: await this.jwtService.signAsync(payload) };
  }
}
