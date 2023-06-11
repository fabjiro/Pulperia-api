import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { StateModule } from '../state/state.module';
import { ImageModule } from '../image/image.module';
import { ProfileModule } from '../profile/profile.module';

@Module({
  imports: [
    StateModule,
    ImageModule,
    ProfileModule,
    TypeOrmModule.forFeature([Product]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
