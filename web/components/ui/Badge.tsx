import React from 'react';

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  /** Color tone. @default "neutral" */
  tone?: 'neutral' | 'coral' | 'teal' | 'success' | 'warning' | 'danger';
  /** Prepend a status dot. @default false */
  dot?: boolean;
  /** @default "md" */
  size?: 'sm' | 'md';
  children?: React.ReactNode;
};

export default function Badge({
  children,
  tone = 'neutral',
  dot = false,
  size = 'md',
  style,
  ...rest
}: BadgeProps) {
  const tones = {
    neutral: { bg: 'var(--bg-subtle)', fg: 'var(--text-body)', bd: 'var(--border-subtle)' },
    coral: {
      bg: 'var(--accent-tint)',
      fg: 'var(--accent-text)',
      bd: 'color-mix(in oklch, var(--accent) 22%, transparent)',
    },
    teal: {
      bg: 'var(--trust-tint)',
      fg: 'var(--trust-text)',
      bd: 'color-mix(in oklch, var(--trust) 22%, transparent)',
    },
    success: {
      bg: 'var(--green-50)',
      fg: 'var(--green-500)',
      bd: 'color-mix(in oklch, var(--green-500) 28%, transparent)',
    },
    warning: {
      bg: 'var(--amber-50)',
      fg: 'var(--amber-500)',
      bd: 'color-mix(in oklch, var(--amber-500) 30%, transparent)',
    },
    danger: {
      bg: 'var(--red-50)',
      fg: 'var(--red-500)',
      bd: 'color-mix(in oklch, var(--red-500) 28%, transparent)',
    },
  };
  const t = tones[tone] || tones.neutral;
  const h = size === 'sm' ? 22 : 26;
  const fs = size === 'sm' ? 11 : 12;

  return (
    <span
      className="ec-badge"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: h,
        padding: `0 ${size === 'sm' ? 8 : 10}px`,
        borderRadius: 'var(--radius-pill)',
        fontFamily: 'var(--font-sans)',
        fontSize: fs,
        fontWeight: 500,
        lineHeight: 1,
        whiteSpace: 'nowrap',
        background: t.bg,
        color: t.fg,
        border: `1px solid ${t.bd}`,
        ...style,
      }}
      {...rest}
    >
      {dot ? (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'currentColor',
            flexShrink: 0,
          }}
        />
      ) : null}
      {children}
    </span>
  );
}
