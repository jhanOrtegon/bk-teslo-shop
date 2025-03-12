import {
    IsArray, IsDate, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength
} from "class-validator";

export class CreateProductDto {
    @IsString()
    @MinLength(1)
    title: string;

    @IsIn(['men', 'women', 'kid', 'unisex'])
    gender: string;

    @IsString()
    @MinLength(10)
    description: string;

    @IsString()
    @IsOptional()
    slug?: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @IsString({ each: true })
    @IsArray()
    sizes: string[];

    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags: string[];

    @IsDate()
    @IsOptional()
    createdAt?: Date;

    @IsDate()
    @IsOptional()
    updatedAt?: Date;

    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images: string[];
}
