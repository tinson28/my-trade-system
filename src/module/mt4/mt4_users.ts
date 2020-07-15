import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";


@Entity("mt4_users")
@Index("INDEX_STAMP",["TIMESTAMP",])
export class mt4_users {

    @Column("bigint",{ 
        nullable:false,
        primary:true,
        name:"LOGIN"
        })
    LOGIN:string;
        

    @Column("varchar",{ 
        nullable:false,
        length:64,
        name:"GROUP"
        })
    GROUP:string;
        

    @Column("int",{ 
        nullable:false,
        name:"ENABLE"
        })
    ENABLE:number;
        

    @Column("int",{ 
        nullable:false,
        name:"ENABLE_CHANGE_PASS"
        })
    ENABLE_CHANGE_PASS:number;
        

    @Column("int",{ 
        nullable:false,
        name:"ENABLE_READONLY"
        })
    ENABLE_READONLY:number;
        

    @Column("int",{ 
        nullable:false,
        default: () => "'0'",
        name:"ENABLE_OTP"
        })
    ENABLE_OTP:number;
        

    @Column("char",{ 
        nullable:false,
        length:32,
        name:"PASSWORD_PHONE"
        })
    PASSWORD_PHONE:string;
        

    @Column("char",{ 
        nullable:false,
        length:128,
        name:"NAME"
        })
    NAME:string;
        

    @Column("char",{ 
        nullable:false,
        length:32,
        name:"COUNTRY"
        })
    COUNTRY:string;
        

    @Column("char",{ 
        nullable:false,
        length:32,
        name:"CITY"
        })
    CITY:string;
        

    @Column("char",{ 
        nullable:false,
        length:32,
        name:"STATE"
        })
    STATE:string;
        

    @Column("char",{ 
        nullable:false,
        length:16,
        name:"ZIPCODE"
        })
    ZIPCODE:string;
        

    @Column("char",{ 
        nullable:false,
        length:128,
        name:"ADDRESS"
        })
    ADDRESS:string;
        

    @Column("char",{ 
        nullable:false,
        length:32,
        name:"LEAD_SOURCE"
        })
    LEAD_SOURCE:string;
        

    @Column("char",{ 
        nullable:false,
        length:32,
        name:"PHONE"
        })
    PHONE:string;
        

    @Column("varchar",{ 
        nullable:false,
        length:64,
        name:"EMAIL"
        })
    EMAIL:string;
        

    @Column("char",{ 
        nullable:false,
        length:64,
        name:"COMMENT"
        })
    COMMENT:string;
        

    @Column("char",{ 
        nullable:false,
        length:32,
        name:"ID"
        })
    ID:string;
        

    @Column("char",{ 
        nullable:false,
        length:16,
        name:"STATUS"
        })
    STATUS:string;
        

    @Column("datetime",{ 
        nullable:false,
        name:"REGDATE"
        })
    REGDATE:Date;
        

    @Column("datetime",{ 
        nullable:false,
        name:"LASTDATE"
        })
    LASTDATE:Date;
        

    @Column("int",{ 
        nullable:false,
        name:"LEVERAGE"
        })
    LEVERAGE:number;
        

    @Column("bigint",{ 
        nullable:false,
        name:"AGENT_ACCOUNT"
        })
    AGENT_ACCOUNT:string;
        

    @Column("bigint",{ 
        nullable:false,
        name:"TIMESTAMP"
        })
    TIMESTAMP:string;
        

    @Column("double",{ 
        nullable:false,
        name:"BALANCE"
        })
    BALANCE:number;
        

    @Column("double",{ 
        nullable:false,
        name:"PREVMONTHBALANCE"
        })
    PREVMONTHBALANCE:number;
        

    @Column("double",{ 
        nullable:false,
        name:"PREVBALANCE"
        })
    PREVBALANCE:number;
        

    @Column("double",{ 
        nullable:false,
        name:"CREDIT"
        })
    CREDIT:number;
        

    @Column("double",{ 
        nullable:false,
        name:"INTERESTRATE"
        })
    INTERESTRATE:number;
        

    @Column("double",{ 
        nullable:false,
        name:"TAXES"
        })
    TAXES:number;
        

    @Column("int",{ 
        nullable:false,
        name:"SEND_REPORTS"
        })
    SEND_REPORTS:number;
        

    @Column("varchar",{ 
        nullable:false,
        length:20,
        name:"MQID"
        })
    MQID:string;
        

    @Column("varchar",{ 
        nullable:false,
        length:50,
        name:"USER_COLOR"
        })
    USER_COLOR:string;
        

    @Column("double",{ 
        nullable:false,
        default: () => "'0'",
        name:"EQUITY"
        })
    EQUITY:number;
        

    @Column("double",{ 
        nullable:false,
        default: () => "'0'",
        name:"MARGIN"
        })
    MARGIN:number;
        

    @Column("double",{ 
        nullable:false,
        default: () => "'0'",
        name:"MARGIN_LEVEL"
        })
    MARGIN_LEVEL:number;
        

    @Column("double",{ 
        nullable:false,
        default: () => "'0'",
        name:"MARGIN_FREE"
        })
    MARGIN_FREE:number;
        

    @Column("char",{ 
        nullable:false,
        length:16,
        name:"CURRENCY"
        })
    CURRENCY:string;
        

    @Column("blob",{ 
        nullable:true,
        name:"API_DATA"
        })
    API_DATA:Buffer | null;
        

    @Column("datetime",{ 
        nullable:false,
        name:"MODIFY_TIME"
        })
    MODIFY_TIME:Date;
        
}
