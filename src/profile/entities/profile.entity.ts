import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Image } from '../../image/entities/image.entity';
import { State } from '../../state/entities/state.entity';
import { Rol } from '../../rol/entities/rol.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    type: 'varchar',
  })
  name: string;

  @Column({
    nullable: false,
    unique: true,
    type: 'varchar',
  })
  email: string;

  @Column({
    nullable: false,
    type: 'varchar',
  })
  password: string;

  @Column({
    default: 0,
  })
  trust: number;

  @OneToOne(() => Image, {
    onDelete: 'CASCADE',
    nullable: true,
    eager: true,
  })
  @JoinColumn()
  image?: Image;

  @ManyToOne(() => State, (state) => state.profiles, {
    nullable: false,
    eager: true,
  })
  state: State;

  @ManyToOne(() => Rol, (rol) => rol.profiles, {
    nullable: false,
    eager: true,
  })
  rol: Rol;
}
