import type {
  CSSProperties,
  ClipboardEventHandler,
  DragEventHandler,
  KeyboardEvent,
  KeyboardEventHandler,
  MouseEventHandler,
  TextareaHTMLAttributes,
} from "react";

type ProtectedTextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "style"> & {
  style?: CSSProperties;
  enableProtection?: boolean;
  onBlockedAction?: () => void;
};

function shouldBlockShortcut(e: KeyboardEvent<HTMLTextAreaElement>) {
  const key = String(e.key || "").toLowerCase();
  if ((e.ctrlKey || e.metaKey) && (key === "v" || key === "c" || key === "x" || key === "insert")) return true;
  if (e.shiftKey && key === "insert") return true;
  return false;
}

export default function ProtectedTextarea({
  enableProtection = true,
  onBlockedAction,
  onPaste,
  onCopy,
  onCut,
  onDrop,
  onContextMenu,
  onKeyDown,
  ...rest
}: ProtectedTextareaProps) {
  const block = () => {
    if (onBlockedAction) onBlockedAction();
  };

  const handlePaste: ClipboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (enableProtection) {
      e.preventDefault();
      block();
    }
    if (onPaste) onPaste(e);
  };

  const handleCopy: ClipboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (enableProtection) {
      e.preventDefault();
      block();
    }
    if (onCopy) onCopy(e);
  };

  const handleCut: ClipboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (enableProtection) {
      e.preventDefault();
      block();
    }
    if (onCut) onCut(e);
  };

  const handleDrop: DragEventHandler<HTMLTextAreaElement> = (e) => {
    if (enableProtection) {
      e.preventDefault();
      block();
    }
    if (onDrop) onDrop(e);
  };

  const handleContextMenu: MouseEventHandler<HTMLTextAreaElement> = (e) => {
    if (enableProtection) {
      e.preventDefault();
      block();
    }
    if (onContextMenu) onContextMenu(e);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (enableProtection && shouldBlockShortcut(e)) {
      e.preventDefault();
      block();
    }
    if (onKeyDown) onKeyDown(e);
  };

  return (
    <textarea
      {...rest}
      onPaste={handlePaste}
      onCopy={handleCopy}
      onCut={handleCut}
      onDrop={handleDrop}
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
    />
  );
}
