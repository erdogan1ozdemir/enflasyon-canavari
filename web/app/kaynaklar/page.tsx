import { redirect } from "next/navigation";

// Kaynaklar artık Profil içinde bir bölüm; eski bağlantıları yönlendir.
export default function KaynaklarPage() {
  redirect("/profil");
}
