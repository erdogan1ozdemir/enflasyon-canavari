import { flags } from "@/config/flags";

export function AdSlot({ id }: { id: string }) {
  if (!flags.ads.enabled) return null;
  return (
    <div data-ad-slot={id} className="my-4 flex min-h-[90px] items-center justify-center rounded-lg border border-dashed text-sm text-neutral-400">
      reklam alanı
    </div>
  );
}
