import { QueryClient } from "@tanstack/react-query";
export const CLAVE_SESION = ["sesion"] as const;
export const clienteQuery = new QueryClient();
clienteQuery.setQueryDefaults(CLAVE_SESION, {
  staleTime: Infinity,
  gcTime: Infinity,
  retry: false,
});
