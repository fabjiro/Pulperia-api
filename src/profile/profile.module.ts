import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { RolModule } from '../rol/rol.module';
import { ImageModule } from '../image/image.module';
import { StateModule } from '../state/state.module';
import { SecurityModule } from '../service/security/security.module';
import { SecurityService } from '../service/security/security.service';

@Module({
  imports: [
    RolModule,
    ImageModule,
    StateModule,
    SecurityModule,
    TypeOrmModule.forFeature([Profile]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService, SecurityService],
  exports: [ProfileService],
})
export class ProfileModule {}
