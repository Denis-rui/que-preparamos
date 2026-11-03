# Dependencias

Realizar siempre

```consola
npm install
```

## Para las imagenes

1. aqui va lo que ya se tenia intalado
2. instalar las dependencias de expo para manipular imagenes y el sistema de archivos

   ```consola
   npx expo install expo-image-manipulator expo-file-system
   ```

3. Instalar dependecia para generar clave de envio:
   - El backend pide este codigo cuando se publica una receta, ya que servira para identificar la solicitud de publicacion en caso de posibles errores y asi no realizar duplicados de recetas publicadas.

   - ```consola
     npx expo install expo-crypto
     ```
