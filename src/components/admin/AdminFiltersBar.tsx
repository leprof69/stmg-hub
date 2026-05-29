import { useAdmin } from "./AdminContext";

export default function AdminFiltersBar() {
  const a = useAdmin();
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
      <input
        value={a.rechercheEleve}
        onChange={(e) => a.setRechercheEleve(e.target.value)}
        placeholder={"\u00c9l\u00e8ve : pr\u00e9nom ou e-mail\u2026"}
        style={{
          minWidth: 220,
          flex: 1,
          padding: "9px 12px",
          borderRadius: 10,
          border: "1px solid #CBD5E1",
          fontSize: "0.9rem",
        }}
      />
      <select
        value={a.filtreClasse}
        onChange={(e) => a.setFiltreClasse(e.target.value)}
        style={{ padding: "9px 10px", borderRadius: 10, border: "1px solid #CBD5E1", fontSize: "0.88rem" }}
      >
        <option value="toutes">Toutes les classes</option>
        {a.classesDispo.map((c) => (
          <option key={c} value={c}>
            {c === "premiere" ? "Premi\u00e8re STMG" : c === "terminale" ? "Terminale STMG" : c}
          </option>
        ))}
      </select>
      <select
        value={a.filtreLycee}
        onChange={(e) => a.setFiltreLycee(e.target.value)}
        style={{
          padding: "9px 10px",
          borderRadius: 10,
          border: "1px solid #CBD5E1",
          fontSize: "0.88rem",
          maxWidth: 260,
        }}
      >
        <option value="tous">Tous les lyc\u00e9es</option>
        {a.lyceesDispo.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>
      <select
        value={a.filtreActivite}
        onChange={(e) => a.setFiltreActivite(e.target.value)}
        style={{ padding: "9px 10px", borderRadius: 10, border: "1px solid #CBD5E1", fontSize: "0.88rem" }}
      >
        <option value="tous">Toutes activit\u00e9s</option>
        <option value="aujourdhui">Actifs aujourd&apos;hui</option>
        <option value="7jours">Actifs 7 jours</option>
        <option value="inactifs">Inactifs +7 jours</option>
        <option value="focus">Ont fait Focus</option>
        <option value="pas_focus">N&apos;ont pas fait Focus</option>
        <option value="sdgn">Au moins une mission SDGN</option>
        <option value="participation">Participation cartes (&ge; 1 pt)</option>
        <option value="sans_participation">Sans participation (0 pt)</option>
        <option value="jetons_suspendus">Jetons suspendus (anti-triche)</option>
      </select>
    </div>
  );
}
