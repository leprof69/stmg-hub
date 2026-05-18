import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";

/** Message affichù lorsque les jetons sont bloquùs (persistant jusqu'ù action admin). */
export const PLATFORM_XP_BLOCKED_MESSAGE =
  "Changement d'onglet ou une autre fenùtre au premier plan a ùtù dùtectù : tu ne peux plus gagner de jetons tant que l'ùquipe ne rùtablit pas ton accùs (contacte ton prof en cas d'erreur). Recharger la page ne suffit pas.";

type PlatformIntegrityContextValue = {
  xpRewardsSuspended: boolean;
  acknowledgeReturnWall: () => void;
};

const PlatformIntegrityContext = createContext<PlatformIntegrityContextValue | null>(null);

const ARM_DELAY_MS = 450;

export function PlatformIntegrityProvider({
  children,
  userId,
  isAdmin,
  xpSuspendedFromProfile,
  onAfterViolation,
}: {
  children: ReactNode;
  userId: string | null | undefined;
  isAdmin: boolean;
  xpSuspendedFromProfile: boolean;
  onAfterViolation?: () => void;
}) {
  const [sessionSuspended, setSessionSuspended] = useState(false);
  const [returnWallOpen, setReturnWallOpen] = useState(false);

  const armedRef = useRef(false);
  const hadVisibleFocusRef = useRef(false);
  const pendingReturnWallRef = useRef(false);
  /** Mis ù true dùs la premiùre sortie d'onglet (sync, avant re-render React). */
  const sessionViolatedRef = useRef(false);
  const profileSuspendedRef = useRef(xpSuspendedFromProfile);
  profileSuspendedRef.current = xpSuspendedFromProfile;

  const onAfterViolationRef = useRef(onAfterViolation);
  onAfterViolationRef.current = onAfterViolation;

  useEffect(() => {
    if (!xpSuspendedFromProfile) {
      sessionViolatedRef.current = false;
      setSessionSuspended(false);
    }
  }, [xpSuspendedFromProfile]);

  useEffect(() => {
    if (!userId || isAdmin) {
      armedRef.current = false;
      hadVisibleFocusRef.current = false;
      pendingReturnWallRef.current = false;
      setReturnWallOpen(false);
      return;
    }

    const armTimer = window.setTimeout(() => {
      armedRef.current = true;
      if (document.visibilityState === "visible") {
        hadVisibleFocusRef.current = true;
      }
    }, ARM_DELAY_MS);

    const persistViolationFirestore = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid || uid !== userId) return;
      try {
        await updateDoc(doc(db, "users", uid), {
          "platformIntegrity.xpSuspended": true,
          "platformIntegrity.suspendedAt": new Date().toISOString(),
        });
        onAfterViolation?.();
      } catch (err) {
        console.error("Enregistrement anti-triche (platformIntegrity) impossible", err);
      }
    };

    const onVisibility = () => {
      if (!armedRef.current) return;
      const v = document.visibilityState;

      if (v === "visible") {
        if (!hadVisibleFocusRef.current) {
          hadVisibleFocusRef.current = true;
          return;
        }
        const blocked = profileSuspendedRef.current || sessionViolatedRef.current;
        if (pendingReturnWallRef.current && blocked) {
          setReturnWallOpen(true);
          pendingReturnWallRef.current = false;
        }
      } else if (v === "hidden") {
        if (!hadVisibleFocusRef.current) return;
        pendingReturnWallRef.current = true;
        sessionViolatedRef.current = true;
        setSessionSuspended(true);
        void persistViolationFirestore();
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearTimeout(armTimer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [userId, isAdmin]);

  const acknowledgeReturnWall = useCallback(() => {
    setReturnWallOpen(false);
  }, []);

  const xpRewardsSuspended = !isAdmin && (xpSuspendedFromProfile || sessionSuspended);

  const value = useMemo(
    () => ({ xpRewardsSuspended, acknowledgeReturnWall }),
    [xpRewardsSuspended, acknowledgeReturnWall],
  );

  const showWall = !isAdmin && returnWallOpen;

  return (
    <PlatformIntegrityContext.Provider value={value}>
      {children}
      {showWall ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="platform-integrity-title"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2147483646,
            background: "rgba(15, 23, 42, 0.94)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              maxWidth: 440,
              width: "100%",
              borderRadius: 16,
              padding: "26px 24px",
              background: "linear-gradient(165deg, #f8fafc 0%, #e2e8f0 100%)",
              border: "2px solid #94a3b8",
              boxShadow: "0 24px 48px rgba(15,23,42,0.35)",
              fontFamily: "'Nunito', system-ui, sans-serif",
            }}
          >
            <h2
              id="platform-integrity-title"
              style={{
                margin: "0 0 12px",
                fontSize: "1.25rem",
                fontWeight: 900,
                color: "#0f172a",
                fontFamily: "'Fredoka One', cursive",
                letterSpacing: "0.02em",
              }}
            >
              Jetons suspendus
            </h2>
            <p style={{ margin: "0 0 14px", fontWeight: 700, fontSize: "0.96rem", lineHeight: 1.55, color: "#334155" }}>
              Tu as quittù cet onglet ou affichù une autre fenùtre au premier plan :{" "}
              <strong>tu ne peux plus gagner de jetons</strong> sur STMG Hub tant que ton professeur ne rùtablit pas ton accùs
              (anti-triche ou levùe en cas de bug).
            </p>
            <button
              type="button"
              onClick={acknowledgeReturnWall}
              style={{
                width: "100%",
                border: "none",
                borderRadius: 12,
                padding: "14px 18px",
                fontWeight: 800,
                fontSize: "1rem",
                cursor: "pointer",
                background: "linear-gradient(180deg, #0d9488 0%, #0f766e 100%)",
                color: "#ffffff",
                fontFamily: "'Nunito', system-ui, sans-serif",
                boxShadow: "0 4px 14px rgba(13,148,136,0.45)",
              }}
            >
              J'ai compris
            </button>
          </div>
        </div>
      ) : null}
    </PlatformIntegrityContext.Provider>
  );
}

export function usePlatformIntegrity(): PlatformIntegrityContextValue {
  const ctx = useContext(PlatformIntegrityContext);
  if (!ctx) {
    return { xpRewardsSuspended: false, acknowledgeReturnWall: () => {} };
  }
  return ctx;
}
