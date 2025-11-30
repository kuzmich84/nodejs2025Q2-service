import { User } from 'src/user/entities/users.entity';

interface Favorites {
  artists: string[];
  albums: string[];
  tracks: string[];
}

export class Artist {
  id: string;
  name: string;
  grammy: boolean;

  constructor(partial: Partial<Artist> = {}) {
    Object.assign(this, partial);
  }
}

export class Album {
  id: string;
  name: string;
  year: number;
  artistId: string | null;

  constructor(partial: Partial<Album> = {}) {
    Object.assign(this, partial);
  }
}

export class Track {
  id: string;
  name: string;
  artistId: string | null;
  albumId: string | null;
  duration: number;

  constructor(partial: Partial<Track> = {}) {
    Object.assign(this, partial);
  }
}

class Database {
  private users: User[] = [];
  private artists: Artist[] = [];
  private albums: Album[] = [];
  private tracks: Track[] = [];

  private favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  create(login: string, password: string): User {
    const now = Date.now();
    const user = new User();
    user.id = crypto.randomUUID();
    user.login = login;
    user.password = password;
    user.version = 1;
    user.createdAt = now;
    user.updatedAt = now;

    this.users.push(user);
    return user;
  }

  updatePassword(
    id: string,
    oldPassword: string,
    newPassword: string,
  ): User | null {
    const user = this.findOne(id);
    if (!user) return null;
    if (user.password !== oldPassword) return null;

    user.password = newPassword;
    user.version += 1;
    user.updatedAt = Date.now();
    return user;
  }

  delete(id: string): boolean {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }
  getAllArtists(): Artist[] {
    return this.artists;
  }

  getArtistById(id: string): Artist | undefined {
    return this.artists.find((a) => a.id === id);
  }

  createArtist(name: string, grammy: boolean): Artist {
    const artist = new Artist({
      id: crypto.randomUUID(),
      name,
      grammy,
    });
    this.artists.push(artist);
    return artist;
  }

  updateArtist(id: string, name: string, grammy: boolean): Artist | null {
    const artist = this.getArtistById(id);
    if (!artist) return null;

    artist.name = name;
    artist.grammy = grammy;
    return artist;
  }

  deleteArtist(id: string): boolean {
    const index = this.artists.findIndex((a) => a.id === id);
    if (index === -1) return false;
    this.artists.splice(index, 1);
    return true;
  }

  getAllAlbums(): Album[] {
    return this.albums;
  }

  getAlbumById(id: string): Album | undefined {
    return this.albums.find((a) => a.id === id);
  }

  createAlbum(name: string, year: number, artistId: string | null): Album {
    const album = new Album({
      id: crypto.randomUUID(),
      name,
      year,
      artistId,
    });
    this.albums.push(album);
    return album;
  }

  updateAlbum(
    id: string,
    name: string,
    year: number,
    artistId: string | null,
  ): Album | null {
    const album = this.getAlbumById(id);
    if (!album) return null;

    album.name = name;
    album.year = year;
    album.artistId = artistId;
    return album;
  }

  deleteAlbum(id: string): boolean {
    const index = this.albums.findIndex((a) => a.id === id);
    if (index === -1) return false;
    this.albums.splice(index, 1);
    return true;
  }
  getAllTracks(): Track[] {
    return this.tracks;
  }

  getTrackById(id: string): Track | undefined {
    return this.tracks.find((t) => t.id === id);
  }

  createTrack(
    name: string,
    artistId: string | null,
    albumId: string | null,
    duration: number,
  ): Track {
    const track = new Track({
      id: crypto.randomUUID(),
      name,
      artistId,
      albumId,
      duration,
    });
    this.tracks.push(track);
    return track;
  }

  updateTrack(
    id: string,
    name: string,
    artistId: string | null,
    albumId: string | null,
    duration: number,
  ): Track | null {
    const track = this.getTrackById(id);
    if (!track) return null;

    track.name = name;
    track.artistId = artistId;
    track.albumId = albumId;
    track.duration = duration;
    return track;
  }

  deleteTrack(id: string): boolean {
    const index = this.tracks.findIndex((t) => t.id === id);
    if (index === -1) return false;
    this.tracks.splice(index, 1);
    return true;
  }
  getFavorites(): Favorites {
    return this.favorites;
  }

  addArtistToFavorites(id: string): void {
    if (!this.favorites.artists.includes(id)) {
      this.favorites.artists.push(id);
    }
  }

  addAlbumToFavorites(id: string): void {
    if (!this.favorites.albums.includes(id)) {
      this.favorites.albums.push(id);
    }
  }

  addTrackToFavorites(id: string): void {
    if (!this.favorites.tracks.includes(id)) {
      this.favorites.tracks.push(id);
    }
  }

  removeArtistFromFavorites(id: string): boolean {
    const index = this.favorites.artists.indexOf(id);
    if (index === -1) return false;
    this.favorites.artists.splice(index, 1);
    return true;
  }

  removeAlbumFromFavorites(id: string): boolean {
    const index = this.favorites.albums.indexOf(id);
    if (index === -1) return false;
    this.favorites.albums.splice(index, 1);
    return true;
  }

  removeTrackFromFavorites(id: string): boolean {
    const index = this.favorites.tracks.indexOf(id);
    if (index === -1) return false;
    this.favorites.tracks.splice(index, 1);
    return true;
  }

  clearArtistFromFavorites(artistId: string): void {
    this.favorites.artists = this.favorites.artists.filter(
      (id) => id !== artistId,
    );
  }

  clearAlbumFromFavorites(albumId: string): void {
    this.favorites.albums = this.favorites.albums.filter(
      (id) => id !== albumId,
    );
  }

  clearTrackFromFavorites(trackId: string): void {
    this.favorites.tracks = this.favorites.tracks.filter(
      (id) => id !== trackId,
    );
  }

  clearArtistReferences(artistId: string): void {
    this.albums.forEach((album) => {
      if (album.artistId === artistId) {
        album.artistId = null;
      }
    });

    this.tracks.forEach((track) => {
      if (track.artistId === artistId) {
        track.artistId = null;
      }
    });

    this.clearArtistFromFavorites(artistId);
  }

  clearAlbumReferences(albumId: string): void {
    this.tracks.forEach((track) => {
      if (track.albumId === albumId) {
        track.albumId = null;
      }
    });

    this.clearAlbumFromFavorites(albumId);
  }

  clearTrackReferences(trackId: string): void {
    this.clearTrackFromFavorites(trackId);
  }
}

export const db = new Database();
