// Cihazda saklanan kullanıcı profili (hesap yok; yalnızca localStorage).
// Web'de de çalışır ama form yalnız app'te gösterilir (bkz. platform.ts).

export interface Profil {
  adSoyad?: string;
  maas?: number;
}

const KEY = "ec_profil";

export function getProfil(): Profil {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "{}") as Profil;
  } catch {
    return {};
  }
}

export function setProfil(p: Profil): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(p));
}

export function clearProfil(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
