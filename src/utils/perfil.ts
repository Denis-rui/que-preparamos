import type { EditableProfile, Perfil } from "@/types/perfil";

// Compartimos la conversión al cargar, guardar o recuperar un guardado parcial.
export function aPerfilEditable(usuario: Perfil): EditableProfile {
  return {
    name: usuario.name,
    email: usuario.email,
    photoUri: usuario.foto_perfil_url ?? undefined,
  };
}
