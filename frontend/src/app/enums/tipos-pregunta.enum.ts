export enum TiposRespuestaEnum {
  ABIERTA = 'ABIERTA',
  OPCION_MULTIPLE_SELECCION_SIMPLE = 'OPCION_MULTIPLE_SELECCION_SIMPLE',
  OPCION_MULTIPLE_SELECCION_MULTIPLE = 'OPCION_MULTIPLE_SELECCION_MULTIPLE',
}


export const tiposPreguntaPresentacion = [
  { tipo: TiposRespuestaEnum.ABIERTA, presentacion: 'Respuesta de texto' },
  { tipo: TiposRespuestaEnum.OPCION_MULTIPLE_SELECCION_SIMPLE, presentacion: 'Una sola opción' },
  { tipo: TiposRespuestaEnum.OPCION_MULTIPLE_SELECCION_MULTIPLE, presentacion: 'Varias opciones' },
];
