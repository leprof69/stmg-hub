import { useState } from "react";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import * as XLSX from "xlsx";

export default function Admin() {
  const [onglet, setOnglet] = useState("chapitres");
  const [chapitres, setChapitres] = useState([]);
  const [importing, setImporting] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [erreur, setErreur] = useState("");

  const lireExcel = (e) => {
    const fichier = e.target.files[0];
    if (!fichier) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);

      const chapitresParsed = rows.map((row) => ({
        id: String(row["ID"] || ""),
        matiere: String(row["Matière"] || ""),
        classe: String(row["Classe"] || ""),
        ordre: Number(row["Ordre"] || 0),
        theme: String(row["Thème"] || ""),
        titre: String(row["Titre du chapitre"] || ""),
        question: String(row["Question de gestion"] || ""),
        notions: String(row["Notions (séparées par |)"] || "").split("|").map(n => n.trim()).filter(Boolean),
        competences: String(row["Compétences (séparées par |)"] || "").split("|").map(c => c.trim()).filter(Boolean),
        url_app: String(row["URL Application"] || ""),
        url_fiche: String(row["URL Fiche de révision"] || ""),
        xp: Number(row["XP"] || 50),
      }));

      setChapitres(chapitresParsed);
      setDone(false);
      setProgress(0);
      setErreur("");
    };
    reader.readAsArrayBuffer(fichier);
  };

  const importerChapitres = async () => {
    if (chapitres.length === 0) {
      setErreur("Charge d'abord un fichier Excel !");
      return;
    }
    setImporting(true);
    setDone(false);
    setErreur("");

    for (let i = 0; i < chapitres.length; i++) {
      const chap = chapitres[i];
      if (!chap.id) continue;
      await setDoc(doc(db, "chapitres", chap.id), {
        matiere: chap.matiere,
        classe: chap.classe,
        ordre: chap.ordre,
        theme: chap.theme,
        titre: chap.titre,
        question: chap.question,
        notions: chap.notions,
        competences: chap.competences,
        url_app: chap.url_app,
        url_fiche: chap.url_fiche,
        xp: chap.xp,
      });
      setProgress(i + 1);
    }
    setImporting(false);
    setDone(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">⚙️ Admin</h1>
        <p className="text-gray-400 mb-6">Panneau d'administration STMG HUB</p>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setOnglet("chapitres")}
            className={`px-4 py-2 rounded-lg font-semibold ${onglet === "chapitres" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"}`}
          >
            📚 Chapitres
          </button>
          <button
            onClick={() => setOnglet("badges")}
            className={`px-4 py-2 rounded-lg font-semibold ${onglet === "badges" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"}`}
          >
            🏅 Badges
          </button>
        </div>

        {onglet === "chapitres" && (
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">📚 Import des chapitres depuis Excel</h2>

            <div className="bg-gray-700 rounded-xl p-4 mb-6">
              <p className="text-gray-300 text-sm mb-3">
                📋 <strong>Mode d'emploi :</strong> Ouvre l'Excel, ajoute tes liens dans les colonnes J et K, sauvegarde, puis charge le fichier ici.
              </p>
              <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg inline-block transition-all">
                📂 Charger le fichier Excel
                <input type="file" accept=".xlsx,.xls" onChange={lireExcel} className="hidden" />
              </label>
            </div>

            {chapitres.length > 0 && (
              <div className="mb-6">
                <p className="text-green-400 font-semibold mb-3">
                  ✅ {chapitres.length} chapitres chargés depuis l'Excel
                </p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  {["Management", "Sciences de Gestion", "Droit", "Économie"].map(matiere => {
                    const count1 = chapitres.filter(c => c.matiere === matiere && c.classe === "premiere").length;
                    const countT = chapitres.filter(c => c.matiere === matiere && c.classe === "terminale").length;
                    return (
                      <div key={matiere} className="bg-gray-700 rounded-lg p-3">
                        <p className="text-white font-bold text-sm">{matiere}</p>
                        <p className="text-blue-400 text-xs">📗 1ère : {count1} chapitres</p>
                        {countT > 0 && <p className="text-purple-400 text-xs">📘 Tle : {countT} chapitres</p>}
                      </div>
                    );
                  })}
                </div>

                {done ? (
                  <p className="text-green-400 font-bold">✅ {chapitres.length} chapitres importés dans Firestore !</p>
                ) : importing ? (
                  <div>
                    <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                      <div
                        className="bg-blue-500 h-3 rounded-full transition-all"
                        style={{ width: `${(progress / chapitres.length) * 100}%` }}
                      />
                    </div>
                    <p className="text-gray-400 text-sm">{progress} / {chapitres.length} importés...</p>
                  </div>
                ) : (
                  <button
                    onClick={importerChapitres}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg"
                  >
                    🚀 Importer dans Firestore
                  </button>
                )}
              </div>
            )}

            {erreur && <p className="text-red-400 font-semibold">{erreur}</p>}

            <div className="bg-gray-700 rounded-xl p-4 mt-4">
              <p className="text-gray-400 text-xs">
                💡 <strong>Astuce :</strong> Quand tu publies une nouvelle appli sur Netlify, ouvre l'Excel → colonne J → colle le lien → recharge le fichier ici → Importer. C'est tout !
              </p>
            </div>
          </div>
        )}

        {onglet === "badges" && (
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">🏅 Badges</h2>
            <p className="text-gray-400">Les badges sont déjà importés dans Firestore. Rien à faire ici pour l'instant !</p>
          </div>
        )}
      </div>
    </div>
  );
}