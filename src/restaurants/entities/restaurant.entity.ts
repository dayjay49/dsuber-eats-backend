import { Field, ObjectType, InputType } from "@nestjs/graphql";
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsBoolean, IsString, IsNumber, Length, IsOptional } from "class-validator";


@InputType({isAbstract: true})  //<- this means you're not using it directly but 
@ObjectType()                   //will be having other classes extending from it
@Entity()
export class Restaurant {

  @PrimaryGeneratedColumn()
  @Field(type => Number)
  id: number;

  @Field(type => String)
  @Column()
  @IsString()
  @Length(5)
  name: string;

  @Field(type => Boolean, {defaultValue: true})
  @Column({default: true})
  @IsOptional()
  @IsBoolean()
  isVegan: boolean;

  @Field(type => String)
  @Column()
  @IsString()
  address: string;

  @Field(type => String)
  @Column()
  @IsString()
  ownersName: string;

  @Field(type => String)
  @Column()
  @IsString()
  categoryName: string;
}