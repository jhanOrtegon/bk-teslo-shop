import { Injectable, NotFoundException, } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Like, Repository } from 'typeorm';
import { DatabaseExceptionService } from 'src/common/services/database-exception.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { isUUID } from 'class-validator';
import { DatabaseTableColumns } from 'src/common/services/database-table-columns.service';
import { ProductImage } from './entities/product-image.entity';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly databaseExceptionService: DatabaseExceptionService,
    private readonly databaseTableColumns: DatabaseTableColumns,
  ) { }


  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...productDetail } = createProductDto

      const product = this.productRepository.create({
        ...productDetail,
        images: images.map(url => this.productImageRepository.create({ url }))
      });

      await this.productRepository.save(product);
      return { ...product, images };
    } catch (error) {
      this.databaseExceptionService.handleDBExceptions(error, ProductsService.name);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true
      },
    });

    return products.map(product => ({ ...product, images: product.images?.map(image => image.url) }))
  }

  async findOne(term: string) {
    let product: Product | null;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ uuid: term });
    } else {
      const upperTerm = term.toUpperCase();

      product = await this.productRepository
        .createQueryBuilder('product')
        .where('UPPER(title) = :upperTerm', { upperTerm })
        .orWhere('UPPER(slug) = :upperTerm', { upperTerm })
        .leftJoinAndSelect('product.images', 'productImages')
        .getOne();
    }

    if (!product) {
      throw new NotFoundException(`Product with term: ${term} not found`);
    }

    return { ...product, id: undefined };
  }

  async update(uuid: string, updateProductDto: UpdateProductDto) {
    try {
      const { id } = await this.findOne(uuid)
      const product = await this.productRepository.preload({
        id,
        ...updateProductDto,
        images: []
      });

      if (!product) {
        throw new NotFoundException(`Product with id: ${uuid} not found`);
      }

      const response = await this.productRepository.save(product)
      return { ...response, id: undefined }

    } catch (error) {
      this.databaseExceptionService.handleDBExceptions(error, ProductsService.name);
    }
  }

  async remove(uuid: string) {
    try {
      const product = await this.productRepository.findOneBy({ uuid }) as Product

      if (product) {
        await this.productRepository.remove(product);
        return this.findAll({ limit: 10, offset: 0 });
      }

      throw new NotFoundException(`Product with id: ${uuid} not found`);

    } catch (error) {
      this.databaseExceptionService.handleDBExceptions(error, ProductsService.name);
    }
  }
}
