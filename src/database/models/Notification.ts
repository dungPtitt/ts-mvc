import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Comment } from './Comment';
import { EntityBase } from './EntitiesBase';
import { DBTable } from '../../constants/DBTable';
@Entity(DBTable.NOTIFICATION)
export class Notification extends EntityBase{
  @Column()
  title: string;

  @Column()
  notification: string;

  // @OneToMany(() => Comment, comment => comment.notification)
  // comments: Comment[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdDate: Date // Thời điểm tạo của tệp tin
}