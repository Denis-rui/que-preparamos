import { CLAVE_CUENTAS, clienteQuery } from "@/config/cliente-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { borrarFotoPerfil, leerFotoPerfil } from "./fotoPerfil";

export interface CuentaRecordada {
  // Completamos el ID de las cuentas antiguas cuando vuelven a iniciar sesión.
  id?: number;
  name: string;
  email: string;
  photoUri?: string;
}

function esCuenta(valor: unknown): valor is CuentaRecordada {
  if (!valor || typeof valor !== "object") return false;
  const cuenta = valor as CuentaRecordada;
  return (
    typeof cuenta.name === "string" &&
    typeof cuenta.email === "string" &&
    (cuenta.id === undefined ||
      (Number.isSafeInteger(cuenta.id) && cuenta.id > 0))
  );
}

async function leerLista(): Promise<CuentaRecordada[]> {
  const json = await AsyncStorage.getItem("cuentasGuardadas");
  const datos: unknown = json ? JSON.parse(json) : [];
  return Array.isArray(datos) ? datos.filter(esCuenta) : [];
}

async function conFoto(cuenta: CuentaRecordada): Promise<CuentaRecordada> {
  const photoUri = cuenta.id
    ? await leerFotoPerfil(cuenta.id).catch(() => null)
    : null;
  return { ...cuenta, photoUri: photoUri ?? undefined };
}

export async function leerCuentasGuardadas() {
  return Promise.all((await leerLista()).map(conFoto));
}

export async function leerUltimaCuenta(): Promise<CuentaRecordada | null> {
  const json = await AsyncStorage.getItem("ultimaCuentaSesion");
  const datos: unknown = json ? JSON.parse(json) : null;
  return esCuenta(datos) ? conFoto(datos) : null;
}

let escritura: Promise<unknown> = Promise.resolve();

export function olvidarCuenta(cuenta: CuentaRecordada) {
  const operacion = escritura.then(async () => {
    const cuentas = await leerLista();
    const correo = cuenta.email.trim().toLowerCase();
    const coincide = (item: CuentaRecordada) => cuenta.id !== undefined
      ? item.id === cuenta.id || (item.id === undefined && item.email.trim().toLowerCase() === correo)
      : item.id === undefined && item.email.trim().toLowerCase() === correo;
    const json = await AsyncStorage.getItem("ultimaCuentaSesion");
    const ultima: unknown = json ? JSON.parse(json) : null;
    // Borramos primero la foto y después la tarjeta. Si falla, se puede reintentar.
    if (cuenta.id !== undefined) await borrarFotoPerfil(cuenta.id);
    if (esCuenta(ultima) && coincide(ultima)) await AsyncStorage.removeItem("ultimaCuentaSesion");
    await AsyncStorage.setItem("cuentasGuardadas", JSON.stringify(cuentas.filter((item) => !coincide(item))));
  });
  escritura = operacion.catch(() => undefined);
  // Volvemos a leer la lista aunque solo se haya borrado parte de los datos.
  return operacion.finally(async () => {
    await clienteQuery.cancelQueries({ queryKey: CLAVE_CUENTAS });
    await clienteQuery.invalidateQueries({ queryKey: CLAVE_CUENTAS });
  });
}

export function guardarCuentaRecordada(
  cuenta: Pick<CuentaRecordada, "id" | "name" | "email">,
  opciones: {
    correoAnterior?: string;
    ultima?: boolean;
    sigueSesion?: () => Promise<boolean>;
  } = {},
) {
  // Guardamos una operación a la vez para que no se sobrescriban las cuentas.
  const operacion = escritura.then(async () => {
    if (opciones.sigueSesion && !(await opciones.sigueSesion())) return;
    const cuentas = await leerLista();
    const correos = new Set(
      [cuenta.email, opciones.correoAnterior]
        .filter((correo): correo is string => Boolean(correo))
        .map((correo) => correo.trim().toLowerCase()),
    );
    const coincide = (item: CuentaRecordada) =>
      cuenta.id !== undefined
        ? item.id === cuenta.id ||
          (item.id === undefined &&
            correos.has(item.email.trim().toLowerCase()))
        : correos.has(item.email.trim().toLowerCase());
    const posicion = cuentas.findIndex(coincide);
    // Un registro sin ID no borra el ID de una cuenta que ya conocemos.
    const id = cuenta.id ?? cuentas.find(coincide)?.id;
    const recordada = { id, name: cuenta.name, email: cuenta.email };
    const nuevas = cuentas.filter((item) => !coincide(item));
    nuevas.splice(posicion < 0 ? nuevas.length : posicion, 0, recordada);
    if (opciones.sigueSesion && !(await opciones.sigueSesion())) return;
    await AsyncStorage.setItem("cuentasGuardadas", JSON.stringify(nuevas));
    if (
      opciones.ultima &&
      (!opciones.sigueSesion || (await opciones.sigueSesion()))
    ) {
      await AsyncStorage.setItem(
        "ultimaCuentaSesion",
        JSON.stringify(recordada),
      );
    }
    void clienteQuery.invalidateQueries({ queryKey: CLAVE_CUENTAS });
  });
  escritura = operacion.catch(() => undefined);
  return operacion;
}
