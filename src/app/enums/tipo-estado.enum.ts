export enum TiposEstadoEnum {  
  PUBLICADO = 'PUBLICADO',
  ELIMINADO= 'ELIMINADO',  
}

export const tipoEstadoEnumCadena: {
  estado: TiposEstadoEnum;
  cadena: string;
}[] = [  
  { estado: TiposEstadoEnum.PUBLICADO, cadena: 'Publicado' }  
];
