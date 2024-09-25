import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, User } from '../../models/user.model';

export interface IUsersRepository {
  findById(id: string): Promise<UserDocument | null>;
  findByUsername(username: string): Promise<UserDocument | null>;
  create(data: { username: string; password: string }): Promise<UserDocument>;
  update(id: string, user: User): Promise<UserDocument | null>;
  delete(id: string): Promise<void>;
}

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id);
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username });
  }

  async create(data: {
    username: string;
    password: string;
  }): Promise<UserDocument> {
    return this.userModel.create(data);
  }

  async update(id: string, user: User): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(id, user, { new: true });
  }

  async delete(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id);
  }
}
