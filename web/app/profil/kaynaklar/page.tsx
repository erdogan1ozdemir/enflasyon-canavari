import { loadSources } from "@ec/data";
import SubPageShell from "@/components/SubPageShell";
import SourcesScreen from "@/components/screens/SourcesScreen";

export const metadata = {
  title: "Kaynaklar — Enflasyon Canavarı",
  description: "Veri kaynakları ve metodoloji.",
};

export default function KaynaklarPage() {
  const sources = loadSources();
  return (
    <SubPageShell title="Kaynaklar">
      <SourcesScreen sources={sources} />
    </SubPageShell>
  );
}
