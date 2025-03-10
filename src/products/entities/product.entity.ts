import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    Generated,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";

@Entity()
@Index('idx_product_uuid', ['uuid'])
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'uuid', unique: true })
    @Generated('uuid')
    uuid: string;

    @Column('text', { unique: true })
    title: string;

    @Column('float', { default: 0 })
    price: number;

    @Column('text', { nullable: true })
    description: string;

    @Column('text', { unique: true })
    slug: string;

    @Column('int', { default: 0 })
    stock: number;

    @Column('text', { array: true, nullable: true })
    sizes: string[];

    @Column('text', { nullable: true })
    gender: string;

    @Column('text', { array: true, default: [] })
    tags: string[];

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @BeforeInsert()
    checkSlugInsert() {
        if (!this.slug) {
            this.slug = this.title;
        }
        this.slug = this.slug.toLowerCase().replaceAll(' ', '_').replaceAll("'", '');
    }

    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.slug.toLowerCase().replaceAll(' ', '_').replaceAll("'", '');
    }
}
