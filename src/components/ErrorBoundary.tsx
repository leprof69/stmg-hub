import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { error: Error | null };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("STMG HUB - erreur React:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: "100vh",
            padding: 24,
            background: "#0f172a",
            color: "#f8fafc",
            fontFamily: "system-ui, sans-serif",
            boxSizing: "border-box",
          }}
        >
          <h1 style={{ fontSize: "1.35rem", margin: "0 0 12px" }}>
            {"STMG HUB - erreur d'affichage"}
          </h1>
          <p style={{ margin: "0 0 16px", lineHeight: 1.5, color: "#cbd5e1" }}>
            {"L'application a plante au chargement. Ouvre la console (F12) pour le detail, ou reessaie ci-dessous."}
          </p>
          <pre
            style={{
              background: "#1e293b",
              padding: 12,
              borderRadius: 8,
              overflow: "auto",
              fontSize: "0.8rem",
              marginBottom: 16,
            }}
          >
            {this.state.error.message}
          </pre>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              border: "none",
              borderRadius: 10,
              padding: "12px 18px",
              fontWeight: 700,
              cursor: "pointer",
              background: "#3b82f6",
              color: "white",
            }}
          >
            Recharger la page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
