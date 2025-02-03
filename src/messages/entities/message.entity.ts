import { Client } from 'src/client/entities/client.entity';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  Entity,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Message {
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
  text: string;

  @Column()
  send_from: string;

  @Column()
  send_to: string;


  @ManyToOne(() => Client, (user) => user.message)
  sendFrom: Client;


}
