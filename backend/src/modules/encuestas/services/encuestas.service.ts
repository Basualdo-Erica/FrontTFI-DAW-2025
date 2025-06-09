import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Encuesta } from '../entities/encuesta.entity';
import { Not, Repository, UpdateResult } from 'typeorm';
import { TipoCodigoEnum } from '../enums/tipo-codigo.enum';
import { CrearEncuestaDTO } from '../dtos/crear-encuesta.dto';
import { v4 } from 'uuid';
import { BuscarEncuestaDTO } from '../dtos/buscar-encuesta.dto';
import { ModificarEncuestaDTO } from '../dtos/modificar-encuesta.dto';
import { Pregunta } from '../entities/pregunta.entity';
import { TipoEstadoEnum } from '../enums/tipo-estado.enum';
import { EliminarPreguntaDTO } from '../dtos/eliminar-pregunta.dto';
import { EncuestaDetalleDTO } from '../dtos/encuesta-detalle.dto';
import { PaginarEncuestasDTO } from '../dtos/paginar-encuestas.dto';

@Injectable()
export class EncuestasService {
  constructor(
    @InjectRepository(Encuesta)
    private encuestasRepository: Repository<Encuesta>,
    @InjectRepository(Pregunta)
    private preguntasRepository: Repository<Pregunta>,
  ) {}

  async buscarEncuesta(
    id: number,
    codigo: string,
    tipoCodigo: TipoCodigoEnum.RESPUESTA | TipoCodigoEnum.RESULTADOS,
  ): Promise<EncuestaDetalleDTO> {
    const query = this.encuestasRepository
      .createQueryBuilder('encuesta')
      .innerJoinAndSelect('encuesta.preguntas', 'pregunta')
      .leftJoinAndSelect('pregunta.opciones', 'preguntaOpcion')
      .where('encuesta.id = :id', { id })
      .andWhere('encuesta.estado <> :estadoEliminado', {
        estadoEliminado: TipoEstadoEnum.ELIMINADO,
      });

    switch (tipoCodigo) {
      case TipoCodigoEnum.RESPUESTA:
        query.andWhere('encuesta.codigoRespuesta = :codigo', { codigo });
        break;

      case TipoCodigoEnum.RESULTADOS:
        query.andWhere('encuesta.codigoResultados = :codigo', { codigo });
        break;
    }

    query.orderBy('pregunta.numero', 'ASC');
    query.addOrderBy('preguntaOpcion.numero', 'ASC');

    const encuesta = await query.getOne();

    if (!encuesta) {
      throw new BadRequestException('Datos de encuesta no válidos');
    }

    return {
      id: encuesta.id,
      nombre: encuesta.nombre,
      estado: encuesta.estado,
      preguntas: encuesta.preguntas,
      codigoRespuesta: encuesta.codigoRespuesta,
      codigoResultados:
        tipoCodigo === TipoCodigoEnum.RESULTADOS
          ? encuesta.codigoResultados
          : undefined,
    };
  }

  async crearEncuesta(dto: CrearEncuestaDTO): Promise<{
    id: number;
    codigoRespuesta: string;
    codigoResultados: string;
  }> {
    const encuesta: Encuesta = this.encuestasRepository.create({
      ...dto,
      codigoRespuesta: v4(),
      codigoResultados: v4(),
    });

    const encuestaGuardada = await this.encuestasRepository.save(encuesta);

    return {
      id: encuestaGuardada.id,
      codigoRespuesta: encuestaGuardada.codigoRespuesta,
      codigoResultados: encuestaGuardada.codigoResultados,
    };
  }

  async obtenerEncuestasPaginadas(dto: PaginarEncuestasDTO): Promise<{
    total: number;
    page: number;
    limit: number;
    data: Encuesta[];
    message: string;
  }> {
    const { page = 1, limit = 10 } = dto;
    const [data, total] = await this.encuestasRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'ASC' },
      where: {
        estado: Not(TipoEstadoEnum.ELIMINADO),
      },
      relations: ['preguntas', 'preguntas.opciones'],
    });

    return {
      total,
      page,
      limit,
      data,
      message:
        data.length > 0
          ? 'Encuestas encontradas'
          : 'No hay más encuestas',
    };
  }
  
  async eliminarPreguntas(
    id: number,
    dtoBuscarEncuesta: BuscarEncuestaDTO,
    dtoPreguntas: EliminarPreguntaDTO,
  ) {
    if (dtoBuscarEncuesta.tipo !== TipoCodigoEnum.RESULTADOS) {
      throw new BadRequestException('Datos de encuesta invalidos');
    }

    const encuesta = await this.buscarEncuesta(
      id,
      dtoBuscarEncuesta.codigo,
      dtoBuscarEncuesta.tipo,
    );

    const preguntasEnEncuesta = encuesta.preguntas.map(
      (pregunta) => pregunta.id,
    );

    const preguntasInvalidas = dtoPreguntas.preguntas.filter(
      (id) => !preguntasEnEncuesta.includes(id),
    );

    if (preguntasInvalidas.length > 0) {
      throw new BadRequestException(
        'Error',
      );
    }

    await this.preguntasRepository.delete(dtoPreguntas.preguntas);

    return {
      eliminadas: dtoPreguntas.preguntas,
    };
  }

  async cambiarEstado(
  id: number,
  dtoBuscarEncuesta: BuscarEncuestaDTO,
  nuevoEstado: TipoEstadoEnum,
): Promise<{ affected: number }> {
  if (dtoBuscarEncuesta.tipo !== TipoCodigoEnum.RESULTADOS) {
    throw new BadRequestException('Datos inválidos');
  }

  const encuesta = await this.buscarEncuesta(
    id,
    dtoBuscarEncuesta.codigo,
    dtoBuscarEncuesta.tipo,
  );

  const estadoActual = encuesta.estado;

  if (nuevoEstado === TipoEstadoEnum.ELIMINADO) {
    if (estadoActual !== TipoEstadoEnum.PUBLICADO) {
      throw new BadRequestException(
        `Solo se pueden eliminar encuestas en estado PUBLICADO. Estado actual: ${estadoActual}`,
      );
    }
  } else {
    throw new BadRequestException('Estado de transición no permitido');
  }

  const resultado = await this.encuestasRepository.update(id, {
    estado: nuevoEstado,
  });

  return { affected: resultado.affected ?? 0 };
}

}
