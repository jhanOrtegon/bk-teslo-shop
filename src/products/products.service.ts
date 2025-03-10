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

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly databaseExceptionService: DatabaseExceptionService,
    private readonly databaseTableColumns: DatabaseTableColumns,
  ) { }


  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.databaseExceptionService.handleDBExceptions(error, ProductsService.name);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto
    return this.productRepository.find({
      take: limit,
      skip: offset,
      select: this.databaseTableColumns.getColumnsExcludingBy(this.productRepository, ['id'])
    });
  }

  async findOne(term: string) {
    let product: Product | null;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ uuid: term });
    } else {
      const upperTerm = term.toUpperCase();

      product = await this.productRepository
        .createQueryBuilder()
        .where('UPPER(title) = :upperTerm', { upperTerm })
        .orWhere('UPPER(slug) = :upperTerm', { upperTerm })
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
