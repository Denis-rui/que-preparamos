// Solo para probar la interfaz: no autentica ni guarda una sesión real.
const cuentasDePrueba = [
  { id: "1", name: "Usuario de prueba", email: "prueba@example.com" },
  { id: "2", name: "Otra cuenta", email: "otra@example.com" },
];

export async function obtenerCuentasRecordadas() {
  return cuentasDePrueba.map((account) => ({ ...account }));
}

/** @param {{ id: string, name: string, email: string }} account */
export async function validarSesion(account) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { ...account };
}
