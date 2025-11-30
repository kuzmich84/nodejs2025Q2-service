import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { db } from '../db/db';

@Injectable()
export class TrackService {
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

    const deleted = db.deleteTrack(id);
    if (!deleted) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
  }
}
