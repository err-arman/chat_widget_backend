import { Message } from 'src/messages/entities/message.entity';
import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    Entity,
    OneToMany,
  } from 'typeorm';

@Entity()
export class Client {
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
      socket_id: string

      // @OneToMany(() => Message, (message) => message.sendFrom)
      // message: Message[];
}
