export type Perfil = {
  id: number;
  name: string;
  email: string;
  foto_perfil_url: string | null;
  rol: string;
  activo: boolean;
};

// Datos que presentan la pantalla y el formulario de edición.
export type EditableProfile = {
  name: string;
  email: string;
  photoUri?: string;
};

export interface DatosActualizarPerfil {
  name?: string;
  email?: string;
  current_password?: string;
}

export interface RespuestaActualizarPerfil {
  mensaje: string;
  usuario: Perfil;
}

export interface FotoPerfil {
  uri: string;
  mimeType?: string;
  fileName?: string | null;
  fileSize?: number;
  // Archivo proporcionado por Expo al seleccionar una foto desde el navegador.
  file?: File;
}

// Respuesta de POST /perfil/foto cuando Laravel confirma la subida.
export interface RespuestaActualizarFotoPerfil {
  mensaje: string;
  foto_perfil_url: string;
}
