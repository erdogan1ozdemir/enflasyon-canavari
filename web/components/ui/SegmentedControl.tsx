'use client';

import React from 'react';

type SegmentOption = {
  value: string;
  label: React.ReactNode;
};

type SegmentedControlProps = {
  /** Options as strings or {value,label} objects. */
  options: (string | SegmentOption)[];
  /** Currently selected value. */
  value: string;
  onChange?: (value: string) => void;
  /** @default "md" */
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
};

export default function SegmentedControl({
  options = [],
  value,
  onChange,
  size = 'md',
  style,
  ...rest
}: SegmentedControlProps) {
  const h = size === 'sm' ? 32 : 40;
  const fs = size === 'sm' ? 12 : 13;

  return (
    <div
      className="ec-segmented"
      role="tablist"
      style={{
        display: 'inline-flex',
        gap: 2,
        padding: 3,
        height: h,
        background: 'var(--surface-inset)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-pill)',
        ...style,
      }}
      {...rest}
    >
      {options.map((opt) => {
        const v = typeof opt === 'string' ? opt : opt.value;
        const label = typeof opt === 'string' ? opt : opt.label;
        const active = v === value;
        return (
          <button
            key={v}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange && onChange(v)}
            style={{
              border: 'none',
              cursor: 'pointer',
              padding: '0 14px',
              height: '100%',
              borderRadius: 'var(--radius-pill)',
              fontFamily: 'var(--font-sans)',
              fontSize: fs,
              fontWeight: 600,
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
              background: active ? 'var(--surface-card)' : 'transparent',
              color: active ? 'var(--text-strong)' : 'var(--text-muted)',
              boxShadow: active ? 'var(--shadow-xs)' : 'none',
              transition:
                'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)',
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
