import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";


@Entity("mt4_sync_order" )
@Index("Index_Login",["Login",])
@Index("Index_Cmd",["Cmd",])
@Index("Index_OpenTime",["Open_Time",])
@Index("Index_CloseTIme",["Close_Time",])
@Index("Index_Stamp",["Timestamp",])
@Index("Index_Ticket",["Ticket",])
export class mt4_sync_order {

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
        

    @Column("varchar",{ 
        nullable:false,
        length:32,
        name:"Symbol"
        })
    Symbol:string;
        

    @Column("int",{ 
        nullable:false,
        name:"Digits"
        })
    Digits:number;
        

    @Column("int",{ 
        nullable:false,
        name:"Cmd"
        })
    Cmd:number;
        

    @Column("bigint",{ 
        nullable:false,
        name:"Volume"
        })
    Volume:string;
        

    @Column("datetime",{ 
        nullable:false,
        name:"Open_Time"
        })
    Open_Time:Date;
        

    @Column("double",{ 
        nullable:false,
        name:"Open_Price"
        })
    Open_Price:number;
        

    @Column("double",{ 
        nullable:false,
        name:"SL"
        })
    SL:number;
        

    @Column("double",{ 
        nullable:false,
        name:"TP"
        })
    TP:number;
        

    @Column("datetime",{ 
        nullable:false,
        primary:true,
        name:"Close_Time"
        })
    Close_Time:Date;
        

    @Column("double",{ 
        nullable:false,
        name:"Commission"
        })
    Commission:number;
        

    @Column("double",{ 
        nullable:false,
        name:"Commission_Agent"
        })
    Commission_Agent:number;
        

    @Column("double",{ 
        nullable:false,
        name:"Swaps"
        })
    Swaps:number;
        

    @Column("double",{ 
        nullable:false,
        name:"Close_Price"
        })
    Close_Price:number;
        

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
