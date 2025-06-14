import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ default: '' })
  phoneNumber: string;

  @Column()
  password: string; 

  @Column("simple-array")
  roles: string[];
}
