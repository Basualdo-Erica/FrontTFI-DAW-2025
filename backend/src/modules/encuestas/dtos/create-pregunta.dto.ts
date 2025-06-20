import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { TiposRespuestaEnum } from "../enums/tipos-respuesta.enum";
import { CreateOpcionDto } from "./create-opcion.dto";
import { Type } from "class-transformer";

export class CreatePreguntaDto {

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    numero: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    texto: string;

    @ApiProperty( { enum: TiposRespuestaEnum} )
    @IsEnum(TiposRespuestaEnum)
    @IsNotEmpty()
    tipo: TiposRespuestaEnum;

    @ApiProperty( {  type: [CreateOpcionDto], required: false} )
    @IsArray()
    @IsOptional()
    @ValidateNested( { each: true} )
    @Type(() => CreateOpcionDto)
    opciones?: CreateOpcionDto[];

}












    


    