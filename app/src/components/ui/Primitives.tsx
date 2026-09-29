import type { ButtonHTMLAttributes, CSSProperties, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

type Variante = "primary" | "secondary" | "danger" | "ghost";

const VARIANTES: Record<Variante, string> = {
  primary: "bg-moss-600 text-white hover:bg-moss-700",
  secondary: "bg-transparent text-ink border border-line hover:border-ink-faint hover:bg-white",
  danger: "bg-transparent text-terracotta-600 border border-terracotta-200 hover:bg-terracotta-50",
  ghost: "bg-transparent text-ink-soft hover:text-ink hover:bg-white",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variante }) {
  return (
    <button
      className={`px-4 py-2 rounded-md font-medium text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${VARIANTES[variant]} ${className}`}
      {...props}
    />
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-moss-400 focus:ring-1 focus:ring-moss-400 transition-colors ${props.className ?? ""}`}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-moss-400 focus:ring-1 focus:ring-moss-400 transition-colors ${props.className ?? ""}`}
    />
  );
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-moss-400 focus:ring-1 focus:ring-moss-400 transition-colors ${props.className ?? ""}`}
    />
  );
}

export function Label({ children }: { children: ReactNode }) {
  return <label className="block text-xs font-medium text-ink-soft mb-1.5 tracking-wide">{children}</label>;
}

export function Card({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`bg-surface rounded-lg border border-line p-6 ${className}`} style={style}>
      {children}
    </div>
  );
}

export function SectionTitle({ children, subtitle }: { children: ReactNode; subtitle?: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-base font-semibold text-ink tracking-tight">{children}</h2>
      {subtitle && <p className="text-sm text-ink-soft mt-1 leading-relaxed">{subtitle}</p>}
    </div>
  );
}

export function InfoBox({ children, tono = "info" }: { children: ReactNode; tono?: "info" | "warning" }) {
  const estilos = tono === "warning" ? "bg-kaki-50 border-kaki-200 text-kaki-700" : "bg-ai-50 border-ai-200 text-ai-700";
  return <div className={`rounded-md border px-4 py-3 text-sm leading-relaxed ${estilos}`}>{children}</div>;
}
