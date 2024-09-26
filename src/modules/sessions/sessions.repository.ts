import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SessionDocument, Session } from '../../models/session.model';
import { FindOneByOwnerDto } from './dto/findOneByOwner.dto';
import { CreateSessionDto } from './dto/createSession.dto';
import {
  FindOneByOwnerAndUpdateDto,
  UpdatebyIdto,
} from './dto/findOneByOwnerAndUpdate.dto';

export interface ISessionsRepository {
  findOneByOwner(dto: FindOneByOwnerDto): Promise<Session | null>;
  findMany(dto: Record<string, any>): Promise<Session[]>;
  create(dto: CreateSessionDto): Promise<Session>;
  findOneByOwnerAndUpdate(dto: {
    _id: string;
    session: Record<string, any>;
  }): Promise<Session | null>;
  findById(_id: string): Promise<Session | null>;
  updateById(dto: UpdatebyIdto): Promise<Session>;
}

@Injectable()
export class SessionsRepository implements ISessionsRepository {
  constructor(
    @InjectModel(Session.name)
    private readonly sessionModel: Model<Session>,
  ) {}

  async findOneByOwner(dto: FindOneByOwnerDto): Promise<Session | null> {
    return await this.sessionModel.findOne(dto);
  }

  async findMany(dto: Record<string, any>) {
    return await this.sessionModel.find(dto).sort('-createdAt');
  }

  async findById(_id: string): Promise<Session | null> {
    return await this.sessionModel.findById(_id);
  }

  async create(dto: CreateSessionDto): Promise<Session> {
    return await this.sessionModel.create(dto);
  }

  async findOneByOwnerAndUpdate(
    dto: FindOneByOwnerAndUpdateDto,
  ): Promise<Session | null> {
    return await this.sessionModel.findOneAndUpdate(
      { owner: dto.owner, _id: dto._id },
      dto.session,
      {
        new: true,
      },
    );
  }

  async updateById(dto: { _id: string; session: Record<string, any> }) {
    return await this.sessionModel.findByIdAndUpdate(dto._id, dto.session, {
      new: true,
    });
  }
}
