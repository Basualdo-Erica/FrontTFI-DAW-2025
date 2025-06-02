export enum TiposRespuestaEnum {
  TEXTO = 'TEXTO',
  OPCIONES = 'OPCIONES',
  NUMERO = 'NUMERO',
}

export const tiposPreguntaPresentacion = [
  { tipo: TiposRespuestaEnum.TEXTO, presentacion: 'Respuesta de texto' },
  { tipo: TiposRespuestaEnum.OPCIONES, presentacion: 'Respuesta con opciones' },
  { tipo: TiposRespuestaEnum.NUMERO, presentacion: 'Respuesta numérica' },
];
