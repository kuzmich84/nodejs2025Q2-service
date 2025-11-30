import { Expose } from 'class-transformer';

@Expose()
export class Artist {
  id: string;
  name: string;
  grammy: boolean;
}
