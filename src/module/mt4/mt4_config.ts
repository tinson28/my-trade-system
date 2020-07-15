import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";


@Entity("mt4_config" )
export class mt4_config {

    @Column("int",{ 
        nullable:false,
        primary:true,
        name:"CONFIG"
        })
    CONFIG:number;
        

    @Column("int",{ 
        nullable:true,
        name:"VALUE_INT"
        })
    VALUE_INT:number | null;
        

    @Column("char",{ 
        nullable:true,
        length:255,
        name:"VALUE_STR"
        })
    VALUE_STR:string | null;
        
}
