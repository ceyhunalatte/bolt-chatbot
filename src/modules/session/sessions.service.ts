import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionsService {
  getSession(dto: any): string {
    return 'selam';
  }
}
