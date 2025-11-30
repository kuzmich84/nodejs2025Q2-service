import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { db } from '../db/db';
import { uuidV4Regex } from 'src/utils/uuidV4Regex';

@Injectable()
export class TrackService {
  private isValidUuidV4(id: string): boolean {
    return uuidV4Regex.test(id);
  }

  private validateUuid(id: string): void {
    if (!this.isValidUuidV4(id)) {
      throw new BadRequestException('Invalid UUID v4');
    }
  }

  findAll(): Track[] {
    return db.getAllTracks();
  }

  findOne(id: string): Track {
    this.validateUuid(id);
    const track = db.getTrackById(id);
    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
    return track;
  }

  create(createTrackDto: CreateTrackDto): Track {
    return db.createTrack(
      createTrackDto.name,
      createTrackDto.artistId ?? null,
      createTrackDto.albumId ?? null,
      createTrackDto.duration,
    );
  }

  update(id: string, updateTrackDto: UpdateTrackDto): Track {
    this.validateUuid(id);

    const track = db.getTrackById(id);
    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }

    const updated = db.updateTrack(
      id,
      updateTrackDto.name ?? track.name,
      updateTrackDto.artistId !== undefined
        ? (updateTrackDto.artistId ?? null)
        : track.artistId,
      updateTrackDto.albumId !== undefined
        ? (updateTrackDto.albumId ?? null)
        : track.albumId,
      updateTrackDto.duration ?? track.duration,
    );

    return updated!;
  }

  remove(id: string): void {
    this.validateUuid(id);
    const track = db.getTrackById(id);
    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }

    const deleted = db.deleteTrack(id);
    if (!deleted) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
    db.clearTrackReferences(id);
  }
}
