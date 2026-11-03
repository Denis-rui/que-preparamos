export type Perfil = {
  id: number;
  name: string;
  email: string;
  foto_perfil_url: string | null;
  rol: string;
  activo: boolean;
};

export interface DatosActualizadosPerfil {
  name?: string;
  email?: string;
  current_password?: string;
}

export interface RespuestaActualizarPerfil {
  mensaje: string;
  usuario: Perfil;
}
