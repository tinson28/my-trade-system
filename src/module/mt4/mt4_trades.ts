import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";


@Entity("mt4_trades" )
@Index("INDEX_LOGIN",["LOGIN",])
@Index("INDEX_CMD",["CMD",])
@Index("INDEX_OPENTIME",["OPEN_TIME",])
@Index("INDEX_CLOSETIME",["CLOSE_TIME",])
@Index("INDEX_STAMP",["TIMESTAMP",])
export class mt4_trades {

    @Column("bigint",{ 
        nullable:false,
        primary:true,
        name:"TICKET"
        })
    TICKET:string;
        

    @Column("bigint",{ 
        nullable:false,
        name:"LOGIN"
        })
    LOGIN:string;
        

    @Column("varchar",{ 
        nullable:false,
        length:32,
        name:"SYMBOL"
        })
    SYMBOL:string;
        

    @Column("int",{ 
        nullable:false,
        name:"DIGITS"
        })
    DIGITS:number;
        

    @Column("int",{ 
        nullable:false,
        name:"CMD"
        })
    CMD:number;
        

    @Column("bigint",{ 
        nullable:false,
        name:"VOLUME"
        })
    VOLUME:string;
        

    @Column("datetime",{ 
        nullable:false,
        name:"OPEN_TIME"
        })
    OPEN_TIME:Date;
        

    @Column("double",{ 
        nullable:false,
        name:"OPEN_PRICE"
        })
    OPEN_PRICE:number;
        

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
        name:"CLOSE_TIME"
        })
    CLOSE_TIME:Date;
        

    @Column("datetime",{ 
        nullable:false,
        name:"EXPIRATION"
        })
    EXPIRATION:Date;
        

    @Column("int",{ 
        nullable:false,
        default: () => "'0'",
        name:"REASON"
        })
    REASON:number;
        

    @Column("double",{ 
        nullable:false,
        name:"CONV_RATE1"
        })
    CONV_RATE1:number;
        

    @Column("double",{ 
        nullable:false,
        name:"CONV_RATE2"
        })
    CONV_RATE2:number;
        

    @Column("double",{ 
        nullable:false,
        name:"COMMISSION"
        })
    COMMISSION:number;
        

    @Column("double",{ 
        nullable:false,
        name:"COMMISSION_AGENT"
        })
    COMMISSION_AGENT:number;
        

    @Column("double",{ 
        nullable:false,
        name:"SWAPS"
        })
    SWAPS:number;
        

    @Column("double",{ 
        nullable:false,
        name:"CLOSE_PRICE"
        })
    CLOSE_PRICE:number;
        

    @Column("double",{ 
        nullable:false,
        name:"PROFIT"
        })
    PROFIT:number;
        

    @Column("double",{ 
        nullable:false,
        name:"TAXES"
        })
    TAXES:number;
        

    @Column("char",{ 
        nullable:false,
        length:32,
        name:"COMMENT"
        })
    COMMENT:string;
        

    @Column("bigint",{ 
        nullable:false,
        name:"INTERNAL_ID"
        })
    INTERNAL_ID:string;
        

    @Column("double",{ 
        nullable:false,
        name:"MARGIN_RATE"
        })
    MARGIN_RATE:number;
        

    @Column("int",{ 
        nullable:false,
        name:"TIMESTAMP"
        })
    TIMESTAMP:number;
        

    @Column("int",{ 
        nullable:false,
        default: () => "'0'",
        name:"MAGIC"
        })
    MAGIC:number;
        

    @Column("bigint",{ 
        nullable:false,
        name:"GW_VOLUME"
        })
    GW_VOLUME:string;
        

    @Column("int",{ 
        nullable:false,
        default: () => "'0'",
        name:"GW_OPEN_PRICE"
        })
    GW_OPEN_PRICE:number;
        

    @Column("int",{ 
        nullable:false,
        default: () => "'0'",
        name:"GW_CLOSE_PRICE"
        })
    GW_CLOSE_PRICE:number;
        

    @Column("datetime",{ 
        nullable:false,
        name:"MODIFY_TIME"
        })
    MODIFY_TIME:Date;
        

    @Column("bigint",{ 
        nullable:true,
        name:"MT5_DEAL"
        })
    MT5_DEAL:string | null;
        

    @Column("bigint",{ 
        nullable:true,
        name:"MT5_ORDER"
        })
    MT5_ORDER:string | null;
        

    @Column("bigint",{ 
        nullable:true,
        name:"MT5_POSITION"
        })
    MT5_POSITION:string | null;
        
}
