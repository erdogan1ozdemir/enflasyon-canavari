import Card from "@/components/ui/Card";
import SubPageShell from "@/components/SubPageShell";

export const metadata = {
  title: "Hakkında — Enflasyon Canavarı",
};

export default function HakkindaPage() {
  return (
    <SubPageShell title="Hakkında">
      <Card padding="md">
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--text-body)" }}>
          Enflasyon Canavarı, Türkiye&apos;de paranın zaman içinde eriyişini somut, kaynaklı
          sayılarla gösterir. 2005&apos;ten bugüne fiyatları karşılaştır, satın alma gücünü ölç,
          sonucu paylaş. Tüm değerler resmi/güvenilir kaynaklardan derlenir; her sayının yanında
          kaynağı belirtilir.
        </p>
      </Card>
    </SubPageShell>
  );
}
