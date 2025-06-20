import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { EncuestasService } from '../services/encuestas.service';
import { Encuesta } from '../entities/encuesta.entity';
import { BuscarEncuestaDTO } from '../dtos/buscar-encuesta.dto';
import { CrearEncuestaDTO } from '../dtos/crear-encuesta.dto';
import { TipoEstadoEnum } from '../enums/tipo-estado.enum';
import { EliminarPreguntaDTO } from '../dtos/eliminar-pregunta.dto';
import { EncuestaDetalleDTO } from '../dtos/encuesta-detalle.dto';
import { PaginarEncuestasDTO } from '../dtos/paginar-encuestas.dto';

@Controller('/encuestas')
export class EncuestasController {
  constructor(private encuestasService: EncuestasService) {}

  @Get(':id')
  async buscarEncuesta(
    @Param('id') id: number,
    @Query() dto: BuscarEncuestaDTO,
  ): Promise<EncuestaDetalleDTO> {
    return await this.encuestasService.buscarEncuesta(id, dto.codigo, dto.tipo);
  }

  @Get()
  async listarEncuestas(@Query() dto: PaginarEncuestasDTO): Promise<{
    total: number;
    page: number;
    limit: number;
    data: Encuesta[];
    message: string;
  }> {
    return await this.encuestasService.obtenerEncuestasPaginadas(dto);
  }

  @Post()
  async crearEncuesta(@Body() dto: CrearEncuestaDTO): Promise<{
    id: number;
    codigoRespuesta: string;
    codigoResultados: string;
  }> {
    return await this.encuestasService.crearEncuesta(dto);
  }
 

  @Patch(':id/eliminar-preguntas')
  async eliminarPreguntas(
    @Param('id') id: number,
    @Query() dtoBuscarEncuesta: BuscarEncuestaDTO,
    @Body() dtoPreguntas: EliminarPreguntaDTO,
  ): Promise<{ eliminadas: number[] }> {
    return await this.encuestasService.eliminarPreguntas(
      id,
      dtoBuscarEncuesta,
      dtoPreguntas,
    );
  }

  @Patch(':id/eliminar')
  async eliminarEncuesta(
    @Param('id') id: number,
    @Query() dto: BuscarEncuestaDTO,
  ): Promise<{ affected: number }> {
    return await this.encuestasService.cambiarEstado(
      id,
      dto,
      TipoEstadoEnum.ELIMINADO,
    );
  }
}
