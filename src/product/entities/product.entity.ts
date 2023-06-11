import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { State } from '../../state/entities/state.entity';
import { Image } from '../../image/entities/image.entity';
import { Categorie } from '../../categorie/entities/categorie.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  name: string;

  @OneToOne(() => Image, {
    onDelete: 'CASCADE',
    nullable: false,
    eager: true,
  })
  @JoinColumn()
  image: Image;

  @ManyToOne(() => State, (state) => state.products, {
    nullable: false,
    eager: true,
  })
  state: State;

  @ManyToOne(() => Categorie, (categorie) => categorie.products, {
    nullable: false,
    eager: true,
    onDelete: 'CASCADE',
  })
  categorie: Categorie;
}
