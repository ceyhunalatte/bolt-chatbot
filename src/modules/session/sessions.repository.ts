import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SessionDocument, Session } from '../../models/session.model';
import { FindOneByOwnerDto } from './dto/findOneByOwner.dto';
import { CreateSessionDto } from './dto/createSession.dto';
import { FindOneByOwnerAndUpdateDto } from './dto/findOneByOwnerAndUpdate.dto';

export interface ISessionsRepository {
  findOneByOwner(dto: FindOneByOwnerDto): Promise<Session | null>;
  create(dto: CreateSessionDto): Promise<Session>;
  findOneByOwnerAndUpdate(
    dto: FindOneByOwnerAndUpdateDto,
  ): Promise<Session | null>;
}

@Injectable()
export class SessionsRepository implements ISessionsRepository {
  constructor(
    @InjectModel(Session.name)
    private readonly sessionModel: Model<Session>,
  ) {}

  async findOneByOwner(dto: FindOneByOwnerDto): Promise<Session | null> {
    return await this.sessionModel.findOne(dto).lean();
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
}
