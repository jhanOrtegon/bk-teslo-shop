import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', { unique: true })
    title: string

    @Column('float', { default: 0 })
    price: number

    @Column('text', { nullable: true })
    description: string

    @Column('text')
    slug: string

    @Column('int', { default: 0 })
    stock: number

    @Column('text', { array: true, nullable: true })
    sizes: string[]

    @Column('text', { nullable: true })
    gender: string
}
