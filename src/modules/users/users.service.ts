import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { User } from 'src/models/user.model';
import {
  IUserRepository,
  UserRepository,
} from 'src/modules/users/user.repository';
import { compareHash, hashValue } from 'src/utils/hash';

interface IUsersService {
  createOrLogin(dto: { username: string; password: string }): Promise<User>;
  create(dto: { username: string; password: string }): Promise<User>;
  login(
    dto: { username: string; password: string },
    user?: User,
  ): Promise<User>;
}

@Injectable()
export class UsersService implements IUsersService {
  @Inject(UserRepository) userRepository: IUserRepository;

  async createOrLogin(dto: {
    username: string;
    password: string;
  }): Promise<User> {
    const user = await this.userRepository.findByUsername(dto.username);
    if (user) return await this.login(dto, user);
    else return await this.create(dto);
  }

  async create(dto: { username: string; password: string }): Promise<User> {
    const hashedPassword = await hashValue(dto.password);
    return await this.userRepository.create({
      username: dto.username,
      password: hashedPassword,
    });
  }

  async login(
    dto: { username: string; password: string },
    user?: User,
  ): Promise<User> {
    user = user || (await this.userRepository.findByUsername(dto.username));
    const comparedPassword = await compareHash(dto.password, user.password);
    if (!comparedPassword) throw new BadRequestException('Invalid credentials');
    return user;
  }
}
