import { Admin } from 'src/admins/entities/admin.entity';
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
  socket_id: string;

  @Column({nullable: true})
  send_to: string;

  @Column({ nullable: true })
  send_to_socket_id: string;

  @Column({ nullable: true })
  client_id: string;

  @ManyToOne(() => Admin, (admin) => admin.messages, { nullable: true, onDelete: 'CASCADE' })
  admin: Admin;

  @ManyToOne(() => Client, (client) => client.messages, { nullable: true })
  client: Client;
}
