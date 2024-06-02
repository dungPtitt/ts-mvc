import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User'; // Import model User để thiết lập mối quan hệ
import { EntityBase } from './EntitiesBase';
import { DBTable } from '../../constants/DBTable';

@Entity(DBTable.FILE)
export class File extends EntityBase {
  @Column()
  filename: string; // Tên tệp tin đã tải lên

  @Column({ nullable: true, default: null })
  filepath: string; // Đường dẫn tới tệp tin

  @Column({ nullable: true, default: null })
  filetype: string; // Loại tệp tin (ví dụ: 'image', 'video', 'audio', 'document', ...)

  @ManyToOne(() => User, user => user.files)
  user: User; // Mối quan hệ nhiều-nhiều với bảng User
}
