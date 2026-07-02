// Capacitor (native app) tespiti; web'de her zaman false.
export function isApp(): boolean {
  return typeof window !== "undefined" && !!(window as unknown as { Capacitor?: unknown }).Capacitor;
}
