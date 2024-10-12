import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/models/user.model';
import { compareHash, hashValue } from 'src/utils/hash';
import { AuthService } from '../auth/auth.service';
import { JWT } from 'src/types';
import { AuthUser } from './dto/createOrLogin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

interface IUsersService {
  createOrLogin(dto: AuthUser): Promise<{ user: User; access: JWT }>;
  create(dto: AuthUser): Promise<{ user: User; access: JWT }>;
  login(dto: AuthUser, user?: User): Promise<{ user: User; access: JWT }>;
}

/**
 * Service for managing users.
 */
@Injectable()
export class UsersService implements IUsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private authService: AuthService,
  ) {}

  /**
   * With given credentials, logs the user in or creates a user then logs the user in.
   * @param {AuthUser} dto
   * @returns {User}
   */
  async createOrLogin(dto: AuthUser): Promise<{ user: User; access: JWT }> {
    const user = await this.userModel.findOne({ username: dto.username });
    if (user) return await this.login(dto, user);
    else return await this.create(dto);
  }

  /**
   * Creates a new user and logs in.
   * @param {AuthUser} dto
   * @returns {User}
   */
  async create(dto: AuthUser): Promise<{ user: User; access: JWT }> {
    const hashedPassword = await hashValue(dto.password);
    const user = await this.userModel.create({
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
   * @param {AuthUser} dto
   * @param {User} user? Found user object if any.
   * @throws {NotFoundException} If user not found.
   * @throws {UnauthorizedException} If invalid password.
   * @returns
   * */
  async login(
    dto: AuthUser,
    user?: User,
  ): Promise<{ user: User; access: JWT }> {
    user = user || (await this.userModel.findOne({ username: dto.username }));
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
