import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

import { uuidV4Regex } from 'src/utils/uuidV4Regex';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma, User } from '../generated/prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private isValidUuidV4(id: string): boolean {
    return uuidV4Regex.test(id);
  }

  private validateUuid(id: string): void {
    if (!this.isValidUuidV4(id)) {
      throw new BadRequestException('Invalid UUID');
    }
  }

  private toTimestampResponse(obj: any) {
    return {
      ...obj,
      createdAt: obj.createdAt.getTime(),
      updatedAt: obj.updatedAt.getTime(),
    };
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return users.map(this.toTimestampResponse);
  }

  async findOne(id: string): Promise<User> {
    this.validateUuid(id);
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return this.toTimestampResponse(user);
  }

  async create(dto: CreateUserDto) {
    const user = await this.prisma.user.create({
      data: {
        login: dto.login,
        password: dto.password,
      } as Prisma.UserCreateInput,
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return this.toTimestampResponse(user);
  }

  async updatePassword(id: string, dto: UpdatePasswordDto): Promise<User> {
    this.validateUuid(id);

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if (user.password !== dto.oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        password: dto.newPassword,
        version: { increment: 1 },
      },
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return this.toTimestampResponse(updated);
  }

  async remove(id: string): Promise<void> {
    this.validateUuid(id);

    const result = await this.prisma.user.deleteMany({ where: { id } });

    if (result.count === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
}
