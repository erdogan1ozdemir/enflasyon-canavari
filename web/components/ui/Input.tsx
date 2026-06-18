'use client';

import React from 'react';

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  /** Leading icon node (e.g. a search glyph). */
  icon?: React.ReactNode;
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
  /** Style for the outer wrapper. */
  wrapStyle?: React.CSSProperties;
};

export default function Input({
  icon = null,
  size = 'md',
  type = 'text',
  disabled = false,
  style,
  wrapStyle,
  ...rest
}: InputProps) {
  const h = size === 'sm' ? 38 : size === 'lg' ? 52 : 44;
  const [focused, setFocused] = React.useState(false);

  return (
    <div
      className="ec-input"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        height: h,
        padding: `0 14px`,
        background: 'var(--surface-card)',
        border: `1px solid ${focused ? 'var(--border-focus)' : 'var(--border-strong)'}`,
        borderRadius: 'var(--radius-md)',
        boxShadow: focused ? 'var(--shadow-focus)' : 'none',
        transition:
          'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
        opacity: disabled ? 0.5 : 1,
        ...wrapStyle,
      }}
    >
      {icon ? (
        <span style={{ display: 'inline-flex', color: 'var(--text-muted)', flexShrink: 0 }}>
          {icon}
        </span>
      ) : null}
      <input
        type={type}
        disabled={disabled}
        onFocus={(e) => {
          setFocused(true);
          rest.onFocus && rest.onFocus(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          rest.onBlur && rest.onBlur(e);
        }}
        {...rest}
        style={{
          flex: 1,
          minWidth: 0,
          border: 'none',
          outline: 'none',
          background: 'transparent',
          fontFamily: 'var(--font-sans)',
          fontSize: size === 'sm' ? 14 : 15,
          color: 'var(--text-strong)',
          ...style,
        }}
      />
    </div>
  );
}
