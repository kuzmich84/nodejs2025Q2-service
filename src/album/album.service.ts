import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { db } from '../db/db';

@Injectable()
export class AlbumService {
  private isValidUuidV4(id: string): boolean {
    const uuidV4Regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
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
