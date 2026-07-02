import SubPageShell from "@/components/SubPageShell";
import BilgilerimScreen from "@/components/screens/BilgilerimScreen";

export const metadata = {
  title: "Bilgilerim — Enflasyon Canavarı",
};

export default function BilgilerimPage() {
  return (
    <SubPageShell title="Bilgilerim">
      <BilgilerimScreen />
    </SubPageShell>
  );
}
