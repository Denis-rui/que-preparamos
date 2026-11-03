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

// Recuperación de contraseña por código de 6 dígitos.
// Paso 1: solicitar que se envíe el código al correo.
export interface DatosSolicitarRecuperacion {
  email: string;
}

export interface RespuestaSolicitarRecuperacion {
  mensaje: string;
}

// Paso 2: comprobar el código. Devuelve la autorización temporal
// para establecer una contraseña nueva.
export interface DatosVerificarRecuperacion {
  email: string;
  // Llega como texto para conservar un posible cero inicial, "012345".
  codigo: string;
}

export interface RespuestaVerificarRecuperacion {
  mensaje: string;
  token_recuperacion: string;
}

// Paso 3: guardar la nueva contraseña con esa autorización.
export interface DatosRestablecerContrasenia {
  token_recuperacion: string;
  password: string;
  password_confirmation: string;
}

export interface RespuestaRestablecerContrasenia {
  mensaje: string;
}
