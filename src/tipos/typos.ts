export type Rol = {
  id_rol: number;
  n_rol: string;
  abrev: string;
};

export type Subunidad = {
  id_subuni: number;
  n_subuni: string;
  abreviatura: string;
};

export type User = {
  dni: string;
  n_usu: string;
  estado: boolean;
  password: string;
  rol_id: number;
  subunidad_id_subuni: number;
  rol: Rol;
  sub_uni: Subunidad;
};

export type Permisos = {
  id_per: number;
  n_per: string;
  abreviatura: string;
}
export type Activities = {
  id: number;
  n_act: string;
  
}