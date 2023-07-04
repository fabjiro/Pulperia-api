import {
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  Query,
} from '@nestjs/common';
import {
  CreateProductDto,
  FindProductFilterDto,
  UpdateProductDto,
} from './product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ILike, Like, Repository } from 'typeorm';
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

  async findAll(@Query() filter?: FindProductFilterDto) {
    if (filter) {
      const { name, 'categorie.id': CategorieId, 'state.id': StateId } = filter;
      const where: any = {};
      try {
        if (name) {
          where.name = ILike(`%${name.toLocaleLowerCase()}%`);
        }
        if (CategorieId) {
          where.categorie = {
            id: CategorieId,
          };
        }
        if (StateId) {
          where.state = {
            id: StateId,
          };
        }

        const products = await this.productRepository.find({
          where: where,
        });
        return products;
      } catch (error) {
        throw new HttpException(
          'Hemos tenido problemas al procesar su peticion',
          500,
        );
      }
    }
    return this.productRepository.find();
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOneBy({
      id: id,
    });
    if (!product) {
      throw new HttpException('Producto no disponible', 404);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { name, picture, state, categorie } = updateProductDto;
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
      const uploadedImage = await this.imageService.Update(
        'Product',
        product.image.id,
        picture,
      );
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

    if (categorie) {
      const categorieF = await this.categorieService.findOne(categorie);
      await this.productRepository.update(id, {
        categorie: categorieF,
      });
    }

    return this.findOne(id);
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
