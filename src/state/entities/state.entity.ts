import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { Profile } from '../../profile/entities/profile.entity';

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
}
