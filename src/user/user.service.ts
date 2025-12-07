import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { db } from '../db/db';

import { uuidV4Regex } from 'src/utils/uuidV4Regex';
import { PrismaService } from 'prisma/prisma.service';
import { User } from '@prisma/client';

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

  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async findOne(id: string): Promise<User> {
    this.validateUuid(id);
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const now = Date.now();
    return await this.prisma.user.create({
      data: {
        ...createUserDto,
        createdAt: now,
        updatedAt: now,
      },
    });
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
      data: { password: dto.newPassword, updatedAt: Date.now() },
    });

    return updated;
  }

  async remove(id: string): Promise<void> {
    this.validateUuid(id);

    const deleted = this.prisma.user.deleteMany({ where: { id } });
    if (!deleted) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
}
