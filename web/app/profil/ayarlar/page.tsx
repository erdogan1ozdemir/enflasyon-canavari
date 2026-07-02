import SubPageShell from "@/components/SubPageShell";
import SettingsScreen from "@/components/screens/SettingsScreen";

export const metadata = {
  title: "Ayarlar — Enflasyon Canavarı",
};

export default function AyarlarPage() {
  return (
    <SubPageShell title="Ayarlar">
      <SettingsScreen />
    </SubPageShell>
  );
}
