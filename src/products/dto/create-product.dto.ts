import {
    IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength
} from "class-validator";

export class CreateProductDto {
    @IsString()
    @MinLength(1)
    title: string;

    @IsIn(['men', 'women', 'kid', 'unisex'])
    gender: string

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
}
