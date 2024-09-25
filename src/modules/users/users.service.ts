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

/**
 * Service for managing users.
 */
@Injectable()
export class UsersService implements IUsersService {
  constructor(
    private usersRepository: UsersRepository,
    private authService: AuthService,
  ) {}

  /**
   * With given credentials, logs the user in or creates a user then logs the user in.
   * @param {CreateOrLoginDto} dto
   * @returns {User} user
   */
  async createOrLogin(
    dto: CreateOrLoginDto,
  ): Promise<{ user: User; access: JWTPayload }> {
    const user = await this.usersRepository.findByUsername(dto.username);
    if (user) return await this.login(dto, user);
    else return await this.create(dto);
  }

  /**
   * Creates a new user and logs in.
   * @param {CreateOrLoginDto} dto
   * @returns {User} user
   */
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

  /**
   * Logs the user in.
   * @param {CreateOrLoginDto} dto
   * @param {User} user? Found user object if any.
   * @throws {NotFoundException} If user not found.
   * @throws {UnauthorizedException} If invalid password.
   * @returns
   * */
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
