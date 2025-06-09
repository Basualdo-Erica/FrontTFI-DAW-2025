import { BadRequestException, Injectable } from '@nestjs/common';
import { CrearRespuestaDTO } from '../dtos/crear-respuesta.dto';
import { EncuestasService } from 'src/modules/encuestas/services/encuestas.service';
import { BuscarEncuestaDTO } from 'src/modules/encuestas/dtos/buscar-encuesta.dto';
import { Respuesta } from '../entities/respuesta.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoEstadoEnum } from 'src/modules/encuestas/enums/tipo-estado.enum';
import { TipoCodigoEnum } from 'src/modules/encuestas/enums/tipo-codigo.enum';
import { PaginarRespuestasDTO } from '../dtos/pagina-respuestas.dto';

@Injectable()
export class RespuestasService {
  constructor(
    private encuestasService: EncuestasService,
    @InjectRepository(Respuesta)
    private respuestasRepository: Repository<Respuesta>,
  ) {}

  async obtenerRespuestasPaginadas(dto: PaginarRespuestasDTO) {
    const { page = 1, limit = 10 } = dto;

    const [respuestas, total] = await this.respuestasRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['encuesta'],
      order: { id: 'ASC' },
    });

    return {
      total,
      page,
      limit,
      data: respuestas,
      message: respuestas.length > 0 ? 'Respuestas encontradas' : 'No hay más respuestas',
    };
  }

  async obtenerRespuestasPaginadasPorEncuesta(
    idEncuesta: number,
    codigo: string,
    page = 1,
    limit = 10,
  ) {
    const encuesta = await this.encuestasService.buscarEncuesta(
      idEncuesta,
      codigo,
      TipoCodigoEnum.RESULTADOS,
    );

    if (!encuesta) {
      return { total: 0, page, limit, data: [], message: 'Encuesta no encontrada' };
    }

    const total = await this.respuestasRepository.count({
      where: { encuesta: { id: idEncuesta } },
    });

    const respuestas = await this.respuestasRepository.find({
      where: { encuesta: { id: idEncuesta } },
      skip: (page - 1) * limit,
      take: limit,
      relations: [
        'respuestasAbiertas',
        'respuestasAbiertas.pregunta',
        'respuestasOpciones',
        'respuestasOpciones.opcion',
        'respuestasOpciones.opcion.pregunta',
      ],
      order: { id: 'ASC' },
    });

    const data = respuestas.map((respuesta) => {
      const abiertas = respuesta.respuestasAbiertas.map((ra) => ({
        pregunta: { id: ra.pregunta.id, texto: ra.pregunta.texto },
        respuesta: ra.texto,
      }));

      const opciones = respuesta.respuestasOpciones.map((ro) => ({
        pregunta: { id: ro.opcion.pregunta.id, texto: ro.opcion.pregunta.texto },
        respuesta: ro.opcion.texto,
      }));

      return { formularioId: respuesta.id, respuestas: [...abiertas, ...opciones] };
    });

    return {
      total,
      page,
      limit,
      data,
      message: data.length > 0 ? 'Respuestas encontradas' : 'No hay más respuestas',
    };
  }

  async obtenerRespuestasPorEncuesta(
    idEncuesta: number,
    dtoEncuesta: BuscarEncuestaDTO,
  ) {
    const encuesta = await this.encuestasService.buscarEncuesta(
      idEncuesta,
      dtoEncuesta.codigo,
      dtoEncuesta.tipo,
    );

    if (!encuesta) {
      throw new BadRequestException('La encuesta no existe o los parámetros son incorrectos.');
    }

    const respuestas = await this.respuestasRepository.find({
      where: { encuesta: { id: idEncuesta } },
      relations: [
        'respuestasAbiertas',
        'respuestasAbiertas.pregunta',
        'respuestasOpciones',
        'respuestasOpciones.opcion',
        'respuestasOpciones.opcion.pregunta',
      ],
    });

    const preguntasConResultados = encuesta.preguntas.map((pregunta) => {
      const respuestasAbiertas = respuestas
        .flatMap(r => r.respuestasAbiertas)
        .filter(ra => ra.pregunta.id === pregunta.id)
        .map(ra => ({ id: ra.id, texto: ra.texto }));

      const respuestasOpciones = respuestas
        .flatMap(r => r.respuestasOpciones)
        .filter(ro => ro.opcion?.pregunta.id === pregunta.id)
        .map(ro => ({
          id: ro.id,
          idOpcion: ro.opcion.id,
          textoOpcion: ro.opcion.texto,
        }));

      return {
        id: pregunta.id,
        texto: pregunta.texto,
        tipo: pregunta.tipo,
        respuestasAbiertas,
        respuestasOpciones,
        totalRespuestas: respuestasAbiertas.length + respuestasOpciones.length,
      };
    });

    return {
      id: encuesta.id,
      nombre: encuesta.nombre,
      preguntas: preguntasConResultados,
    };
  }

  async crearRespuesta(
    id: number,
    dtoEncuesta: BuscarEncuestaDTO,
    dtoRespuesta: CrearRespuestaDTO,
  ) {
    if (dtoEncuesta.tipo !== TipoCodigoEnum.RESPUESTA) {
      throw new BadRequestException('Tipo de código inválido para crear respuesta');
    }

    const encuesta = await this.encuestasService.buscarEncuesta(
      id,
      dtoEncuesta.codigo,
      dtoEncuesta.tipo,
    );

    if (encuesta.estado !== TipoEstadoEnum.PUBLICADO) {
      throw new BadRequestException('No se puede responder una encuesta que no está publicada');
    }

    this.validarPreguntasYOpciones(encuesta, dtoRespuesta);

    const respuestasAbiertas = (dtoRespuesta.respuestasAbiertas || []).map((ra) => ({
      texto: ra.texto,
      pregunta: { id: ra.idPregunta },
    }));

    const respuestasOpciones = (dtoRespuesta.respuestasOpciones || []).map((ro) => ({
      opcion: { id: ro.idOpcion },
    }));

    const nuevaRespuesta = this.respuestasRepository.create({
      encuesta,
      respuestasAbiertas,
      respuestasOpciones,
    });

    const guardada = await this.respuestasRepository.save(nuevaRespuesta);

    return {
      id: guardada.id,
      encuesta: { id: encuesta.id, titulo: encuesta.nombre },
      respuestasAbiertas: guardada.respuestasAbiertas.map((ra) => ({
        id: ra.id,
        texto: ra.texto,
        idPregunta: ra.pregunta.id,
      })),
      respuestasOpciones: guardada.respuestasOpciones.map((ro) => ({
        id: ro.id,
        idOpcion: ro.opcion.id,
      })),
    };
  }

  private validarPreguntasYOpciones(
    encuesta: any,
    dtoRespuesta: CrearRespuestaDTO,
  ): void {
    const preguntasEncuesta = encuesta.preguntas.map((p) => p.id);

    const preguntasAbiertasIds = (dtoRespuesta.respuestasAbiertas || []).map((r) => r.idPregunta);
    const preguntasAbiertasInvalidas = preguntasAbiertasIds.filter((id) => !preguntasEncuesta.includes(id));
    if (preguntasAbiertasInvalidas.length) {
      throw new BadRequestException(`Preguntas abiertas inválidas: ${preguntasAbiertasInvalidas.join(', ')}`);
    }

    const opcionesEncuesta = encuesta.preguntas.flatMap((p) => p.opciones.map((o) => o.id));
    const opcionesIds = (dtoRespuesta.respuestasOpciones || []).map((ro) => ro.idOpcion);
    const opcionesInvalidas = opcionesIds.filter((id) => !opcionesEncuesta.includes(id));
    if (opcionesInvalidas.length) {
      throw new BadRequestException(`Opciones inválidas: ${opcionesInvalidas.join(', ')}`);
    }
  }
}
