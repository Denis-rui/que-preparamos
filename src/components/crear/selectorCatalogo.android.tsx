import { Spacing, TemaFormulario } from "@/constants/theme";
import { Host } from "@expo/ui";
import {
  DropdownMenuItem,
  ExposedDropdownMenu,
  ExposedDropdownMenuBox,
  Text as TextoNativo,
  TextField,
  type TextFieldRef,
} from "@expo/ui/jetpack-compose";
import {
  fillMaxWidth,
  menuAnchor,
  onVisibilityChanged,
} from "@expo/ui/jetpack-compose/modifiers";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { PropsSelectorCatalogo } from "./selectorCatalogo";

export default function SelectorCatalogo({
  etiqueta,
  placeholder,
  opciones,
  valorId,
  onSeleccionar,
  disabled,
}: PropsSelectorCatalogo) {
  const [expandido, setExpandido] = useState(false);
  const [visible, setVisible] = useState(false);
  const campo = useRef<TextFieldRef>(null);
  const habilitado = !disabled && opciones.length > 0;
  const textoSeleccionado =
    opciones.find((opcion) => opcion.id === valorId)?.nombre ?? placeholder;

  // El campo nativo es de solo lectura y recibe la etiqueta cuando está visible.
  useEffect(() => {
    if (visible) void campo.current?.setText(textoSeleccionado);
  }, [textoSeleccionado, visible]);

  const elegir = (id: number | null) => {
    onSeleccionar(id);
    setExpandido(false);
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <View style={styles.campo}>
        <Host
          matchContents
          style={styles.host}
          colorScheme="light"
          seedColor={TemaFormulario.colores.texto}
        >
          <ExposedDropdownMenuBox
            expanded={expandido && habilitado}
            onExpandedChange={habilitado ? setExpandido : undefined}
            modifiers={[fillMaxWidth()]}
          >
            <TextField
              ref={campo}
              readOnly
              singleLine
              enabled={habilitado}
              textStyle={{
                fontFamily: TemaFormulario.fuente,
                fontSize: TemaFormulario.tamanoCampo,
              }}
              colors={{
                focusedContainerColor: TemaFormulario.colores.campo,
                unfocusedContainerColor: TemaFormulario.colores.campo,
                disabledContainerColor: TemaFormulario.colores.campo,
                focusedTextColor: TemaFormulario.colores.texto,
                unfocusedTextColor: TemaFormulario.colores.texto,
                disabledTextColor: TemaFormulario.colores.secundario,
                focusedIndicatorColor: "transparent",
                unfocusedIndicatorColor: "transparent",
                disabledIndicatorColor: "transparent",
              }}
              modifiers={[
                fillMaxWidth(),
                menuAnchor("primaryNotEditable", habilitado),
                onVisibilityChanged(setVisible),
              ]}
            />
            <ExposedDropdownMenu
              expanded={expandido && habilitado}
              containerColor={TemaFormulario.colores.campo}
              onDismissRequest={() => setExpandido(false)}
            >
              {[{ id: 0, nombre: placeholder }, ...opciones].map((opcion) => (
                <DropdownMenuItem
                  key={opcion.id}
                  enabled={habilitado}
                  onClick={() => elegir(opcion.id === 0 ? null : opcion.id)}
                >
                  <DropdownMenuItem.Text>
                    <TextoNativo color={TemaFormulario.colores.texto}>
                      {opcion.nombre}
                    </TextoNativo>
                  </DropdownMenuItem.Text>
                </DropdownMenuItem>
              ))}
            </ExposedDropdownMenu>
          </ExposedDropdownMenuBox>
        </Host>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    marginBottom: Spacing.three,
    gap: Spacing.one,
  },
  etiqueta: {
    color: TemaFormulario.colores.texto,
    fontFamily: TemaFormulario.fuenteEtiqueta,
    fontSize: TemaFormulario.tamanoEtiqueta,
  },
  campo: {
    minHeight: TemaFormulario.altoCampo,
    justifyContent: "center",
    backgroundColor: TemaFormulario.colores.campo,
    borderWidth: 1,
    borderColor: TemaFormulario.colores.borde,
    borderRadius: TemaFormulario.radioCampo,
    overflow: "hidden",
  },
  host: {
    width: "100%",
  },
});
