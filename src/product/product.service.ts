import {
  ConflictException,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { StateService } from '../state/state.service';
import { ImageService } from '../image/image.service';
import { CategorieService } from '../categorie/categorie.service';

@Injectable()
export class ProductService {
  @InjectRepository(Product)
  private productRepository: Repository<Product>;

  @Inject()
  private stateService: StateService;

  @Inject()
  private imageService: ImageService;

  @Inject()
  private categorieService: CategorieService;

  async create(createProductDto: CreateProductDto) {
    const state = await this.stateService.findOne(createProductDto.state || 1);
    const categorie = await this.categorieService.findOne(
      createProductDto.categorie,
    );
    if (!state) {
      throw new HttpException('Estado no disponible', 404);
    }
    if (!categorie) {
      throw new HttpException('Categoria no disponible', 404);
    }

    const nameExist = await this.productRepository.exist({
      where: {
        name: createProductDto.name,
      },
    });

    if (nameExist) {
      throw new ConflictException('Nombre de producto en uso');
    }

    const uploadedImage = await this.imageService.create(
      'Product',
      createProductDto.picture,
    );

    return await this.productRepository.save({
      image: uploadedImage,
      name: createProductDto.name,
      state: state,
      categorie: categorie,
    });
  }

  findAll() {
    return this.productRepository.find();
  }

  findOne(id: number) {
    return this.productRepository.findOneBy({
      id: id,
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { name, picture, state } = updateProductDto;
    const product = await this.productRepository.findOneBy({
      id,
    });

    if (!product) {
      throw new HttpException('Prodcucto no disponible', 404);
    }

    if (name) {
      await this.productRepository.update(id, {
        name,
      });
    }

    if (picture) {
      const uploadedImage = await this.imageService.create('Product', picture);
      await this.productRepository.update(id, {
        image: uploadedImage,
      });
    }

    if (state) {
      const stateN = await this.stateService.findOne(state);
      await this.productRepository.update(id, {
        state: stateN,
      });
    }

    return this.productRepository.findOneBy({
      id,
    });
  }

  async remove(id: number) {
    const product = await this.productRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!product) {
      throw new HttpException('Prodcucto no disponible', 404);
    }

    await this.imageService.remove(product.image.id);
    return this.productRepository.delete(id);
  }
}
