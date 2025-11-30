import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { db } from '../db/db';
import { uuidV4Regex } from 'src/utils/uuidV4Regex';

@Injectable()
export class AlbumService {
  private isValidUuidV4(id: string): boolean {
    return uuidV4Regex.test(id);
  }

  private validateUuid(id: string): void {
    if (!this.isValidUuidV4(id)) {
      throw new BadRequestException('Invalid UUID v4');
    }
  }

  findAll(): Album[] {
    return db.getAllAlbums();
  }

  findOne(id: string): Album {
    this.validateUuid(id);
    const album = db.getAlbumById(id);
    if (!album) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
    return album;
  }

  create(createAlbumDto: CreateAlbumDto): Album {
    return db.createAlbum(
      createAlbumDto.name,
      createAlbumDto.year,
      createAlbumDto.artistId ?? null,
    );
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto): Album {
    this.validateUuid(id);

    const album = db.getAlbumById(id);
    if (!album) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }

    const updated = db.updateAlbum(
      id,
      updateAlbumDto.name ?? album.name,
      updateAlbumDto.year ?? album.year,
      'artistId' in updateAlbumDto
        ? (updateAlbumDto.artistId ?? null)
        : album.artistId,
    );

    return updated!;
  }

  remove(id: string): void {
    this.validateUuid(id);

    const album = db.getAlbumById(id);
    if (!album) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }

    const deleted = db.deleteAlbum(id);
    if (!deleted) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
    db.clearAlbumReferences(id);
  }
}
