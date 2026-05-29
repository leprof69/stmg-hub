/** Lecture dsTab (align\u00e9e sur src/services/dsTabExamService.ts) pour scripts Node. */

export const DS_SDGN_QCM_EXAM_ID = "sdgn_premiere_qcm_v1";

export function parseFlexibleNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const trimmed = value.trim().replace(",", ".");
    if (!trimmed) return null;
    const n = Number(trimmed);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function readLegacyFlatDsTabExam(userData) {
  const prefix = `dsTab.${DS_SDGN_QCM_EXAM_ID}.`;
  const exam = {};
  let found = false;
  for (const [key, value] of Object.entries(userData)) {
    if (!key.startsWith(prefix)) continue;
    found = true;
    exam[key.slice(prefix.length)] = value;
  }
  return found ? exam : null;
}

function pickExamTabFromDsTabContainer(dsTab) {
  const direct = dsTab[DS_SDGN_QCM_EXAM_ID];
  if (direct && typeof direct === "object") return direct;

  if (
    parseFlexibleNumber(dsTab.gradeOn20) != null ||
    parseFlexibleNumber(dsTab.score) != null ||
    dsTab.lastSession ||
    dsTab.attemptStarted
  ) {
    return dsTab;
  }

  for (const value of Object.values(dsTab)) {
    if (!value || typeof value !== "object") continue;
    const candidate = value;
    if (
      parseFlexibleNumber(candidate.gradeOn20) != null ||
      parseFlexibleNumber(candidate.score) != null ||
      candidate.lastSession ||
      candidate.attemptStarted ||
      candidate.examId === DS_SDGN_QCM_EXAM_ID
    ) {
      return candidate;
    }
  }
  return null;
}

export function readDsTabRoot(userData) {
  if (!userData) return null;
  const dsTab = userData.dsTab;
  if (dsTab && typeof dsTab === "object" && !Array.isArray(dsTab)) {
    const fromContainer = pickExamTabFromDsTabContainer(dsTab);
    if (fromContainer) return fromContainer;
  }
  return readLegacyFlatDsTabExam(userData);
}

export function hasDsTabExamData(userData) {
  const examTab = readDsTabRoot(userData);
  if (!examTab) return false;
  if (examTab.lastSession) return true;
  if (parseFlexibleNumber(examTab.gradeOn20) != null) return true;
  if (parseFlexibleNumber(examTab.score) != null) return true;
  return Boolean(examTab.attemptStarted);
}

function computeGrade(score, total) {
  if (!total || total <= 0) return 0;
  const maxPts = total * 4;
  if (maxPts <= 0) return 0;
  return Math.round(Math.max(0, Math.min(20, (score / maxPts) * 20)) * 10) / 10;
}

export function resolveDsGradeOn20FromUser(userData) {
  const grades = [];
  const tab = readDsTabRoot(userData);
  if (tab) {
    const walk = (obj, depth) => {
      if (!obj || typeof obj !== "object" || depth > 24) return;
      if (Array.isArray(obj)) return obj.forEach((v) => walk(v, depth + 1));
      for (const key of ["gradeOn20", "gradeOn20Provisional"]) {
        const n = parseFlexibleNumber(obj[key]);
        if (n != null && n > 0) grades.push(n);
      }
      Object.values(obj).forEach((v) => walk(v, depth + 1));
    };
    walk(tab, 0);
    const score = parseFlexibleNumber(tab.score);
    const total = parseFlexibleNumber(tab.total);
    if (score != null && total != null && total > 0) grades.push(computeGrade(score, total));
  }
  const session = readDsTabLastSession(userData);
  if (session) {
    const total = session.totalQuestions || session.answers?.length || 0;
    const score = session.scorePoints ?? 0;
    if (total > 0) grades.push(computeGrade(score, total));
  }
  return grades.length ? Math.max(...grades) : 0;
}

export function readDsTabLastSession(userData) {
  const examTab = readDsTabRoot(userData);
  if (!examTab) return null;
  const last = examTab.lastSession;
  if (last && typeof last === "object") return last;
  const gradeOn20 = parseFlexibleNumber(examTab.gradeOn20);
  const scorePoints = parseFlexibleNumber(examTab.score);
  if (gradeOn20 == null && scorePoints == null && !examTab.attemptStarted) return null;
  return {
    gradeOn20: examTab.forcedZero ? 0 : gradeOn20 ?? 0,
    gradeOn20Provisional: examTab.forcedZero && gradeOn20 != null ? gradeOn20 : undefined,
    scorePoints: scorePoints ?? 0,
    totalQuestions: parseFlexibleNumber(examTab.total) ?? 0,
    forcedZero: Boolean(examTab.forcedZero),
    status: examTab.forcedZero ? "disqualified" : "completed",
    answers: Array.isArray(last?.answers) ? last.answers : [],
    topicStats: last?.topicStats ?? {},
    questionsAnswered: last?.questionsAnswered ?? 0,
    finishedAt: examTab.finishedAt ?? "",
  };
}

export function buildStudentRow(user) {
  const session = readDsTabLastSession(user);
  const examTab = readDsTabRoot(user);
  const examRootGrade = resolveDsGradeOn20FromUser(user) || parseFlexibleNumber(examTab?.gradeOn20);
  const attemptStarted = Boolean(examTab?.attemptStarted);
  let displayStatus = "not_started";
  if (session?.status) displayStatus = session.status;
  else if (attemptStarted) displayStatus = "incomplete";
  else if (examRootGrade != null && examRootGrade > 0) displayStatus = "completed";

  const name =
    user.prenom || user.nom || user.email || `Eleve ${String(user.id).slice(0, 6)}`;

  return {
    studentId: String(user.id),
    studentName: name,
    classe: user.classe || "",
    email: user.email || "",
    session,
    displayStatus,
    examRootGrade: examRootGrade ?? undefined,
    hasDsData: hasDsTabExamData(user) && displayStatus !== "not_started",
  };
}
