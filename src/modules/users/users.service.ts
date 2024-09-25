import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/models/user.model';
import { UsersRepository } from 'src/modules/users/users.repository';
import { compareHash, hashValue } from 'src/utils/hash';
import { AuthService } from '../auth/auth.service';
import { JWTPayload } from 'src/types';
import { CreateOrLoginDto } from './dto/createOrLogin.dto';

interface IUsersService {
  createOrLogin(
    dto: CreateOrLoginDto,
  ): Promise<{ user: User; access: JWTPayload }>;
  create(dto: CreateOrLoginDto): Promise<{ user: User; access: JWTPayload }>;
  login(
    dto: CreateOrLoginDto,
    user?: User,
  ): Promise<{ user: User; access: JWTPayload }>;
}

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    private usersRepository: UsersRepository,
    private authService: AuthService,
  ) {}

  async createOrLogin(
    dto: CreateOrLoginDto,
  ): Promise<{ user: User; access: JWTPayload }> {
    const user = await this.usersRepository.findByUsername(dto.username);
    if (user) return await this.login(dto, user);
    else return await this.create(dto);
  }

  async create(
    dto: CreateOrLoginDto,
  ): Promise<{ user: User; access: JWTPayload }> {
    const hashedPassword = await hashValue(dto.password);
    const user = await this.usersRepository.create({
      username: dto.username,
      password: hashedPassword,
    });

    return {
      user,
      access: await this.authService.signJwt({
        username: user.username,
        id: String(user._id),
      }),
    };
  }

  async login(
    dto: CreateOrLoginDto,
    user?: User,
  ): Promise<{ user: User; access: JWTPayload }> {
    user = user || (await this.usersRepository.findByUsername(dto.username));
    if (!user) throw new NotFoundException('User not found');

    const comparedPassword = await compareHash(dto.password, user.password);
    if (!comparedPassword) throw new UnauthorizedException('Invalid password');

    return {
      user,
      access: await this.authService.signJwt({
        username: user.username,
        id: String(user._id),
      }),
    };
  }
}
