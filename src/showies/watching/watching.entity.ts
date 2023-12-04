/* eslint-disable prettier/prettier */
import { ShowEntity } from '../show/show.entity';
import { UserEntity } from '../user/user.entity';
import { Column, Entity, PrimaryColumn, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class WatchingEntity {

    @PrimaryColumn()
    userId: string;

    @PrimaryColumn()
    showId: string;
    
    @Column()
    season: number;

    @Column()
    episode: number;

    @Column()
    lastSeen: string;

    @ManyToOne(() => UserEntity, user => user.watching)
    @JoinColumn({ name: 'userId' })
    user: UserEntity;

    @ManyToOne(() => ShowEntity, show => show.watching)
    @JoinColumn({ name: 'showId' })
    show: ShowEntity;

}
