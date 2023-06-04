import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { DropboxModule } from '../service/dropbox/dropbox.module';
import { DropboxService } from '../service/dropbox/dropbox.service';
import { FileSystemModule } from '../service/file-system/file-system.module';
import { FileSystemService } from '../service/file-system/file-system.service';
@Module({
  imports: [DropboxModule, FileSystemModule, TypeOrmModule.forFeature([Image])],
  controllers: [ImageController],
  providers: [ImageService, DropboxService, FileSystemService],
  exports: [ImageService],
})
export class ImageModule {}
