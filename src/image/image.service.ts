import { HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { Repository } from 'typeorm';
import { CreateImageDto } from './image.dto';
import { DropboxService } from '../service/dropbox/dropbox.service';
import { v4 } from 'uuid';
import * as sharp from 'sharp';
import { FileSystemService } from '../service/file-system/file-system.service';
import { IFolderImageOption } from '../interface/interface';
@Injectable()
export class ImageService {
  @InjectRepository(Image)
  private imageRepository: Repository<Image>;
  @Inject()
  private readonly dropboxService: DropboxService;
  @Inject()
  private readonly fileSystemService: FileSystemService;

  async create(folder: IFolderImageOption, createImageDto: CreateImageDto) {
    const { compresed, image } = createImageDto;
    let _image = image;
    const fileName = `${v4()}.png`;

    if (!compresed) {
      _image = await this.optimizeImage(image, 20);
    }

    const pathLocal = this.fileSystemService.convertBase64ToFile(
      image,
      fileName,
    );

    const dataUploaded = await this.dropboxService.Upload(
      pathLocal,
      `/${process.env.DB_BASE_IMAGE}/${folder}/${fileName}`,
    );

    this.fileSystemService.deleteFile(pathLocal);

    return this.imageRepository.save({
      url: dataUploaded.link,
      pathRemote: dataUploaded.path,
    });
  }

  findAll() {
    return this.imageRepository.find();
  }

  findOne(id: number) {
    return this.imageRepository.findOneBy({
      id: id,
    });
  }

  async remove(id: number) {
    const register = await this.imageRepository.findOneBy({
      id: id,
    });
    await this.dropboxService.Delete(register.pathRemote);
    return this.imageRepository.delete({
      id: id,
    });
  }

  async Move(id: number, folder: IFolderImageOption) {
    try {
      const image = await this.imageRepository.findOneBy({
        id: id,
      });
      const paths = image.pathRemote.split('/');
      paths[2] = folder;
      const toPath = paths.join('/');
      await this.dropboxService.Move(image.pathRemote, toPath);
      await this.imageRepository.update(id, {
        pathRemote: toPath,
      });
    } catch (error) {
      throw new HttpException(
        'Hemos tenido problemas moviendo las imagen',
        404,
      );
    }
  }

  async optimizeImage(base64Image: string, compression: number) {
    const buffer = Buffer.from(base64Image, 'base64');
    const image = sharp(buffer);
    const metadata = await image.metadata();

    if (metadata.format === 'png') {
      image.png({ quality: compression });
    } else {
      image.jpeg({ quality: compression });
    }
    image.rotate();
    const optimizedImageBuffer = await image.toBuffer();
    return optimizedImageBuffer.toString('base64');
  }
}
