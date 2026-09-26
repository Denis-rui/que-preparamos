# API del backend para ¿Qué Preparamos?

Guía para comprender qué endpoints ofrece `recetas-api`, para qué se utilizarán en la aplicación móvil y qué información debe enviarse o recibirse.

**Fecha de revisión:** 18 de septiembre de 2026. **Base del documento:** rutas, controladores, validaciones, acciones y recursos de respuesta del backend. Los ejemplos son ilustrativos: sus identificadores, usuarios y tokens deben sustituirse por datos del entorno de pruebas.

Esta revisión confirma lo que está definido en el código. No acredita funcionamiento en un servidor, entrega de correos ni integración terminada en la app. No se ejecutaron peticiones, pruebas ni cambios de base de datos. El PHP localizado en XAMPP es 8.2.12 y las dependencias instaladas requieren al menos 8.4.1, por lo que no se ejecutó Artisan.

## Índice

1. [Cómo se conecta la aplicación](#1-cómo-se-conecta-la-aplicación)
2. [Qué API utiliza cada pantalla](#2-qué-api-utiliza-cada-pantalla)
3. [Catálogo público y búsqueda](#3-catálogo-público-y-búsqueda)
4. [Registro, sesión y recuperación](#4-registro-sesión-y-recuperación)
5. [Mi perfil](#5-mi-perfil)
6. [Mis recetas](#6-mis-recetas)
7. [Publicación y correcciones](#7-publicación-y-correcciones)
8. [Mis solicitudes de revisión](#8-mis-solicitudes-de-revisión)
9. [Favoritos y disponibilidad](#9-favoritos-y-disponibilidad)
10. [Valoraciones](#10-valoraciones)
11. [Errores y límites de solicitudes](#11-errores-y-límites-de-solicitudes)
12. [Funciones que no cubre esta API](#12-funciones-que-no-cubre-esta-api)
13. [Fuentes y alcance de la revisión](#13-fuentes-y-alcance-de-la-revisión)

## 1. Cómo se conecta la aplicación

La aplicación móvil envía solicitudes HTTP a Laravel. Laravel comprueba los datos y permisos, consulta o modifica MariaDB y devuelve una respuesta. El teléfono no se conecta directamente a la base de datos.

Un **endpoint** es una operación identificada por un método y una ruta. Por ejemplo, `GET /recetas` consulta recetas, mientras que `POST /mis-recetas` guarda una receta propia.

### Dirección y métodos

Todas las rutas de esta guía parten de **`/api/v1`**, excepto la ruta anterior `/api/user`, que se indica expresamente. Así, `GET /categorias` corresponde a `GET /api/v1/categorias`.

La dirección del servidor debe configurarse según el entorno. Este documento no fija ni verifica un dominio, una IP o un puerto. En un teléfono físico, `localhost` apunta al propio teléfono: debe utilizarse una dirección del backend accesible desde ese dispositivo.

| Método          | Uso habitual en esta API                                                |
| --------------- | ----------------------------------------------------------------------- |
| `GET`           | Consultar listas, detalles o imágenes.                                  |
| `POST`          | Crear registros, iniciar sesión, subir archivos o enviar una solicitud. |
| `PUT` / `PATCH` | Actualizar información, según las reglas de cada endpoint.              |
| `DELETE`        | Quitar un favorito o eliminar una receta propia.                        |

### Acceso público y acceso con cuenta

**Público** significa que no se necesita iniciar sesión. **Protegido** significa que se necesita un token válido y una cuenta activa. Un usuario normal y un administrador pueden usar las operaciones protegidas, respetando la propiedad de los recursos.

Cabeceras para una petición JSON protegida:

```http
Accept: application/json
Content-Type: application/json
Authorization: Bearer <TOKEN_DEVUELTO_POR_LOGIN>
```

En peticiones públicas se omite `Authorization`. Para subir imágenes se utiliza `multipart/form-data`; el cliente debe generar la cabecera con su separador o `boundary`, en lugar de fijar `Content-Type: application/json`.

Las rutas de imágenes devuelven **el archivo**, no un objeto JSON. La foto de perfil, las imágenes de recetas propias y las de solicitudes también requieren autorización. Para mostrarlas, el cliente debe incluir el token en la descarga.

### Respuestas y paginación

Las consultas normalmente devuelven `data`. Algunas operaciones devuelven `mensaje` junto con `usuario`, `receta` o `solicitud`; no debe suponerse que todas las respuestas tienen la misma estructura.

Ingredientes, recetas públicas, recetas propias, solicitudes y favoritos tienen paginación:

| Parámetro  | Regla                                                                        |
| ---------- | ---------------------------------------------------------------------------- |
| `page`     | Página desde 1. Existe además un límite técnico para evitar desbordamientos. |
| `per_page` | Entre 1 y 50; por defecto 15. No admite `-1` para traer todo.                |

Sus respuestas contienen `data`, `links` y `meta`. En `meta` aparecen, entre otros, `current_page`, `last_page`, `per_page`, `from`, `to` y `total`. Una consulta sin resultados devuelve `data: []`. Categorías devuelve la lista completa, sin paginación.

Los identificadores deben ser enteros positivos o cadenas decimales sin adornos, como `12` o `"12"`. No usar `"012"`, `"+12"`, `"1e2"`, decimales ni espacios. Un identificador inválido en la ruta normalmente produce `404`; en filtros o cuerpos, `422`.

## 2. Qué API utiliza cada pantalla

Esta tabla propone dónde consumir los endpoints; no afirma que las pantallas ya estén conectadas.

| Pantalla o acción móvil   | Endpoints principales                                    | Para qué se utilizarán                                                    |
| ------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------- |
| Inicio y explorar         | `GET /recetas`, `GET /categorias`                        | Mostrar publicaciones y filtros por categoría.                            |
| Ingredientes disponibles  | `GET /ingredientes`, `GET /recetas` con `ingredientes[]` | Seleccionar ingredientes y encontrar recetas con menos faltantes.         |
| Detalle de receta         | `GET /recetas/{receta}` y su imagen                      | Mostrar preparación, cantidades, pasos, tips y promedio de valoraciones.  |
| Crear cuenta e ingresar   | `/auth/registro`, `/auth/login`                          | Registrar al usuario y obtener acceso autenticado.                        |
| Olvidé mi contraseña      | Las tres rutas de `/auth/recuperacion`                   | Solicitar código, comprobarlo y establecer una nueva contraseña.          |
| Mi perfil                 | `/perfil`, `/perfil/foto`, `/perfil/password`            | Consultar y cambiar datos de la cuenta.                                   |
| Mis recetas               | `/mis-recetas` y sus operaciones por ID                  | Guardar recetas privadas, consultarlas, editarlas y eliminarlas.          |
| Publicar o corregir       | `/mis-recetas/{receta}/publicar` y `/corregir`           | Publicar según el rol o proponer cambios para revisión.                   |
| Estado de mis envíos      | `/mis-solicitudes`                                       | Consultar decisiones, motivos de rechazo y cancelar pendientes.           |
| Favoritos con cuenta      | `/favoritos`                                             | Recuperar y administrar favoritos vinculados a la cuenta.                 |
| Revisar recetas guardadas | `/recetas/verificar-disponibilidad`                      | Confirmar disponibilidad al recuperar la conexión, incluso como invitado. |
| Valorar una receta        | `/recetas/{receta}/valoracion`                           | Consultar, asignar o modificar la puntuación personal.                    |

## 3. Catálogo público y búsqueda

Estos endpoints se pueden utilizar como invitado.

Ademas se a agregado esta api recetas/aleatorias para las recetas aleatoriaas de inicio

| Método y ruta                  | Para qué sirve                                                 | Entrada y respuesta de éxito                                                      |
| ------------------------------ | -------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `GET /categorias`              | Construir los filtros y el selector del formulario de recetas. | Sin cuerpo. `200`, `data` con objetos `{id, nombre}`, ordenados por nombre e ID.  |
| `GET /ingredientes`            | Buscar ingredientes existentes para seleccionarlos.            | `buscar`, `page`, `per_page` opcionales. `200`, lista paginada de `{id, nombre}`. |
| `GET /recetas`                 | Alimentar el inicio y los resultados de búsqueda.              | Filtros descritos abajo. `200`, catálogo paginado.                                |
| `GET /recetas/{receta}`        | Abrir la ficha completa de una publicación.                    | ID en la ruta. `200`, detalle en `data`.                                          |
| `GET /recetas/{receta}/imagen` | Mostrar la fotografía pública.                                 | ID en la ruta. `200`, archivo de imagen.                                          |

El catálogo solo incluye recetas publicadas y no eliminadas. Deshabilitar la cuenta autora no retira automáticamente sus recetas públicas. Una receta privada, eliminada o inexistente no se puede abrir mediante el detalle público y devuelve `404`. La imagen también puede devolver `404` si falta el archivo.

### Buscar por nombre, categoría o ingredientes

| Filtro de `GET /recetas` | Significado                                                                                                  |
| ------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `buscar`                 | Texto contenido en el nombre, hasta 100 caracteres. También se utiliza en ingredientes.                      |
| `categoria_id`           | ID de una categoría existente.                                                                               |
| `ingredientes[]`         | Lista de hasta 50 IDs de ingredientes existentes, sin repetir. Vacía equivale a no filtrar por ingredientes. |
| `page`, `per_page`       | Controles de paginación.                                                                                     |

Ejemplos:

```http
GET /api/v1/ingredientes?buscar=arroz&per_page=15&page=1
GET /api/v1/recetas?buscar=arroz&categoria_id=1&per_page=15&page=1
GET /api/v1/recetas?ingredientes[]=1&ingredientes[]=2&per_page=15&page=1
```

Los filtros pueden combinarse. Los IDs de los ejemplos solo funcionan si existen en el catálogo del entorno.

**Ejemplo de uso:** una persona selecciona arroz y zanahoria. El backend incluye recetas que contengan al menos uno de esos ingredientes y coloca primero las que tengan menos ingredientes faltantes. En caso de empate, ordena por fecha de publicación más reciente y luego por ID descendente. Sin selección de ingredientes, utiliza los dos últimos criterios.

La comparación se realiza por identificador; no calcula si alcanza la cantidad disponible ni convierte unidades. Con una selección no vacía, cada resultado incorpora:

- `ingredientes_disponibles` e `ingredientes_faltantes`: listas de objetos con `ingrediente_id` y `nombre`.
- `cantidad_coincidencias` y `cantidad_faltantes`: cantidades para explicar el resultado en pantalla.

Laravel no guarda esta selección como una despensa. El comportamiento acordado para la app es conservarla mientras esté abierta, enviarla en cada búsqueda y borrarla al cerrarla por completo.

### Qué devuelve una receta

La tarjeta del catálogo incluye `id`, `nombre`, `descripcion`, `imagen_url`, `porciones`, `tiempo_preparacion`, `categorias`, `valoracion_promedio`, `cantidad_valoraciones`, `ingredientes_resumen` y `cantidad_ingredientes`.

`ingredientes_resumen` contiene como máximo tres ingredientes. Para cocinar o preparar una copia local completa hay que consultar el detalle, que añade `tips`, `ingredientes` y `pasos`.

| Campo del detalle       | Estructura o significado                                                                |
| ----------------------- | --------------------------------------------------------------------------------------- |
| `categorias`            | Lista de `{id, nombre}`. El contrato actual admite varias categorías.                   |
| `ingredientes`          | Lista ordenada con `ingrediente_id`, `nombre`, `cantidad`, `unidad`, `notas` y `orden`. |
| `pasos`                 | Lista ordenada con `orden` e `instruccion`.                                             |
| `tips`                  | Texto de consejos o `null`.                                                             |
| `valoracion_promedio`   | Promedio redondeado a dos decimales; `null` si no hay valoraciones.                     |
| `cantidad_valoraciones` | Número de valoraciones registradas.                                                     |

En un ingrediente, `cantidad`, `unidad` y `notas` pueden ser `null`. El detalle público no incluye la valoración personal, el estado de favorito ni la versión de edición; esos datos se consultan por sus rutas correspondientes.

## 4. Registro, sesión y recuperación

### Registro e inicio de sesión

| Método y ruta         | Acceso    | Entrada                                               | Resultado                                                               |
| --------------------- | --------- | ----------------------------------------------------- | ----------------------------------------------------------------------- |
| `POST /auth/registro` | Público   | `name`, `email`, `password`, `password_confirmation`. | `201`: `mensaje` y `usuario`. Crea una cuenta activa con rol `usuario`. |
| `POST /auth/login`    | Público   | `email`, `password`; `dispositivo` opcional.          | `200`: `mensaje`, `token`, `token_type` y `usuario`.                    |
| `POST /auth/logout`   | Protegido | Sin cuerpo obligatorio.                               | `200`: `mensaje`. Revoca el token utilizado en esa petición.            |

El nombre y el correo de registro admiten hasta 255 caracteres; el correo debe ser único. La contraseña nueva necesita al menos 12 caracteres y confirmación. `dispositivo` admite hasta 255 caracteres y permite identificar el acceso, por ejemplo, como «Teléfono Android».

Ejemplo de registro:

```http
POST /api/v1/auth/registro
```

```json
{
  "name": "Ana Pérez",
  "email": "ana@example.com",
  "password": "ClaveEjemplo2026!",
  "password_confirmation": "ClaveEjemplo2026!"
}
```

Registrar la cuenta **no inicia sesión ni devuelve un token**. Después se utiliza el inicio de sesión:

```http
POST /api/v1/auth/login
```

```json
{
  "email": "ana@example.com",
  "password": "ClaveEjemplo2026!",
  "dispositivo": "Teléfono Android"
}
```

Ejemplo ilustrativo de respuesta:

```json
{
  "mensaje": "Inicio de sesión exitoso.",
  "token": "<TOKEN_GENERADO_POR_EL_SERVIDOR>",
  "token_type": "Bearer",
  "usuario": {
    "id": 7,
    "name": "Ana Pérez",
    "email": "ana@example.com",
    "foto_perfil_url": null,
    "rol": "usuario",
    "activo": true
  }
}
```

La app debe conservar el token de forma segura y usarlo en las peticiones protegidas. No debe incluirlo en enlaces para compartir. Un inicio de sesión rechazado responde `401` con el mismo mensaje para credenciales incorrectas y cuentas inactivas.

La duración predeterminada del token en `config/sanctum.php` es 43 200 minutos, equivalentes a 30 días; puede cambiar mediante `SANCTUM_EXPIRATION`. No se verificó el valor efectivo del servidor. No existe una ruta de renovación del token: al vencer o revocarse, se necesita iniciar sesión de nuevo.

### Recuperación de contraseña en tres pasos

Se utiliza cuando la persona olvidó la contraseña y no puede iniciar sesión. Todas estas rutas son públicas.

| Paso y ruta                              | Cuerpo requerido                                           | Respuesta `200` y uso móvil                                              |
| ---------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------ |
| 1. `POST /auth/recuperacion/solicitar`   | `email`.                                                   | `mensaje` genérico. Mostrar la pantalla para introducir el código.       |
| 2. `POST /auth/recuperacion/verificar`   | `email` y `codigo`, cadena de seis dígitos.                | `mensaje`, `token_recuperacion`. Permitir escribir una contraseña nueva. |
| 3. `POST /auth/recuperacion/restablecer` | `token_recuperacion`, `password`, `password_confirmation`. | `mensaje`. Regresar al inicio de sesión.                                 |

Ejemplo del segundo paso:

```json
{
  "email": "ana@example.com",
  "codigo": "012345"
}
```

El código se envía como texto para conservar un posible cero inicial. Tiene una vigencia de 10 minutos y se invalida tras cinco intentos fallidos. Solicitar otro invalida las recuperaciones anteriores; hay una espera mínima de 60 segundos entre solicitudes por correo.

Tras verificarlo se obtiene `token_recuperacion`, de un solo uso y con vigencia de 15 minutos. Se envía en el **cuerpo** del tercer paso; no sustituye al token Bearer. Restablecer la contraseña revoca los tokens móviles, las sesiones web y el acceso persistente anterior.

La respuesta del primer paso no confirma que exista una cuenta ni que el correo haya llegado: las cuentas inexistentes o deshabilitadas reciben el mismo mensaje sin generar código. El envío real depende de la configuración del correo y del procesamiento de la cola.

## 5. Mi perfil

Todas las operaciones requieren autenticación. Actúan sobre la cuenta del token, sin recibir un ID de usuario.

| Método y ruta          | Para qué sirve                                | Entrada                                                     | Respuesta de éxito                                                        |
| ---------------------- | --------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------- |
| `GET /perfil`          | Cargar «Mi perfil».                           | Sin cuerpo.                                                 | `200`, `data`: `id`, `name`, `email`, `foto_perfil_url`, `rol`, `activo`. |
| `PATCH /perfil`        | Cambiar nombre o correo.                      | `name` y/o `email`; `current_password` si cambia el correo. | `200`, `mensaje` y `usuario`.                                             |
| `GET /perfil/foto`     | Descargar la foto de la cuenta.               | Sin cuerpo.                                                 | `200`, archivo; `404` si no hay foto disponible.                          |
| `POST /perfil/foto`    | Agregar o reemplazar la foto.                 | Archivo `foto_perfil` mediante formulario multipart.        | `200`, `mensaje` y `foto_perfil_url`.                                     |
| `PUT /perfil/password` | Cambiar la contraseña con la sesión iniciada. | `current_password`, `password`, `password_confirmation`.    | `200`, `mensaje`; obliga a iniciar sesión otra vez.                       |

Ejemplo para cambiar solo el nombre:

```http
PATCH /api/v1/perfil
```

```json
{
  "name": "Ana Pérez López"
}
```

Los campos omitidos se conservan. Si cambia el correo, se exige la contraseña actual; el nuevo correo debe ser único. No se permite utilizar este endpoint para cambiar el rol o el estado de la cuenta.

La foto admite JPEG/JPG, PNG o WEBP de hasta 2048 KiB. La contraseña nueva debe tener al menos 12 caracteres, coincidir con su confirmación y ser distinta de la actual. Cambiarla revoca todos los accesos, incluido el token que hizo la petición.

**Ruta anterior:** `GET /api/user`, fuera de `/api/v1`, también está protegida y devuelve el perfil dentro de `data`. Para la integración nueva se utiliza `GET /api/v1/perfil`.

## 6. Mis recetas

Se utiliza para las recetas creadas por la cuenta autenticada. Guardar una receta aquí la conserva en el servidor como **privada**; no la publica. Un administrador también debe ser el autor para utilizar estas operaciones sobre una receta.

| Método y ruta                                 | Para qué sirve                                   | Entrada y resultado                                                                    |
| --------------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------- |
| `GET /mis-recetas`                            | Mostrar el listado propio.                       | `filtro`, `buscar`, `page`, `per_page` opcionales. `200`, colección paginada.          |
| `POST /mis-recetas`                           | Guardar una receta completa en la cuenta.        | Contenido e imagen. `201`, detalle en `data`, `visibilidad: "privada"`, `version: 1`.  |
| `GET /mis-recetas/{receta}`                   | Consultar contenido y estado antes de editar.    | `200`, detalle propio en `data`.                                                       |
| `PUT`, `PATCH` o `POST /mis-recetas/{receta}` | Actualizar una receta privada.                   | Contenido completo y `version`; imagen opcional. `200`, detalle actualizado en `data`. |
| `DELETE /mis-recetas/{receta}`                | Eliminar una receta propia, privada o publicada. | Sin cuerpo obligatorio. `200`, `mensaje` y `receta` con metadatos de eliminación.      |
| `GET /mis-recetas/{receta}/imagen`            | Mostrar la imagen vigente al autor.              | `200`, archivo de imagen autenticado.                                                  |
| `POST /mis-recetas/{receta}/imagen`           | Subir una imagen para esa receta.                | Archivo `imagen`. `200`, `mensaje`, `imagen` e `imagen_url`.                           |

Las rutas de publicación y corrección se explican en la siguiente sección.

### Listar y reconocer el estado

`filtro` admite `todas` —valor predeterminado—, `privadas`, `publicadas` o `eliminadas`. `buscar` filtra por nombre y admite hasta 100 caracteres. El orden es por ID descendente.

```http
GET /api/v1/mis-recetas?filtro=privadas&per_page=15&page=1
```

El recurso propio agrega `visibilidad`, `version`, `solicitud_pendiente`, `created_at`, `updated_at` y `publicada_en`. `solicitud_pendiente` puede ser `null` o contener `id`, `tipo`, `estado` y `created_at`. Conviene volver a consultar el detalle para conocer el estado vigente: no todas las respuestas de escritura cargan esa relación.

El listado con `todas` incluye las eliminadas. El detalle de una receta eliminada devuelve metadatos como `id`, `nombre`, `visibilidad`, `version`, `deleted_at`, `tipo_eliminacion` y `motivo_eliminacion`, sin ingredientes ni pasos. No asumir que el listado y el detalle de eliminadas tienen exactamente los mismos campos.

### Datos necesarios para guardar

| Campo                             | Regla del contrato actual                                                                                |
| --------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `nombre`                          | Obligatorio, hasta 150 caracteres.                                                                       |
| `descripcion`                     | Obligatoria, hasta 16 000 caracteres.                                                                    |
| `imagen`                          | Obligatoria al crear. Para una receta nueva, adjuntar un archivo JPEG/JPG, PNG o WEBP de hasta 2048 KiB. |
| `porciones`, `tiempo_preparacion` | Enteros entre 1 y 65 535.                                                                                |
| `tips`                            | Opcional o `null`, hasta 16 000 caracteres.                                                              |
| `categorias`                      | Lista de 1 a 100 IDs existentes, sin repetir.                                                            |
| `ingredientes`                    | Lista de 1 a 500 ingredientes existentes, sin repetir ID.                                                |
| `pasos`                           | Lista de 1 a 500 pasos. Basta un paso para cumplir el mínimo del backend.                                |

Cada ingrediente lleva `ingrediente_id`, `cantidad`, `unidad`, `notas` y `orden`. Las claves `cantidad`, `unidad` y `notas` deben estar presentes, aunque su valor sea `null`. Si se informa una cantidad, debe ser mayor que cero, como máximo 9 999 999.999 y con hasta tres decimales. `unidad` admite hasta 50 caracteres y `notas` hasta 16 000.

Cada paso lleva `orden` e `instruccion`, con hasta 16 000 caracteres de instrucción. Los órdenes de pasos y de ingredientes son enteros entre 1 y 65 535, sin repetir dentro de su respectiva lista. Las listas deben tener índices consecutivos desde cero.

Ejemplo de campos de un formulario **multipart** para crear una receta. `imagen` representa un archivo real, no el texto entre corchetes:

```text
POST /api/v1/mis-recetas

nombre: Arroz blanco
descripcion: Arroz cocido para acompañar el almuerzo.
porciones: 2
tiempo_preparacion: 20
imagen: [archivo arroz.jpg]
categorias: [1]
ingredientes: [{"ingrediente_id":1,"cantidad":1,"unidad":"taza","notas":null,"orden":1},{"ingrediente_id":2,"cantidad":2,"unidad":"tazas","notas":null,"orden":2}]
pasos: [{"orden":1,"instruccion":"Colocar el arroz y el agua en una olla y cocinar hasta que el arroz esté listo."}]
```

En este ejemplo se supone que categoría `1` es Comidas, ingrediente `1` es arroz e ingrediente `2` es agua. Se deben obtener los IDs reales de los catálogos. El backend acepta `categorias`, `ingredientes` y `pasos` como textos JSON dentro del formulario y los convierte a listas. `tips` se omitió porque es opcional.

El contrato también valida referencias de imágenes ya almacenadas para la receta correspondiente. Una ruta del teléfono o un nombre inventado de archivo no sustituye la subida de una imagen.

### Edición y eliminación

Para editar, primero consultar `GET /mis-recetas/{receta}` y conservar su `version`. Enviar después el contenido completo y esa versión. Si la edición se acepta, la versión aumenta; si quedó desactualizada, se devuelve `409` y hay que recargar los datos.

**Aunque se utilice `PATCH`, este formulario exige el contenido completo.** La imagen puede omitirse para conservar la actual. Con archivos se puede utilizar la variante `POST` admitida por la ruta. No se puede editar así una receta publicada, eliminada o con solicitud pendiente.

Eliminar una receta retira su publicación del catálogo, cancela las solicitudes pendientes y conserva la referencia necesaria para los avisos en favoritos. Es una eliminación lógica. Repetir la eliminación devuelve `422`; no existe una ruta de restauración.

La subida independiente de imagen tiene una diferencia según el estado: en una receta privada actualiza su imagen vigente; en una publicada almacena una imagen que puede utilizarse en una propuesta de corrección. Rechaza recetas eliminadas o con solicitud pendiente. No recibe `version` ni la incrementa en su implementación actual, por lo que no debe suponerse el mismo control de versión que en la edición completa.

## 7. Publicación y correcciones

Estas operaciones son protegidas y solo actúan sobre recetas propias.

| Método y ruta                         | Para qué sirve                                            | Entrada                                            | Resultado                                                                                                                    |
| ------------------------------------- | --------------------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `POST /mis-recetas/{receta}/publicar` | Solicitar que una receta privada aparezca en el catálogo. | `clave_idempotencia` en formato UUID.              | Usuario normal: `201`, `mensaje` y `solicitud` pendiente. Administrador: `200`, `mensaje` y `receta` publicada directamente. |
| `POST /mis-recetas/{receta}/corregir` | Proponer cambios a una receta ya publicada.               | `clave_idempotencia`, `version_base`, `contenido`. | `201`, `mensaje` y `solicitud` pendiente, también si el autor es administrador.                                              |

### Publicar una receta privada

```http
POST /api/v1/mis-recetas/42/publicar
```

```json
{
  "clave_idempotencia": "c2455f7b-66db-4d37-935f-30b88c760919"
}
```

Para un usuario normal, este envío no hace pública la receta: debe aprobarse desde el panel web. Mientras la publicación esté pendiente, la receta continúa privada y se bloquea su edición. Para cambiarla, primero se cancela la solicitud, después se edita y finalmente se envía una nueva publicación.

Un administrador publica directamente sus propias recetas con este mismo endpoint. No se crea una solicitud ficticia. Una receta publicada no puede volver a privada mediante estas rutas.

### Corregir una receta publicada

La app obtiene `version_base` del campo `version` del detalle propio, no del catálogo público. `contenido` debe ser la propuesta completa, con los campos de receta descritos anteriormente. No basta con mandar únicamente la frase modificada.

Ejemplo de corrección que conserva la imagen:

```http
POST /api/v1/mis-recetas/42/corregir
```

```json
{
  "clave_idempotencia": "4ae23c2d-e1cb-4bf0-8b38-90b8c07a45f6",
  "version_base": 2,
  "contenido": {
    "nombre": "Arroz blanco",
    "descripcion": "Arroz blanco cocido para acompañar el almuerzo.",
    "porciones": 2,
    "tiempo_preparacion": 20,
    "tips": null,
    "categorias": [1],
    "ingredientes": [
      {
        "ingrediente_id": 1,
        "cantidad": 1,
        "unidad": "taza",
        "notas": null,
        "orden": 1
      },
      {
        "ingrediente_id": 2,
        "cantidad": 2,
        "unidad": "tazas",
        "notas": null,
        "orden": 2
      }
    ],
    "pasos": [
      {
        "orden": 1,
        "instruccion": "Colocar el arroz y el agua en una olla y cocinar hasta que el arroz esté listo."
      }
    ]
  }
}
```

Omitir `contenido.imagen` conserva la imagen vigente. Para proponer otra, primero subirla mediante `POST /mis-recetas/{receta}/imagen` y enviar en `contenido.imagen` la referencia recibida en `imagen`. `imagen_url` sirve para visualizar y no debe enviarse como referencia interna. En una receta publicada, la URL devuelta por la subida sigue apuntando a la imagen vigente; la imagen propuesta se consulta desde la solicitud creada.

Mientras se revisa la corrección, permanece visible la versión aprobada. Todas las correcciones pasan a revisión, incluidas las de administradores. La regla funcional acordada permite correcciones menores; si el cambio transforma la preparación, corresponde crear una receta nueva con sus propias valoraciones. La valoración de esa diferencia es administrativa.

### Reintentos sin duplicar solicitudes

`clave_idempotencia` identifica una operación. La app debe generar un UUID nuevo para un envío nuevo y conservarlo si necesita repetir **ese mismo envío** por un fallo de conexión.

Un reintento reconocido devuelve `200` con la solicitud ya registrada o la receta de publicación directa, sin repetir los efectos. Puede devolver el estado actual de una solicitud que ya fue revisada o cancelada. Cambiar de receta, operación o contenido reutilizando la misma clave produce `422`. Para corregir datos o reenviar después de un rechazo/cancelación se utiliza una clave nueva.

Una `version_base` desactualizada en una corrección devuelve `422`; el `409` corresponde a la edición de recetas privadas. Esta protección con UUID existe para publicar y corregir, no para todas las escrituras: repetir a ciegas `POST /mis-recetas` podría crear otra receta.

## 8. Mis solicitudes de revisión

Permiten mostrar el seguimiento de publicaciones y correcciones de la cuenta autenticada.

| Método y ruta                                | Para qué sirve                                | Entrada y respuesta                                                         |
| -------------------------------------------- | --------------------------------------------- | --------------------------------------------------------------------------- |
| `GET /mis-solicitudes`                       | Mostrar el historial y los envíos pendientes. | `estado`, `tipo`, `page`, `per_page` opcionales. `200`, colección paginada. |
| `GET /mis-solicitudes/{solicitud}`           | Ver la propuesta enviada y su decisión.       | `200`, detalle en `data`, incluido `contenido`.                             |
| `GET /mis-solicitudes/{solicitud}/imagen`    | Mostrar la fotografía de la propuesta.        | `200`, archivo autenticado; `404` si no se encuentra.                       |
| `POST /mis-solicitudes/{solicitud}/cancelar` | Retirar una solicitud pendiente.              | Sin cuerpo obligatorio. `200`, `mensaje` y `solicitud`.                     |

`estado` admite `todos` —predeterminado—, `pendiente`, `aprobada`, `rechazada` o `cancelada`. `tipo` admite `todos` —predeterminado—, `publicacion` o `correccion`. Se ordenan por fecha de creación e ID descendentes.

```http
GET /api/v1/mis-solicitudes?estado=rechazada&tipo=publicacion
POST /api/v1/mis-solicitudes/18/cancelar
```

El resumen incluye `id`, `receta_id`, `receta_nombre`, `tipo`, `estado`, `version_base`, `clave_idempotencia`, `created_at`, `revisada_en`, `cancelada_en` y `motivo_rechazo`. Así, la app puede mostrar por qué se rechazó un envío y permitir preparar uno nuevo.

El detalle agrega `contenido`, con los datos propuestos, nombres de categorías e ingredientes e `imagen_url`. Para reenviar, hay que reconstruir el cuerpo de escritura: `categorias` se envía como IDs y los ingredientes sin el campo de lectura `nombre`. No copiar el objeto de respuesta completo al formulario de corrección.

Cancelar una publicación conserva la receta privada. Cancelar una corrección conserva la publicación anterior. No se puede cancelar una solicitud aprobada o rechazada (`422`); repetir la cancelación de una ya cancelada devuelve éxito. No existe en esta API móvil una operación para aprobar o rechazar solicitudes ajenas: esas acciones pertenecen al panel web.

## 9. Favoritos y disponibilidad

### Favoritos vinculados a una cuenta

Todas estas rutas requieren autenticación:

| Método y ruta                              | Para qué sirve                                     | Entrada y respuesta                                                         |
| ------------------------------------------ | -------------------------------------------------- | --------------------------------------------------------------------------- |
| `GET /favoritos`                           | Cargar la lista guardada por el usuario.           | `page`, `per_page` opcionales. `200`, colección paginada.                   |
| `POST /favoritos/{receta}`                 | Guardar una receta publicada.                      | Sin cuerpo obligatorio. `201`, `mensaje`, `receta_id`, `es_favorito: true`. |
| `DELETE /favoritos/{receta}`               | Quitarla de favoritos, incluso si fue eliminada.   | Sin cuerpo obligatorio. `200`, `mensaje`, `es_favorito: false`.             |
| `GET /favoritos/{receta}/estado`           | Saber cómo mostrar el botón de favorito.           | `200`, `receta_id` y `es_favorito`.                                         |
| `POST /favoritos/verificar-disponibilidad` | Comprobar varios IDs desde una sesión autenticada. | Cuerpo `ids`; `200`, resultados en `data`, descritos abajo.                 |

Ejemplo al pulsar «Guardar en favoritos»:

```http
POST /api/v1/favoritos/42
```

```json
{
  "mensaje": "Receta agregada a favoritos exitosamente.",
  "receta_id": 42,
  "es_favorito": true
}
```

Agregar el mismo favorito otra vez no crea una segunda entrada. Quitar uno que ya se quitó también devuelve éxito. No se puede agregar una receta privada ni una eliminada. La consulta de estado reconoce recetas publicadas —incluidas las eliminadas— y recetas propias; una privada ajena o un ID inexistente devuelve `404`.

Los favoritos vigentes incluyen el resumen de la receta, `visibilidad: "publicada"` y `agregado_en`, ordenados por fecha de agregado e ID de favorito descendentes. Si la receta fue eliminada, la entrada permanece con `id`, `nombre`, `visibilidad: "eliminada"`, `mensaje` y `agregado_en`. Ya no contiene los datos de preparación.

Los avisos distinguen «Esta receta fue eliminada por su autor» y «Esta receta fue eliminada». El motivo administrativo no se expone a quien simplemente guardó el favorito.

### Comprobar disponibilidad como invitado o con cuenta

**`POST /recetas/verificar-disponibilidad` es público.** Sirve para revisar IDs almacenados en el teléfono sin exigir una sesión. La variante protegida `/favoritos/verificar-disponibilidad` realiza la misma comprobación; no agrega favoritos ni exige que los IDs consultados ya estén guardados en la cuenta.

```http
POST /api/v1/recetas/verificar-disponibilidad
```

```json
{
  "ids": [42, 43, 44, 45]
}
```

Se requiere una lista de entre 1 y 50 IDs positivos, sin duplicados. Ejemplo ilustrativo de respuesta:

```json
{
  "data": [
    { "id": 42, "estado": "disponible" },
    {
      "id": 43,
      "estado": "eliminada_autor",
      "mensaje": "Esta receta fue eliminada por su autor"
    },
    {
      "id": 44,
      "estado": "eliminada_administracion",
      "mensaje": "Esta receta fue eliminada"
    },
    { "id": 45, "estado": "no_disponible" }
  ]
}
```

| Estado                     | Interpretación para la app                                                                                                   |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `disponible`               | La receta está publicada y no eliminada.                                                                                     |
| `eliminada_autor`          | Eliminación confirmada y atribuida al autor. Mostrar su aviso.                                                               |
| `eliminada_administracion` | Eliminación confirmada con aviso general. No atribuirla al autor.                                                            |
| `no_disponible`            | No hay una publicación identificable para esa consulta. No revela si existe una receta privada ni confirma quién la eliminó. |

La API no descarga ni elimina por sí misma archivos del teléfono. Según la regla funcional acordada, si ya hay una copia local puede consultarse sin conexión hasta que se confirme la eliminación. Cuando llegue esa confirmación, la app debe dejar de mostrar su contenido y conservar el aviso con la opción de quitar el favorito. Un fallo de red, un error del servidor o un `404` genérico no confirman una eliminación.

Los invitados deben guardar sus favoritos en el dispositivo. No existe aquí un endpoint para sincronizar automáticamente esos favoritos al iniciar sesión; ese comportamiento sigue pendiente de definición e integración.

## 10. Valoraciones

Se utilizan para representar la puntuación personal mediante sombreritos de chef y actualizar el promedio. Requieren cuenta activa; también las pueden utilizar administradores.

| Método y ruta                               | Para qué sirve                            | Entrada y resultado                                                                          |
| ------------------------------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------- |
| `GET /recetas/{receta}/valoracion`          | Consultar el voto propio y los agregados. | `200`, `data` con `receta_id`, `puntuacion`, `valoracion_promedio`, `cantidad_valoraciones`. |
| `PUT` o `POST /recetas/{receta}/valoracion` | Registrar o modificar el voto propio.     | `puntuacion`, entero de 1 a 5. `200`, `mensaje` y `data` con los mismos campos.              |

```http
PUT /api/v1/recetas/42/valoracion
```

```json
{
  "puntuacion": 5
}
```

Si la persona todavía no votó, la consulta devuelve `puntuacion: null`. Modificar su voto no agrega un voto extra. El catálogo y el detalle público ya incluyen el promedio y la cantidad, por lo que no se necesita sesión para mostrarlos.

Solo se pueden valorar recetas publicadas y vigentes. Guardar una valoración sobre una publicación eliminada devuelve `422`; consultar la valoración de una receta que no está públicamente disponible devuelve `404`. No existe un endpoint para retirar la valoración ni para escribir reseñas de texto.

## 11. Errores y límites de solicitudes

### Qué debe hacer la app ante un error

| Código             | Significado en este contrato                                                             | Tratamiento esperado                                                           |
| ------------------ | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `401`              | Falta token válido o el inicio de sesión fue rechazado.                                  | Pedir acceso cuando corresponda; en login, informar que no se pudo ingresar.   |
| `403`              | Cuenta deshabilitada detectada con acceso residual o recurso ajeno sin permiso.          | Mostrar el motivo; no confundir todos los casos con una sesión vencida.        |
| `404`              | Recurso inexistente o no disponible para esa consulta; también archivo ausente.          | Mostrar que no está disponible, sin afirmar automáticamente que fue eliminado. |
| `409`              | Versión desactualizada al editar una receta privada.                                     | Recargar la receta y revisar los cambios antes de guardar otra vez.            |
| `422`              | Datos o estado no válidos, incluidas correcciones desactualizadas y claves reutilizadas. | Mostrar errores junto a los campos o explicar la regla incumplida.             |
| `429`              | Se alcanzó un límite de solicitudes.                                                     | Esperar lo indicado en `Retry-After` o `retry_after`.                          |
| `500` u otro `5xx` | Error del servidor.                                                                      | Informar el fallo; no dar por confirmada una escritura ni una eliminación.     |

Los mensajes definidos por los controladores suelen usar `mensaje`; las excepciones de Laravel utilizan `message`. El cliente debe admitir ambos y utilizar el código HTTP y `errors` para decidir qué mostrar, sin depender del texto exacto.

Ejemplo de validación:

```json
{
  "message": "La cantidad por página debe estar entre 1 y 50.",
  "errors": {
    "per_page": ["La cantidad por página debe estar entre 1 y 50."]
  }
}
```

### Límites definidos en el código

Son valores predeterminados; los configurables pueden cambiar en el entorno. No representan una cuota global para todas las consultas públicas.

| Operación                        | Límite                                                                                                                            |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Registro                         | 5 por minuto y 20 por hora por IP, configurables.                                                                                 |
| Login                            | 5 por minuto por correo y 10 por minuto por IP. El limitador cuenta solicitudes, aunque sus mensajes mencionen intentos fallidos. |
| Solicitar recuperación           | 1 por minuto y 5 por hora por correo; 15 por hora por IP.                                                                         |
| Verificar código                 | 10 por minuto por IP, además del máximo de cinco fallos por código.                                                               |
| Restablecer contraseña           | 10 por minuto por IP, configurable.                                                                                               |
| Disponibilidad pública           | 30 por minuto por IP, configurable.                                                                                               |
| Escrituras autenticadas          | 60 por minuto por cuenta, configurable. No incluye consultas `GET` ni logout.                                                     |
| Peticiones con archivo de imagen | 10 por minuto por cuenta, configurable y adicional a la cuota de escrituras.                                                      |

La verificación autenticada de disponibilidad consume la cuota de escrituras. La edición sin archivo no consume la cuota de imágenes. Las respuestas `429` de estos limitadores incluyen `mensaje`, `retry_after` en segundos y la cabecera `Retry-After`.

## 12. Funciones que no cubre esta API

| Necesidad del proyecto                               | Situación observada y responsabilidad                                                                                                                                                                                                    |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Borradores incompletos                               | No existe endpoint para guardarlos. El requisito es conservarlos localmente, asociados a la cuenta; guardar una receta privada en el servidor exige contenido completo.                                                                  |
| Consulta sin conexión                                | Hay endpoints para obtener contenido y comprobar disponibilidad. El almacenamiento local, las descargas y la actualización de copias deben implementarse en el móvil.                                                                    |
| Favoritos invitados                                  | Se conservan localmente. No hay endpoint de migración automática a la cuenta.                                                                                                                                                            |
| Lectura de instrucciones por audio                   | El detalle proporciona los pasos como texto. No hay un endpoint de audio; la herramienta y el comportamiento sin conexión siguen pendientes de definición.                                                                               |
| Compartir una receta y abrirla en la app             | El ID permite consultar su detalle JSON. No se encontró `share_url`, página pública de receta ni asociación de enlaces Android en las rutas revisadas. El flujo de compartir y el enlace diferido necesitan implementación y despliegue. |
| Verificar propiedad del correo                       | No hay rutas para verificar el correo al registrarse o cambiarlo. La recuperación por código tiene otro propósito.                                                                                                                       |
| Crear categorías o ingredientes desde el móvil       | Solo existen catálogos de lectura en esta API. No inventar IDs ni enviar ingredientes nuevos como si ya estuvieran registrados.                                                                                                          |
| Administrar cuentas y aprobar/rechazar recetas       | Se realiza mediante rutas del panel web, con sesión administrativa. El token móvil no sustituye ese acceso.                                                                                                                              |
| Retirada administrativa de recetas ajenas            | Los recursos contemplan avisos y metadatos de eliminación administrativa, pero no se encontró la ruta que complete esa operación en los archivos de rutas revisados. No confundir esos campos con un flujo ya disponible.                |
| Restaurar recetas, borrar la cuenta o renovar tokens | No hay endpoints para estas operaciones en `routes/api.php`.                                                                                                                                                                             |

Estas observaciones describen el backend revisado y los puntos de integración. No constituyen una auditoría de la implementación actual de las pantallas móviles.

## 13. Fuentes y alcance de la revisión

El documento se contrastó con estos archivos del repositorio **recetas-api**; las rutas de esta lista se interpretan desde la raíz de ese backend:

- `routes/api.php` y `bootstrap/app.php`: rutas, prefijo, autenticación y respuestas de errores.
- `app/Http/Controllers/Api/V1/`: operaciones, consultas y códigos de respuesta.
- `app/Http/Requests/Api/V1/`: campos obligatorios, filtros y validaciones.
- `app/Http/Resources/Api/V1/`: datos que recibe la aplicación.
- `app/Actions/Auth/`, `Recetas/`, `Favoritos/` y `Valoraciones/`: reglas de acceso, publicación, corrección, eliminación y reintentos.
- `app/Models/Receta.php`, `app/Models/User.php`, `app/Rules/IdentificadorEntero.php` y el middleware de cuenta activa: visibilidad, foto e identificadores.
- `app/Providers/AppServiceProvider.php`, `config/api.php` y `config/sanctum.php`: límites y expiración predeterminada de tokens.
- `routes/web.php`: separación entre la API móvil y la administración web.
- `CONTEXTO_PROYECTO.md`, `docs/patrones.md` y `docs/api.md`: contexto y documentación de apoyo, contrastados con el código actual.

Se priorizó el código cuando la documentación anterior contenía observaciones históricas. No se verificaron migraciones aplicadas, configuración efectiva del servidor, conectividad desde teléfonos ni entrega de correo. Tampoco se ejecutaron pruebas funcionales. La presencia de una ruta o de una prueba escrita no demuestra por sí sola que el servicio esté funcionando en el entorno de uso.
