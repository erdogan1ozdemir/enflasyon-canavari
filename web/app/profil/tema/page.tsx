import Card from "@/components/ui/Card";
import SubPageShell from "@/components/SubPageShell";
import { ThemeSetting } from "@/components/ThemeSetting";

export const metadata = {
  title: "Tema — Enflasyon Canavarı",
};

export default function TemaPage() {
  return (
    <SubPageShell title="Tema">
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: "var(--text-body)" }}>
          Uygulamanın görünümünü seç.
        </p>
        <Card padding="md">
          <ThemeSetting />
        </Card>
      </div>
    </SubPageShell>
  );
}
