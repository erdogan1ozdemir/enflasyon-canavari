import { loadSources } from "@ec/data";
import SourcesScreen from "@/components/screens/SourcesScreen";

export const metadata = {
  title: "Kaynaklar ve metodoloji — Enflasyon Canavarı",
  description:
    "Her fiyatın kaynağı ve metodolojisi. TÜİK, TCMB, EPDK ve diğer resmi verilerin açıklandığı sayfa.",
};

export default function KaynakPage() {
  const sources = loadSources();
  return <SourcesScreen sources={sources} />;
}
