import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { State } from '../../state/entities/state.entity';

@Entity()
export class Categorie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @OneToMany(() => Product, (product) => product.categorie, {
    onDelete: 'RESTRICT',
  })
  products: Product[];

  @ManyToOne(() => State, (state) => state.categories, {
    nullable: false,
    eager: true,
    onDelete: 'CASCADE',
  })
  state: State;
}
