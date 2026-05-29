type AdminBtnProps = {
  children: React.ReactNode;
  onClick?: () => void;
  color: string;
  disabled?: boolean;
  small?: boolean;
};

export default function AdminBtn({ children, onClick, color, disabled = false, small = false }: AdminBtnProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled ? "#E5E7EB" : color,
        color: disabled ? "#9CA3AF" : "white",
        border: "none",
        fontFamily: "'Fredoka One', cursive",
        fontSize: small ? "0.85rem" : "1rem",
        padding: small ? "8px 16px" : "12px 24px",
        borderRadius: "14px",
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: disabled ? "none" : `0 4px 15px ${color}40`,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}
