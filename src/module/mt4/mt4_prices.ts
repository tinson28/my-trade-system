import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";


@Entity("mt4_prices" )
export class mt4_prices {

    @Column("char",{ 
        nullable:false,
        primary:true,
        length:16,
        name:"SYMBOL"
        })
    SYMBOL:string;
        

    @Column("datetime",{ 
        nullable:false,
        name:"TIME"
        })
    TIME:Date;
        

    @Column("double",{ 
        nullable:false,
        name:"BID"
        })
    BID:number;
        

    @Column("double",{ 
        nullable:false,
        name:"ASK"
        })
    ASK:number;
        

    @Column("double",{ 
        nullable:false,
        name:"LOW"
        })
    LOW:number;
        

    @Column("double",{ 
        nullable:false,
        name:"HIGH"
        })
    HIGH:number;
        

    @Column("int",{ 
        nullable:false,
        name:"DIRECTION"
        })
    DIRECTION:number;
        

    @Column("int",{ 
        nullable:false,
        name:"DIGITS"
        })
    DIGITS:number;
        

    @Column("int",{ 
        nullable:false,
        name:"SPREAD"
        })
    SPREAD:number;
        

    @Column("datetime",{ 
        nullable:false,
        name:"MODIFY_TIME"
        })
    MODIFY_TIME:Date;
        
}
