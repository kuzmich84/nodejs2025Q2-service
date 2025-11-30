import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { db } from '../db/db';
import { User } from './entities/users.entity';
import { uuidV4Regex } from 'src/utils/uuidV4Regex';

@Injectable()
export class UserService {
  private isValidUuidV4(id: string): boolean {
    return uuidV4Regex.test(id);
  }

  private validateUuid(id: string): void {
    if (!this.isValidUuidV4(id)) {
      throw new BadRequestException('Invalid UUID');
    }
  }
  findAll(): User[] {
    return db.findAll();
  }

  findOne(id: string): User {
    this.validateUuid(id);
    const user = db.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  create(createUserDto: CreateUserDto): User {
    return db.create(createUserDto.login, createUserDto.password);
  }

  updatePassword(id: string, dto: UpdatePasswordDto): User {
    this.validateUuid(id);

    const user = db.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const updated = db.updatePassword(id, dto.oldPassword, dto.newPassword);
    if (!updated) {
      throw new ForbiddenException('Old password is incorrect');
    }

    return updated;
  }

  remove(id: string): void {
    this.validateUuid(id);

    const deleted = db.delete(id);
    if (!deleted) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
}
