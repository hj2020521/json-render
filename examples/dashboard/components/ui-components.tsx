'use client';

import React, { type ReactNode } from 'react';
import { type ComponentRenderProps } from '@json-render/react';
import { useData, useFieldValidation } from '@json-render/react';
import { getByPath } from '@json-render/core';

// Helper to get value from data model
function useResolvedValue<T>(value: T | { path: string } | null | undefined): T | undefined {
  const { data } = useData();
  
  if (value === null || value === undefined) {
    return undefined;
  }
  
  if (typeof value === 'object' && 'path' in value) {
    return getByPath(data, value.path) as T | undefined;
  }
  
  return value as T;
}

// Styles
const styles = {
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
  },
  cardHeader: {
    padding: '16px 20px',
    borderBottom: '1px solid #e5e7eb',
  },
  cardBody: (padding: string | null | undefined) => ({
    padding:
      padding === 'none' ? 0 :
      padding === 'sm' ? '12px' :
      padding === 'lg' ? '24px' : '16px',
  }),
  metric: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  metricLabel: {
    fontSize: '14px',
    color: '#6b7280',
  },
  metricValue: {
    fontSize: '32px',
    fontWeight: 600,
    color: '#111827',
  },
  metricTrend: (trend: string | null | undefined) => ({
    fontSize: '14px',
    color: trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#6b7280',
  }),
};

// Card component
export function Card({ element, children }: ComponentRenderProps) {
  const { title, description, padding } = element.props as {
    title?: string | null;
    description?: string | null;
    padding?: string | null;
  };

  return (
    <div style={styles.card}>
      {(title || description) && (
        <div style={styles.cardHeader}>
          {title && (
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{title}</h3>
          )}
          {description && (
            <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#6b7280' }}>
              {description}
            </p>
          )}
        </div>
      )}
      <div style={styles.cardBody(padding)}>{children}</div>
    </div>
  );
}

// Heading component
export function Heading({ element }: ComponentRenderProps) {
  const { text, level } = element.props as {
    text: string;
    level?: string | null;
  };

  const Tag = (level || 'h2') as keyof React.JSX.IntrinsicElements;
  const sizes: Record<string, string> = {
    h1: '28px',
    h2: '24px',
    h3: '20px',
    h4: '16px',
  };

  return (
    <Tag style={{ margin: '0 0 16px', fontSize: sizes[level || 'h2'], fontWeight: 600 }}>
      {text}
    </Tag>
  );
}

// Text component
export function Text({ element }: ComponentRenderProps) {
  const { content, variant } = element.props as {
    content: string;
    variant?: string | null;
  };

  const colors: Record<string, string> = {
    default: '#111827',
    muted: '#6b7280',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  };

  return (
    <p style={{ margin: 0, color: colors[variant || 'default'] }}>{content}</p>
  );
}

// Metric component
export function Metric({ element }: ComponentRenderProps) {
  const { label, valuePath, format, trend, trendValue } = element.props as {
    label: string;
    valuePath: string;
    format?: string | null;
    trend?: string | null;
    trendValue?: string | null;
  };

  const { data } = useData();
  const rawValue = getByPath(data, valuePath);

  let displayValue = String(rawValue ?? '—');
  if (format === 'currency' && typeof rawValue === 'number') {
    displayValue = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(rawValue);
  } else if (format === 'percent' && typeof rawValue === 'number') {
    displayValue = new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
    }).format(rawValue);
  } else if (format === 'number' && typeof rawValue === 'number') {
    displayValue = new Intl.NumberFormat('en-US').format(rawValue);
  }

  return (
    <div style={styles.metric}>
      <span style={styles.metricLabel}>{label}</span>
      <span style={styles.metricValue}>{displayValue}</span>
      {(trend || trendValue) && (
        <span style={styles.metricTrend(trend)}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''} {trendValue}
        </span>
      )}
    </div>
  );
}

// Chart component (simplified placeholder)
export function Chart({ element }: ComponentRenderProps) {
  const { title, dataPath, type } = element.props as {
    title?: string | null;
    dataPath: string;
    type?: string | null;
  };

  const { data } = useData();
  const chartData = getByPath(data, dataPath) as Array<{ label: string; value: number }> | undefined;

  if (!chartData || !Array.isArray(chartData)) {
    return <div style={{ padding: '20px', color: '#6b7280' }}>No chart data</div>;
  }

  const maxValue = Math.max(...chartData.map((d) => d.value));

  return (
    <div>
      {title && (
        <h4 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 600 }}>{title}</h4>
      )}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '120px' }}>
        {chartData.map((d, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <div
              style={{
                width: '100%',
                height: `${(d.value / maxValue) * 100}%`,
                backgroundColor: '#6366f1',
                borderRadius: '4px 4px 0 0',
                minHeight: '4px',
              }}
            />
            <span style={{ fontSize: '12px', color: '#6b7280' }}>{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Table component
export function Table({ element }: ComponentRenderProps) {
  const { title, dataPath, columns } = element.props as {
    title?: string | null;
    dataPath: string;
    columns: Array<{ key: string; label: string; format?: string | null }>;
  };

  const { data } = useData();
  const tableData = getByPath(data, dataPath) as Array<Record<string, unknown>> | undefined;

  if (!tableData || !Array.isArray(tableData)) {
    return <div style={{ padding: '20px', color: '#6b7280' }}>No data</div>;
  }

  const formatCell = (value: unknown, format?: string | null) => {
    if (value === null || value === undefined) return '—';
    if (format === 'currency' && typeof value === 'number') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    }
    if (format === 'date' && typeof value === 'string') {
      return new Date(value).toLocaleDateString();
    }
    if (format === 'badge') {
      const colors: Record<string, { bg: string; text: string }> = {
        completed: { bg: '#d1fae5', text: '#065f46' },
        pending: { bg: '#fef3c7', text: '#92400e' },
        failed: { bg: '#fee2e2', text: '#991b1b' },
      };
      const style = colors[String(value).toLowerCase()] || { bg: '#f3f4f6', text: '#374151' };
      return (
        <span
          style={{
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 500,
            backgroundColor: style.bg,
            color: style.text,
          }}
        >
          {String(value)}
        </span>
      );
    }
    return String(value);
  };

  return (
    <div>
      {title && (
        <h4 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 600 }}>{title}</h4>
      )}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  textAlign: 'left',
                  padding: '12px 8px',
                  borderBottom: '1px solid #e5e7eb',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#6b7280',
                  textTransform: 'uppercase',
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td
                  key={col.key}
                  style={{
                    padding: '12px 8px',
                    borderBottom: '1px solid #e5e7eb',
                    fontSize: '14px',
                  }}
                >
                  {formatCell(row[col.key], col.format)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Button component
export function Button({ element, onAction, loading }: ComponentRenderProps) {
  const { label, variant, action, disabled } = element.props as {
    label: string;
    variant?: string | null;
    action: { name: string };
    disabled?: boolean | null;
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: { backgroundColor: '#6366f1', color: '#fff', border: 'none' },
    secondary: { backgroundColor: '#fff', color: '#374151', border: '1px solid #d1d5db' },
    danger: { backgroundColor: '#dc2626', color: '#fff', border: 'none' },
    ghost: { backgroundColor: 'transparent', color: '#6b7280', border: 'none' },
  };

  const handleClick = () => {
    if (!disabled && action && onAction) {
      onAction(action);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={!!disabled || loading}
      style={{
        padding: '8px 16px',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        ...variants[variant || 'primary'],
      }}
    >
      {loading ? 'Loading...' : label}
    </button>
  );
}

// Alert component
export function Alert({ element }: ComponentRenderProps) {
  const { message, variant, dismissible } = element.props as {
    message: string | { path: string };
    variant?: string | null;
    dismissible?: boolean | null;
  };

  const resolvedMessage = useResolvedValue(message);

  const defaultStyle = { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af' };
  const variants: Record<string, { bg: string; border: string; text: string }> = {
    info: defaultStyle,
    success: { bg: '#d1fae5', border: '#a7f3d0', text: '#065f46' },
    warning: { bg: '#fef3c7', border: '#fcd34d', text: '#92400e' },
    error: { bg: '#fee2e2', border: '#fca5a5', text: '#991b1b' },
  };

  const style = variants[variant || 'info'] ?? defaultStyle;

  return (
    <div
      style={{
        padding: '12px 16px',
        borderRadius: '8px',
        backgroundColor: style.bg,
        border: `1px solid ${style.border}`,
        color: style.text,
        fontSize: '14px',
      }}
    >
      {resolvedMessage}
    </div>
  );
}

// Grid component
export function Grid({ element, children }: ComponentRenderProps) {
  const { columns, gap } = element.props as {
    columns?: number | null;
    gap?: string | null;
  };

  const gaps: Record<string, string> = {
    none: '0',
    sm: '8px',
    md: '16px',
    lg: '24px',
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns || 2}, 1fr)`,
        gap: gaps[gap || 'md'],
      }}
    >
      {children}
    </div>
  );
}

// Stack component
export function Stack({ element, children }: ComponentRenderProps) {
  const { direction, gap, align } = element.props as {
    direction?: string | null;
    gap?: string | null;
    align?: string | null;
  };

  const gaps: Record<string, string> = {
    none: '0',
    sm: '8px',
    md: '16px',
    lg: '24px',
  };

  const alignments: Record<string, string> = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: 'stretch',
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: direction === 'horizontal' ? 'row' : 'column',
        gap: gaps[gap || 'md'],
        alignItems: alignments[align || 'stretch'],
      }}
    >
      {children}
    </div>
  );
}

// Divider component
export function Divider({ element }: ComponentRenderProps) {
  const { orientation } = element.props as {
    orientation?: string | null;
  };

  if (orientation === 'vertical') {
    return (
      <div
        style={{
          width: '1px',
          backgroundColor: '#e5e7eb',
          alignSelf: 'stretch',
        }}
      />
    );
  }

  return (
    <hr
      style={{
        border: 'none',
        borderTop: '1px solid #e5e7eb',
        margin: '16px 0',
      }}
    />
  );
}

// Badge component
export function Badge({ element }: ComponentRenderProps) {
  const { text, variant } = element.props as {
    text: string | { path: string };
    variant?: string | null;
  };

  const resolvedText = useResolvedValue(text);

  const defaultBadgeStyle = { bg: '#f3f4f6', text: '#374151' };
  const variants: Record<string, { bg: string; text: string }> = {
    default: defaultBadgeStyle,
    success: { bg: '#d1fae5', text: '#065f46' },
    warning: { bg: '#fef3c7', text: '#92400e' },
    error: { bg: '#fee2e2', text: '#991b1b' },
    info: { bg: '#dbeafe', text: '#1e40af' },
  };

  const style = variants[variant || 'default'] ?? defaultBadgeStyle;

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 500,
        backgroundColor: style.bg,
        color: style.text,
      }}
    >
      {resolvedText}
    </span>
  );
}

// TextField component
export function TextField({ element }: ComponentRenderProps) {
  const { label, valuePath, placeholder, type, checks, validateOn } = element.props as {
    label: string;
    valuePath: string;
    placeholder?: string | null;
    type?: string | null;
    checks?: Array<{ fn: string; message: string }> | null;
    validateOn?: string | null;
  };

  const { data, set } = useData();
  const value = getByPath(data, valuePath) as string | undefined;
  
  const { errors, validate, touch } = useFieldValidation(valuePath, {
    checks: checks ?? undefined,
    validateOn: (validateOn as 'change' | 'blur' | 'submit') ?? 'blur',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    set(valuePath, e.target.value);
    if (validateOn === 'change') {
      validate();
    }
  };

  const handleBlur = () => {
    touch();
    if (validateOn === 'blur' || !validateOn) {
      validate();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>
        {label}
      </label>
      <input
        type={type || 'text'}
        value={value ?? ''}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder ?? ''}
        style={{
          padding: '8px 12px',
          borderRadius: '6px',
          border: errors.length > 0 ? '1px solid #ef4444' : '1px solid #d1d5db',
          fontSize: '14px',
          outline: 'none',
        }}
      />
      {errors.map((error, i) => (
        <span key={i} style={{ fontSize: '12px', color: '#ef4444' }}>
          {error}
        </span>
      ))}
    </div>
  );
}

// Select component
export function Select({ element }: ComponentRenderProps) {
  const { label, valuePath, options, placeholder } = element.props as {
    label: string;
    valuePath: string;
    options: Array<{ value: string; label: string }>;
    placeholder?: string | null;
  };

  const { data, set } = useData();
  const value = getByPath(data, valuePath) as string | undefined;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>
        {label}
      </label>
      <select
        value={value ?? ''}
        onChange={(e) => set(valuePath, e.target.value)}
        style={{
          padding: '8px 12px',
          borderRadius: '6px',
          border: '1px solid #d1d5db',
          fontSize: '14px',
          outline: 'none',
          backgroundColor: '#fff',
        }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// DatePicker component (simplified)
export function DatePicker({ element }: ComponentRenderProps) {
  const { label, valuePath } = element.props as {
    label: string;
    valuePath: string;
  };

  const { data, set } = useData();
  const value = getByPath(data, valuePath) as string | undefined;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>
        {label}
      </label>
      <input
        type="date"
        value={value ?? ''}
        onChange={(e) => set(valuePath, e.target.value)}
        style={{
          padding: '8px 12px',
          borderRadius: '6px',
          border: '1px solid #d1d5db',
          fontSize: '14px',
          outline: 'none',
        }}
      />
    </div>
  );
}

// Empty component
export function Empty({ element }: ComponentRenderProps) {
  const { icon, title, description } = element.props as {
    icon?: string | null;
    title: string;
    description?: string | null;
  };

  return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      {icon && <div style={{ fontSize: '48px', marginBottom: '16px' }}>{icon}</div>}
      <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 600, color: '#111827' }}>
        {title}
      </h3>
      {description && (
        <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>{description}</p>
      )}
    </div>
  );
}

// List component
export function List({ element, children }: ComponentRenderProps) {
  const { dataPath } = element.props as {
    dataPath: string;
    itemKey?: string | null;
  };

  const { data } = useData();
  const listData = getByPath(data, dataPath) as Array<unknown> | undefined;

  if (!listData || !Array.isArray(listData)) {
    return <div style={{ color: '#6b7280' }}>No items</div>;
  }

  // For now, just render children
  // In a full implementation, children would be cloned for each item
  return <div>{children}</div>;
}

// Export all components as a registry
export const componentRegistry = {
  Card,
  Heading,
  Text,
  Metric,
  Chart,
  Table,
  Button,
  Alert,
  Grid,
  Stack,
  Divider,
  Badge,
  TextField,
  Select,
  DatePicker,
  Empty,
  List,
};
