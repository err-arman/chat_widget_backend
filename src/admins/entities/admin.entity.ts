import { Message } from 'src/messages/entities/message.entity';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  UpdateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @Column()
  user_id: string;

  @OneToMany(() => Message, (message) => message.admin)
  messages: Message[];

  @Column()
  name: string;

  @Column({ nullable: true })
  user_email: string;

  @Column({ type: 'varchar', nullable: true })
  authProvider?: string | null;

  @Column({ type: 'varchar', nullable: true })
  profileImageUrl?: string | null;
}
