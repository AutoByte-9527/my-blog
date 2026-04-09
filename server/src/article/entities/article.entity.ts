import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Category } from "../../category/entities/category.entity";
import { Tag } from "../../tag/entities/tag.entity";
import { VisitLog } from "../../visit/entities/visit-log.entity";

@Entity("articles")
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  slug: string;

  @Column()
  title: string;

  @Column("text")
  content: string;

  @Column("text", { nullable: true })
  summary: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @Column({ nullable: true, name: "category_id" })
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.articles)
  category: Category;

  @ManyToMany(() => Tag, (tag) => tag.articles)
  @JoinTable({
    name: "article_tags",
    joinColumn: { name: "article_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "tag_id", referencedColumnName: "id" },
  })
  tags: Tag[];

  @OneToMany(() => VisitLog, (visitLog) => visitLog.article)
  visitLogs: VisitLog[];
}
