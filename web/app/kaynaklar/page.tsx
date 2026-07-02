import { redirect } from "next/navigation";

// Kaynaklar artık Profil içinde bir alt sayfa; eski bağlantıları yönlendir.
export default function KaynaklarPage() {
  redirect("/profil/kaynaklar");
}
