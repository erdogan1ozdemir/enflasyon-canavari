'use client';

import React from 'react';

type CardProps = React.HTMLAttributes<HTMLElement> & {
  /** Inner padding. @default "md" */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Adds hover lift for clickable cards. @default false */
  interactive?: boolean;
  /** Element/tag to render. @default "div" */
  as?: keyof React.JSX.IntrinsicElements;
  children?: React.ReactNode;
};

export default function Card({
  children,
  padding = 'md',
  interactive = false,
  as = 'div',
  style,
  ...rest
}: CardProps) {
  const pads: Record<string, number> = { none: 0, sm: 14, md: 20, lg: 28 };
  const p = pads[padding] ?? pads.md;
  const Tag = as as React.ElementType;

  return (
    <Tag
      className="ec-card"
      style={{
        background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: p,
        boxShadow: 'var(--shadow-sm)',
        transition:
          'transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out)',
        cursor: interactive ? 'pointer' : undefined,
        ...style,
      }}
      onMouseEnter={
        interactive
          ? (e: React.MouseEvent<HTMLElement>) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              e.currentTarget.style.borderColor = 'var(--border-strong)';
            }
          : undefined
      }
      onMouseLeave={
        interactive
          ? (e: React.MouseEvent<HTMLElement>) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
            }
          : undefined
      }
      {...rest}
    >
      {children}
    </Tag>
  );
}
