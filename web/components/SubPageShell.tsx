"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";

export default function SubPageShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const router = useRouter();

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "10px 10px 4px",
        }}
      >
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Geri"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 44,
            minHeight: 44,
            background: "transparent",
            border: "none",
            color: "var(--text-body)",
            cursor: "pointer",
          }}
        >
          <Icon name="arrowLeft" size={20} />
        </button>
        <span
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: "var(--text-strong)",
          }}
        >
          {title}
        </span>
      </div>
      <div style={{ padding: 18 }}>{children}</div>
    </>
  );
}
