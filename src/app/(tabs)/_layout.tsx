import AppTabs from "@/components/app-tabs";
import { ProtectorSalidaProvider } from "@/components/crear/protectorSalida";

export default function TabsLayout() {
  return (
    <ProtectorSalidaProvider>
      <AppTabs />
    </ProtectorSalidaProvider>
  );
}
