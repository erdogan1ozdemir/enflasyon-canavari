'use client';

import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Visual style. @default "primary" */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
  /** Leading icon node (e.g. a Lucide SVG). */
  icon?: React.ReactNode;
  /** Trailing icon node. */
  iconRight?: React.ReactNode;
  /** Stretch to container width. @default false */
  fullWidth?: boolean;
  children?: React.ReactNode;
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon = null,
  iconRight = null,
  fullWidth = false,
  disabled = false,
  type = 'button',
  onClick,
  style,
  ...rest
}: ButtonProps) {
  const sizes = {
    sm: { h: 34, px: 12, fs: 13, gap: 6 },
    md: { h: 44, px: 18, fs: 15, gap: 8 },
    lg: { h: 52, px: 24, fs: 16, gap: 9 },
  };
  const s = sizes[size] || sizes.md;

  const variants = {
    primary: {
      background: 'var(--accent)',
      color: 'var(--text-on-accent)',
      border: '1px solid transparent',
    },
    secondary: {
      background: 'var(--surface-card)',
      color: 'var(--text-strong)',
      border: '1px solid var(--border-strong)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--accent-text)',
      border: '1px solid transparent',
    },
    danger: {
      background: 'var(--red-500)',
      color: '#fff',
      border: '1px solid transparent',
    },
  };
  const v = variants[variant] || variants.primary;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      data-variant={variant}
      className="ec-button"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: s.gap,
        height: s.h,
        minWidth: s.h,
        padding: `0 ${s.px}px`,
        fontFamily: 'var(--font-sans)',
        fontSize: s.fs,
        fontWeight: 600,
        letterSpacing: '-0.01em',
        lineHeight: 1,
        borderRadius: 'var(--radius-pill)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        width: fullWidth ? '100%' : undefined,
        transition:
          'background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out), filter var(--dur-fast) var(--ease-out)',
        WebkitTapHighlightColor: 'transparent',
        ...v,
        ...style,
      }}
      onMouseDown={(e) => {
        if (!disabled) e.currentTarget.style.transform = 'scale(0.97)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
      {...rest}
    >
      {icon ? (
        <span style={{ display: 'inline-flex', flexShrink: 0 }}>{icon}</span>
      ) : null}
      {children}
      {iconRight ? (
        <span style={{ display: 'inline-flex', flexShrink: 0 }}>{iconRight}</span>
      ) : null}
    </button>
  );
}
