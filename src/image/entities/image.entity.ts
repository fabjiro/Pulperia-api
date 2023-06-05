import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { State } from '../../state/entities/state.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
  })
  url: string;

  @Column({
    type: 'varchar',
  })
  pathRemote: string;
}
