export enum TiposRespuestaEnum {
  ABIERTA = 'ABIERTA',
  OPCION_MULTIPLE_SELECCION_SIMPLE = 'OPCION_MULTIPLE_SELECCION_SIMPLE',
  OPCION_MULTIPLE_SELECCION_MULTIPLE = 'OPCION_MULTIPLE_SELECCION_MULTIPLE',
}

export const tiposPreguntaCadena: {
  tipo: TiposRespuestaEnum;
  cadena: string;
}[] = [
    { tipo: TiposRespuestaEnum.ABIERTA, cadena: 'Abierta' },
    {
      tipo: TiposRespuestaEnum.OPCION_MULTIPLE_SELECCION_SIMPLE,
      cadena: 'Selección Simple',
    },
    {
      tipo: TiposRespuestaEnum.OPCION_MULTIPLE_SELECCION_MULTIPLE,
      cadena: 'Selección Múltiple',
    },
  ];
