export interface DatosLogin {
  email: string;
  password: string;
  dispositivo?: string;
}

export interface DatosRegistro extends DatosLogin {
  name: string;
  password_confirmation: string;
}

export interface UsuarioAuth {
  id: number;
  name: string;
  email: string;
  foto_perfil_url: string | null;
  rol: string;
  activo: boolean;
}

export interface RespuestaRegistro {
  mensaje: string;
  usuario: UsuarioAuth;
}

export interface RespuestaLogin extends RespuestaRegistro {
  token: string;
  token_type: string;
}
