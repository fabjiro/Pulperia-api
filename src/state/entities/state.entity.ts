import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { Profile } from '../../profile/entities/profile.entity';
import { Categorie } from '../../categorie/entities/categorie.entity';

@Entity()
export class State {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
  })
  name: string;

  @OneToMany(() => Product, (product) => product.state)
  products: Product[];

  @OneToMany(() => Profile, (profile) => profile.state)
  profiles: Profile[];

  @OneToMany(() => Categorie, (categorie) => categorie.state, {
    onDelete: 'RESTRICT',
  })
  categories: Categorie[];
}
