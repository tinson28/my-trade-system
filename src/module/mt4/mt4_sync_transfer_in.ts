import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";


@Entity("mt4_sync_transfer_in" )
@Index("Index_Login",["Login",])
@Index("Index_Cmd",["Cmd",])
@Index("Index_CloseTIme",["Close_Time",])
@Index("Index_Stamp",["Timestamp",])
@Index("Index_Ticket",["Ticket",])
export class mt4_sync_transfer_in {

    @Column("bigint",{ 
        nullable:false,
        primary:true,
        name:"Ticket"
        })
    Ticket:string;
        

    @Column("bigint",{ 
        nullable:false,
        name:"Login"
        })
    Login:string;
        

    @Column("int",{ 
        nullable:false,
        name:"Cmd"
        })
    Cmd:number;
        

    @Column("datetime",{ 
        nullable:false,
        primary:true,
        name:"Close_Time"
        })
    Close_Time:Date;
        

    @Column("double",{ 
        nullable:false,
        name:"Profit"
        })
    Profit:number;
        

    @Column("char",{ 
        nullable:false,
        length:32,
        name:"Comment"
        })
    Comment:string;
        

    @Column("int",{ 
        nullable:false,
        name:"Timestamp"
        })
    Timestamp:number;
        

    @Column("datetime",{ 
        nullable:false,
        name:"Modify_Time"
        })
    Modify_Time:Date;
        
}
