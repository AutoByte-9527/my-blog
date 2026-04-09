import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Article } from '../../article/entities/article.entity';

@Entity('visit_logs')
export class VisitLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'article_id' })
  articleId: number;

  @Column({ length: 50, nullable: true })
  ip: string;

  @Column({ length: 500, name: 'user_agent' })
  userAgent: string;

  @Column({ length: 500, nullable: true })
  referer: string;

  @Column({ length: 100, nullable: true })
  country: string;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ length: 50, nullable: true })
  device: string;

  @Column({ length: 100, nullable: true })
  browser: string;

  @Column({ length: 100, nullable: true })
  os: string;

  @CreateDateColumn({ name: 'visited_at' })
  visitedAt: Date;

  @ManyToOne(() => Article, (article) => article.visitLogs)
  article: Article;
}
