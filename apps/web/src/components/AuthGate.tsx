import { BrandMark } from "@/components/BrandMark";

export function AuthGate({
  title,
  body,
  error,
  actionLabel,
  onAction,
  actionDisabled,
  secondaryLabel,
  onSecondary,
}: {
  title: string;
  body: string;
  error?: string | null;
  actionLabel?: string;
  onAction?: () => void;
  actionDisabled?: boolean;
  secondaryLabel?: string;
  onSecondary?: () => void;
}) {
  return (
    <div className="auth-gate">
      <div className="auth-sheet">
        <BrandMark />
        <h1 className="auth-sheet__title">{title}</h1>
        <p className="auth-sheet__body">{body}</p>
        {error ? <p className="auth-sheet__error">{error}</p> : null}
        {actionLabel && onAction ? (
          <button type="button" className="btn btn-quiet" onClick={onAction} disabled={actionDisabled}>
            {actionLabel}
          </button>
        ) : null}
        {secondaryLabel && onSecondary ? (
          <button type="button" className="btn-text flare auth-sheet__secondary" onClick={onSecondary}>
            {secondaryLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
