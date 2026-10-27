import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useMatch,
  useNavigate,
  useParams,
} from "react-router-dom";
import Markdown from "react-markdown";
import {
  Activity,
  ArrowDownLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  ExternalLink,
  Flag,
  GraduationCap,
  History,
  Layers3,
  LayoutDashboard,
  Leaf,
  ListFilter,
  LoaderCircle,
  Menu,
  Moon,
  Play,
  Search,
  ShieldCheck,
  Sun,
  Target,
  X,
  XCircle,
} from "lucide-react";
import {
  TOPICS,
  type Attempt,
  type AttemptSummary,
  type Dashboard,
  type PublicQuestion,
  type Question,
  type Response,
} from "../shared/types";
import { api, post } from "./api";
import { Code } from "./Code";
import { useTheme } from "./useTheme";
import {
  HeroArtwork,
  WishYouWereHere,
  ShineScore,
  BrickMilestone,
} from "./EasterEggs";
import { isFloydSearch } from "../shared/easterEggs";

const date = (n: number) =>
  new Date(n).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
const duration = (a: { createdAt: number; submittedAt: number | null }) =>
  `${Math.max(0, Math.floor(((a.submittedAt ?? Date.now()) - a.createdAt) / 60000))} min`;
const percent = (n: number) => `${Math.round(n * 10) / 10}%`;
const resultTone = (a: Pick<Attempt, "score" | "passed" | "mode">) =>
  a.score === 100
    ? "perfect"
    : a.passed
      ? "passed"
      : a.mode === "study"
        ? "study-result"
        : "failed";
function Content({ children }: { children: string }) {
  return (
    <div className="markdown">
      <Markdown
        components={{
          code: ({ children, className }) => (
            <Code className={className}>{String(children)}</Code>
          ),
          a: ({ children, href }) => (
            <a href={href} target="_blank" rel="noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {children}
      </Markdown>
    </div>
  );
}
function Loading() {
  return (
    <div className="loading" role="status">
      <LoaderCircle className="spin" size={22} /> Loading your workspace…
    </div>
  );
}
function ErrorBox({ message }: { message: string }) {
  return (
    <div className="error" role="alert">
      <CircleHelp size={18} />
      {message}
    </div>
  );
}
function PageHeading({
  eyebrow,
  title,
  children,
  action,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {children && <p>{children}</p>}
      </div>
      {action}
    </div>
  );
}
function Mascot({
  pose,
  className = "",
}: {
  pose:
    | "welcome"
    | "presenting"
    | "celebrate"
    | "resting"
    | "study-guide"
    | "library-guide";
  className?: string;
}) {
  return (
    <img
      className={`mascot mascot-${pose} ${className}`}
      src={`/mascot/${pose}.png`}
      alt=""
      aria-hidden="true"
      decoding="async"
    />
  );
}
function Empty({
  title,
  children,
  mascot,
}: {
  title: string;
  children: ReactNode;
  mascot?: "resting" | "library-guide";
}) {
  return (
    <div className="empty">
      {mascot ? (
        <Mascot pose={mascot} />
      ) : (
        <div className="empty-icon">
          <Layers3 size={25} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}

export function App() {
  const { theme, toggleTheme } = useTheme();
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [error, setError] = useState("");
  const [mobile, setMobile] = useState(false);
  const location = useLocation();
  const attemptRoute = useMatch("/attempt/:id");
  const refresh = useCallback(
    () =>
      api<Dashboard>("/dashboard")
        .then((data) => {
          setDashboard(data);
          setError("");
        })
        .catch((e) => setError(e.message)),
    [],
  );
  useEffect(() => {
    void refresh();
    setMobile(false);
    window.scrollTo(0, 0);
  }, [location.pathname, refresh]);
  const isAttempt = !!attemptRoute;
  const nav = [
    { to: "/", icon: LayoutDashboard, label: "Overview" },
    { to: "/exam/new", icon: GraduationCap, label: "Practice exam" },
    { to: "/study", icon: BookOpen, label: "Study mode" },
    { to: "/library", icon: Layers3, label: "Question library" },
    { to: "/history", icon: History, label: "My progress" },
    { to: "/about", icon: CircleHelp, label: "About this project" },
  ];
  const attempt =
    dashboard && attemptRoute
      ? [...dashboard.active, ...dashboard.history].find(
          (item) => item.id === attemptRoute.params.id,
        )
      : null;
  const currentPage =
    nav.find(
      ({ to }) =>
        to === (location.pathname.replace(/\/+$/, "").toLowerCase() || "/"),
    )?.label ?? (attemptRoute ? "Session" : "Page not found");
  const breadcrumbs = attempt
    ? [
        {
          label: attempt.mode === "exam" ? "Practice exam" : "Study mode",
          to: attempt.mode === "exam" ? "/exam/new" : "/study",
        },
        {
          label: attempt.status === "submitted" ? "Results" : "Active session",
          to: location.pathname,
        },
      ]
    : [{ label: currentPage, to: location.pathname }];
  return (
    <div className={`app ${isAttempt ? "exam-app" : ""}`}>
      <button
        className="mobile-menu icon-button"
        aria-label="Toggle navigation"
        onClick={() => setMobile(!mobile)}
      >
        <Menu />
      </button>
      {mobile && (
        <button
          className="nav-overlay"
          aria-label="Close navigation"
          onClick={() => setMobile(false)}
        />
      )}
      <aside className={`sidebar ${mobile ? "open" : ""}`}>
        <Link to="/" className="brand">
          <span className="brand-icon">
            <Layers3 size={25} />
          </span>
          <span>
            TerraPrep<span className="brand-sub">COMMUNITY EDITION</span>
          </span>
        </Link>
        <div className="sidebar-label">YOUR WORKSPACE</div>
        <nav>
          {nav.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === "/"}>
              <Icon size={19} />
              <span>{label}</span>
              {to === "/library" && dashboard && (
                <small>{dashboard.total}</small>
              )}
            </NavLink>
          ))}
        </nav>
        {dashboard?.active.find((a) => a.mode === "exam") && (
          <Link
            className="resume-side"
            to={`/attempt/${dashboard.active.find((a) => a.mode === "exam")!.id}`}
          >
            <span className="live-dot" />
            Exam in progress
            <ArrowRight size={16} />
          </Link>
        )}
        <div className="sidebar-bottom">
          <div className="community-note">
            <Leaf size={20} />
            <strong>Made for the community.</strong>
          </div>
          <div className="version">
            TerraPrep v0.1 <span>Terraform 004</span>
          </div>
        </div>
      </aside>
      <div className="main-wrap">
        <header className="topbar">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/" className="workspace-label">
              Certification workspace
            </Link>
            {breadcrumbs.map((crumb, index) => {
              const current = index === breadcrumbs.length - 1;
              return (
                <Fragment key={crumb.to}>
                  <ChevronRight
                    className="breadcrumb-divider"
                    size={14}
                    aria-hidden="true"
                  />
                  <Link
                    to={
                      current
                        ? {
                            pathname: crumb.to,
                            search: location.search,
                            hash: location.hash,
                          }
                        : crumb.to
                    }
                    className={current ? undefined : "breadcrumb-parent"}
                    aria-current={current ? "page" : undefined}
                    replace={current}
                  >
                    {current ? <strong>{crumb.label}</strong> : crumb.label}
                  </Link>
                </Fragment>
              );
            })}
          </nav>
          <div className="topbar-right">
            <button
              className="theme-toggle"
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              aria-pressed={theme === "dark"}
            >
              {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
              <span className="theme-toggle-label">
                {theme === "dark" ? "Light mode" : "Dark mode"}
              </span>
            </button>
            <span className="version-pill">EXAM 004</span>
            <span className="local-pill">
              <span className="live-dot" />
              Free community practice
            </span>
          </div>
        </header>
        <main>
          {error && <ErrorBox message={error} />}
          <Routes>
            <Route
              path="/"
              element={dashboard ? <Overview data={dashboard} /> : <Loading />}
            />
            <Route
              path="/exam/new"
              element={
                dashboard ? (
                  <Setup key="exam" mode="exam" data={dashboard} />
                ) : (
                  <Loading />
                )
              }
            />
            <Route
              path="/study"
              element={
                dashboard ? (
                  <Setup key="study" mode="study" data={dashboard} />
                ) : (
                  <Loading />
                )
              }
            />
            <Route
              path="/attempt/:id"
              element={<Exam key={location.pathname} refresh={refresh} />}
            />
            <Route path="/library" element={<Library />} />
            <Route
              path="/history"
              element={dashboard ? <Progress data={dashboard} /> : <Loading />}
            />
            <Route path="/about" element={<About />} />
            <Route
              path="*"
              element={
                <Empty title="Page not found">
                  <Link to="/">Return to your workspace</Link>
                </Empty>
              }
            />
          </Routes>
        </main>
        <footer className="footer">
          {dashboard?.sourceUrl && (
            <a href={dashboard.sourceUrl} target="_blank" rel="noreferrer">
              View corresponding source
            </a>
          )}
          <span>
            Independent community project · Not affiliated with HashiCorp
          </span>
        </footer>
      </div>
    </div>
  );
}

function Overview({ data }: { data: Dashboard }) {
  const exams = data.history.filter((a) => a.mode === "exam");
  const average = exams.length
    ? exams.reduce((sum, a) => sum + a.score!, 0) / exams.length
    : null;
  const active = data.active[0];
  return (
    <>
      <PageHeading
        eyebrow="YOUR NEXT CHAPTER"
        title="Make progress. Build confidence."
      >
        Your space to prepare for Terraform Associate 004, one question at a
        time.
      </PageHeading>
      {active && (
        <Link className="resume-banner" to={`/attempt/${active.id}`}>
          <span>
            <Activity size={19} />
            <strong>
              You have an unfinished{" "}
              {active.mode === "exam" ? "exam" : "study session"}.
            </strong>{" "}
            Pick up where you left off.
          </span>
          <span>
            Resume <ArrowRight size={17} />
          </span>
        </Link>
      )}
      <section className="hero-card">
        <div className="hero-copy">
          <span className="hero-eyebrow">
            <span className="live-dot" /> TERRAFORM ASSOCIATE · 004
          </span>
          <h2>
            A fresh start.
            <br />A stronger foundation.
          </h2>
          <p>
            Turn what you know into exam-day confidence.
            <br />
            Practice at your pace, then put it to the test.
          </p>
          <Link to="/exam/new" className="button cream">
            Start a practice exam <ArrowRight size={18} />
          </Link>
          <div className="hero-facts">
            <span>
              <Clock3 size={14} />
              60 minutes
            </span>
            <span>
              <Layers3 size={14} />
              57–60 questions
            </span>
            <span>
              <Target size={14} />
              70% to pass
            </span>
          </div>
        </div>
        <HeroArtwork />
      </section>
      <section className="stats-grid">
        <Stat
          icon={<Layers3 />}
          label="Questions collected"
          value={String(data.total)}
          detail={`${data.unique} unique questions ready to practice`}
        />
        <Stat
          icon={<GraduationCap />}
          label="Exams completed"
          value={String(exams.length)}
          detail={
            exams.length
              ? `${exams.filter((a) => a.passed).length} passed · keep building consistency`
              : "Your first milestone is waiting"
          }
        />
        <Stat
          icon={<Target />}
          label="Average exam score"
          value={average === null ? "—" : percent(average)}
          detail={
            average === null
              ? "Take an exam to see your baseline"
              : "Across your completed timed exams"
          }
        />
        <Stat
          icon={<BookOpen />}
          label="Objectives to explore"
          value="8"
          detail="From IaC fundamentals to HCP Terraform"
        />
      </section>
      <div className="section-heading">
        <h2>Find your rhythm</h2>
        <span>Two ways to move forward</span>
      </div>
      <section className="mode-grid">
        <Link to="/exam/new" className="mode-card">
          <span className="mode-icon exam-accent">
            <GraduationCap size={24} />
          </span>
          <div>
            <span className="eyebrow">THE DRESS REHEARSAL</span>
            <h3>Practice exam</h3>
            <p>
              A focused, timed session. Review your answers and discover what
              needs a little more attention.
            </p>
            <span className="text-action">
              Simulate exam day <ArrowRight size={16} />
            </span>
          </div>
          <ArrowDownLeft className="card-corner" size={20} />
        </Link>
        <Link to="/study" className="mode-card">
          <span className="mode-icon blue">
            <BookOpen size={24} />
          </span>
          <div>
            <span className="eyebrow">LEARN AT YOUR OWN PACE</span>
            <h3>Study mode</h3>
            <p>
              Choose an objective, work through questions, and understand the
              reasoning behind each answer.
            </p>
            <span className="text-action">
              Build your understanding <ArrowRight size={16} />
            </span>
          </div>
          <ArrowDownLeft className="card-corner" size={20} />
        </Link>
      </section>
      <section className="overview-bottom">
        <div className="panel">
          <div className="panel-heading">
            <h2>Your objective map</h2>
            <Link to="/study">
              Explore topics <ArrowRight size={15} />
            </Link>
          </div>
          <TopicMap data={data} />
        </div>
        <div className="panel recent-practice-panel">
          <div className="panel-heading">
            <h2>Recent practice</h2>
            <Link to="/history">
              View all <ArrowRight size={15} />
            </Link>
          </div>
          {data.history.length ? (
            <AttemptList attempts={data.history.slice(0, 4)} />
          ) : (
            <Empty title="Your journey starts here">
              Complete your first session to see your practice history and
              progress.
            </Empty>
          )}
          <div className="recent-practice-footer">
            <Mascot pose="welcome" />
            <p>Get a feel for the questions with a short study session.</p>
          </div>
        </div>
      </section>
    </>
  );
}
function Stat({
  icon,
  label,
  value,
  detail,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="stat">
      <div className="stat-label">
        {label}
        <span>{icon}</span>
      </div>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  );
}
function TopicMap({ data }: { data: Dashboard }) {
  return (
    <div className="topic-map">
      {data.topics.map((t) => (
        <div className="topic-row" key={t.id}>
          <span className="topic-number">{String(t.id).padStart(2, "0")}</span>
          <div>
            <div className="topic-label">
              <span>{t.name}</span>
              <small>
                {t.accuracy === null
                  ? `${t.ready} questions`
                  : percent(t.accuracy)}
              </small>
            </div>
            <div className="progress-track">
              <span style={{ width: `${t.accuracy ?? 0}%` }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
function AttemptList({ attempts }: { attempts: AttemptSummary[] }) {
  return (
    <div className="attempt-list">
      {attempts.map((a) => (
        <Link to={`/attempt/${a.id}`} key={a.id} className="attempt-row">
          <span className={`attempt-icon ${resultTone(a)}`}>
            {a.mode === "exam" ? (
              <GraduationCap size={19} />
            ) : (
              <BookOpen size={19} />
            )}
          </span>
          <div>
            <strong>
              {a.mode === "exam" ? "Practice exam" : "Study session"}
            </strong>
            <small>
              {a.demo && <span className="demo-label">Demo</span>}
              {date(a.createdAt)} · {a.count} questions · {duration(a)}
            </small>
          </div>
          <span className={`score ${resultTone(a)}`}>
            {percent(a.score!)}
            <small>
              {a.score === 100
                ? "Perfect score"
                : a.mode === "study"
                  ? "Completed"
                  : a.passed
                    ? "Passed"
                    : "Keep practicing"}
            </small>
          </span>
          <ChevronRight size={16} />
        </Link>
      ))}
    </div>
  );
}

function Setup({ mode, data }: { mode: "exam" | "study"; data: Dashboard }) {
  const exam = mode === "exam";
  const [count, setCount] = useState(exam ? 60 : 10),
    [topics, setTopics] = useState<number[]>([]),
    [missedOnly, setMissedOnly] = useState(false);
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const active = data.active.find((a) => a.mode === "exam");
  async function start() {
    setBusy(true);
    setError("");
    try {
      const a = await post<Attempt>("/attempts", {
        mode,
        count,
        topics,
        missedOnly: !exam && missedOnly,
      });
      navigate(`/attempt/${a.id}`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div key={mode} className={`setup-page ${mode}`}>
      <PageHeading
        eyebrow={exam ? "THE DRESS REHEARSAL" : "ROOM TO EXPLORE"}
        title={
          exam
            ? "Let’s make it feel like exam day."
            : "A little focus goes a long way."
        }
      >
        {exam
          ? "Set aside an hour, get comfortable, and see where you stand."
          : "Pick your topics and learn with explanations along the way."}
      </PageHeading>
      <div className="setup-grid">
        <section className="panel setup-panel">
          <div className="panel-heading">
            <h2>{exam ? "Your practice exam" : "Build a study session"}</h2>
            <span className={`pill ${exam ? "exam-accent" : "blue"}`}>
              {exam ? "Timed" : "Untimed"}
            </span>
          </div>
          <div className="settings-intro">
            <div className="question-count-field">
              <label className="field-label" htmlFor={`count-${mode}`}>
                Number of questions
              </label>
              <select
                id={`count-${mode}`}
                value={count}
                onChange={(e) => setCount(+e.target.value)}
              >
                {(exam ? [57, 58, 59, 60] : [1, 5, 10, 20, 30, 50, 60]).map(
                  (n) => (
                    <option key={n} value={n}>
                      {n} questions
                    </option>
                  ),
                )}
              </select>
            </div>
            <Mascot pose={exam ? "presenting" : "study-guide"} />
          </div>
          {!exam && (
            <>
              <div className="field-label">
                Focus areas{" "}
                <small>Leave all unchecked to explore every objective.</small>
              </div>
              <div className="topic-checkboxes">
                {data.topics.map((t) => (
                  <label key={t.id}>
                    <input
                      type="checkbox"
                      checked={topics.includes(t.id)}
                      onChange={() =>
                        setTopics(
                          topics.includes(t.id)
                            ? topics.filter((x) => x !== t.id)
                            : [...topics, t.id],
                        )
                      }
                    />
                    <span>{t.name}</span>
                    <small>{t.ready}</small>
                  </label>
                ))}
              </div>
              <label className="check-row">
                <input
                  type="checkbox"
                  checked={missedOnly}
                  onChange={(e) => setMissedOnly(e.target.checked)}
                />
                Practice only previously missed questions
              </label>
            </>
          )}
          <div className="rules-list">
            {(exam
              ? [
                  "60 minutes, with no pause. The clock continues if you close the app.",
                  "70% to pass. Multiple-answer questions require the exact correct set.",
                  "Answers are saved as you go. Flag questions and return to them anytime.",
                  "At zero, your exam is submitted automatically. Review follows submission.",
                ]
              : [
                  "No timer. Take the time you need to understand each concept.",
                  "Check an answer for an explanation. Checked answers are locked.",
                  "Your answers and progress are saved between visits.",
                ]
            ).map((rule, i) => (
              <div key={i}>
                <CheckCircle2 size={18} />
                <span>{rule}</span>
              </div>
            ))}
          </div>
          {error && <ErrorBox message={error} />}
          <div className="setup-actions">
            {exam && active ? (
              <Link className="button primary" to={`/attempt/${active.id}`}>
                Resume your active exam <ArrowRight size={17} />
              </Link>
            ) : (
              <button
                className="button primary"
                disabled={busy}
                onClick={start}
              >
                {busy ? (
                  <LoaderCircle className="spin" size={18} />
                ) : (
                  <Play size={17} />
                )}{" "}
                {exam ? "Begin practice exam" : "Begin study session"}
              </button>
            )}
          </div>
        </section>
        <aside className="setup-aside">
          <div className="exam-ticket">
            <span className="eyebrow">YOUR NEXT MILESTONE</span>
            <GraduationCap size={38} />
            <h2>
              Terraform
              <br />
              Associate 004
            </h2>
            <p>Built around the eight exam objectives and Terraform 1.12.</p>
            <div>
              <span>Questions</span>
              <strong>{count}</strong>
            </div>
            <div>
              <span>Time limit</span>
              <strong>{exam ? "60 minutes" : "At your pace"}</strong>
            </div>
            <div>
              <span>{exam ? "Passing score" : "Feedback"}</span>
              <strong>{exam ? "70%" : "As you learn"}</strong>
            </div>
          </div>
          <div className="tip">
            <Leaf size={20} />
            <strong>Understanding over memorization.</strong>
            <p>
              After each session, spend a little time on the explanations.
              That’s where the next step forward begins.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Feedback({
  question,
  response,
  library = false,
}: {
  question: Question;
  response?: Response;
  library?: boolean;
}) {
  const correct =
    response?.selected.length === question.correct.length &&
    question.correct.every((id) => response.selected.includes(id));
  return (
    <div className={`feedback ${correct || library ? "correct" : "incorrect"}`}>
      <div className="feedback-title">
        {correct ? <CheckCircle2 size={20} /> : <CircleHelp size={20} />}
        <strong>
          {library
            ? question.status === "ready"
              ? "Answer explanation"
              : "Source notes · needs review"
            : correct
              ? "You’ve got it."
              : response?.selected.length
                ? "A good one to revisit."
                : "This one was unanswered."}
        </strong>
        <span>
          {question.status === "ready" ? "Correct" : "Source key"}:{" "}
          {question.correct.join(", ")}
        </span>
      </div>
      <Content>{question.explanation}</Content>
      {question.sourceAnswer && (
        <p className="source-notes">
          Original source key: {question.sourceAnswer.join(", ")}. The
          explanation above records the correction.
        </p>
      )}
      {question.notes.length > 0 && (
        <div className="source-notes">
          {question.notes.map((n, i) => (
            <p key={i}>{n}</p>
          ))}
        </div>
      )}
      <div className="reference-links">
        {question.references.map((r, i) => (
          <a key={i} href={r.url} target="_blank" rel="noreferrer">
            {r.label}
            <ExternalLink size={12} />
          </a>
        ))}
      </div>
    </div>
  );
}
function Options({
  question,
  response,
  onChange,
  disabled,
  reveal,
}: {
  question: PublicQuestion | Question;
  response?: Response;
  onChange?: (selected: string[]) => void;
  disabled?: boolean;
  reveal?: boolean;
}) {
  const selected = response?.selected ?? [],
    multi = question.type === "multiple";
  const correct = "correct" in question ? question.correct : [];
  return (
    <div
      className="options"
      role="group"
      aria-label={`Choose ${question.selectCount} answer${multi ? "s" : ""}`}
    >
      {question.options.map((o) => {
        const chosen = selected.includes(o.id),
          right = reveal && correct.includes(o.id),
          wrong = reveal && chosen && !correct.includes(o.id);
        return (
          <label
            className={`option ${chosen ? "selected" : ""} ${right ? "right" : ""} ${wrong ? "wrong" : ""} ${disabled ? "locked" : ""}`}
            key={o.id}
          >
            <input
              type={multi ? "checkbox" : "radio"}
              name={question.id}
              checked={chosen}
              disabled={
                disabled ||
                (multi && !chosen && selected.length >= question.selectCount)
              }
              onChange={() =>
                onChange?.(
                  multi
                    ? chosen
                      ? selected.filter((x) => x !== o.id)
                      : [...selected, o.id]
                    : [o.id],
                )
              }
            />
            <span className="option-letter">{o.id}</span>
            <Content>{o.text}</Content>
            <span className="option-indicator">
              {right ? (
                <Check size={18} />
              ) : wrong ? (
                <X size={18} />
              ) : chosen ? (
                <span />
              ) : null}
            </span>
          </label>
        );
      })}
    </div>
  );
}

function Exam({ refresh }: { refresh: () => Promise<void> }) {
  const { id } = useParams();
  const [a, setA] = useState<Attempt | null>(null),
    [index, setIndex] = useState(0),
    [error, setError] = useState("");
  const [busy, setBusy] = useState(false),
    [saveState, setSaveState] = useState("All changes saved"),
    [confirm, setConfirm] = useState(false),
    [tick, setTick] = useState(Date.now());
  const [reviewFilter, setReviewFilter] = useState("all");
  const modalRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!confirm) return;
    const previous = document.activeElement as HTMLElement | null;
    const modal = modalRef.current;
    modal
      ?.querySelector<HTMLButtonElement>("button")
      ?.focus({ preventScroll: true });
    const keys = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) {
        setConfirm(false);
        return;
      }
      if (event.key !== "Tab" || !modal) return;
      const buttons = [
        ...modal.querySelectorAll<HTMLButtonElement>("button:not(:disabled)"),
      ];
      const first = buttons[0],
        last = buttons.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus({ preventScroll: true });
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus({ preventScroll: true });
      }
    };
    document.addEventListener("keydown", keys);
    return () => {
      document.removeEventListener("keydown", keys);
      previous?.focus({ preventScroll: true });
    };
  }, [confirm, busy]);
  const offset = useRef(0),
    expired = useRef(false),
    busyRef = useRef(false);
  const pending = useRef<{
    questionId: string;
    selected: string[];
    flagged: boolean;
  } | null>(null);
  const accept = useCallback((next: Attempt) => {
    offset.current = next.serverNow - Date.now();
    if (next.status === "submitted") {
      pending.current = null;
      setConfirm(false);
    }
    setA(next);
  }, []);
  const load = useCallback(
    () =>
      api<Attempt>(`/attempts/${id}`)
        .then(accept)
        .catch((e) => setError(e.message)),
    [id, accept],
  );
  useEffect(() => {
    void load();
  }, [load]);
  useEffect(() => {
    const timer = setInterval(() => setTick(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    const reload = () => {
      if (!document.hidden && !busyRef.current && !pending.current) void load();
    };
    document.addEventListener("visibilitychange", reload);
    return () => document.removeEventListener("visibilitychange", reload);
  }, [load]);
  const remaining = a?.deadline
    ? Math.max(0, Math.ceil((a.deadline - (tick + offset.current)) / 1000))
    : null;
  useEffect(() => {
    if (a?.status === "active" && remaining === 0 && !expired.current) {
      expired.current = true;
      void post<Attempt>(`/attempts/${id}/submit`)
        .then((next) => {
          accept(next);
          void refresh();
        })
        .catch((e) => {
          setError(e.message);
          expired.current = false;
        });
    }
  }, [remaining, a?.status, id, accept, refresh, tick]);
  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (busyRef.current || pending.current) {
        event.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);
  async function save(
    questionId: string,
    selected: string[],
    flagged: boolean,
  ) {
    if (!a || busyRef.current) return;
    setError("");
    setSaveState("Saving…");
    setBusy(true);
    busyRef.current = true;
    const previous = a.responses[questionId];
    setA({
      ...a,
      responses: {
        ...a.responses,
        [questionId]: { ...previous, selected, flagged },
      },
    });
    pending.current = { questionId, selected, flagged };
    try {
      const next = await api<Attempt>(`/attempts/${id}/answers/${questionId}`, {
        method: "PUT",
        body: JSON.stringify({ selected, flagged }),
      });
      accept(next);
      pending.current = null;
      setSaveState("All changes saved");
    } catch (e) {
      setError((e as Error).message);
      setSaveState("Answer not saved — retry below");
    } finally {
      setBusy(false);
      busyRef.current = false;
    }
  }
  async function submit() {
    setBusy(true);
    setError("");
    try {
      accept(await post<Attempt>(`/attempts/${id}/submit`));
      setConfirm(false);
      await refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function check(questionId: string) {
    setBusy(true);
    try {
      accept(await post<Attempt>(`/attempts/${id}/check/${questionId}`));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  if (!a) return error ? <ErrorBox message={error} /> : <Loading />;
  const submitted = a.status === "submitted";
  const matches = a.questions
    .map((q, i) => ({ q, i }))
    .filter(
      ({ q }) =>
        reviewFilter === "all" ||
        (reviewFilter === "flagged"
          ? a.responses[q.id]?.flagged
          : reviewFilter === "unanswered"
            ? !a.responses[q.id]?.selected.length
            : "correct" in q &&
              !(
                a.responses[q.id]?.selected.length === q.correct.length &&
                q.correct.every((x) => a.responses[q.id]?.selected.includes(x))
              )),
    );
  const visibleIndex =
    submitted && !matches.some((x) => x.i === index) ? matches[0]?.i : index;
  const q = a.questions[visibleIndex ?? 0],
    response = a.responses[q.id],
    reveal = submitted || !!response?.checked;
  const answered = Object.values(a.responses).filter(
      (r) => r.selected.length > 0,
    ).length,
    flagged = Object.values(a.responses).filter((r) => r.flagged).length;
  const clock =
    remaining === null
      ? null
      : `${String(Math.floor(remaining / 60)).padStart(2, "0")}:${String(remaining % 60).padStart(2, "0")}`;
  const canNavigate = !busy && !pending.current;
  return (
    <div className={`attempt-page ${a.mode}`}>
      <PageHeading
        eyebrow={
          submitted
            ? "EVERY SESSION IS A STEP FORWARD"
            : a.mode === "exam"
              ? "STAY CURIOUS. STAY FOCUSED."
              : "LEARN AT YOUR OWN PACE"
        }
        title={
          submitted
            ? a.mode === "exam"
              ? a.passed
                ? "A milestone worth keeping."
                : "You know your next steps."
              : "A little more knowledge, earned."
            : a.mode === "exam"
              ? "Practice exam"
              : "Study session"
        }
        action={
          !submitted && (
            <div
              className={`timer ${remaining !== null && remaining <= 300 ? "urgent" : ""}`}
              role="timer"
              aria-label={clock ? `Time remaining ${clock}` : "Untimed"}
            >
              <Clock3 size={21} />
              <div>
                <small>{clock ? "TIME REMAINING" : "YOUR OWN PACE"}</small>
                <strong>{clock ?? "Untimed"}</strong>
              </div>
            </div>
          )
        }
      >
        {submitted
          ? `${a.correctCount} of ${a.count} correct · ${duration(a)} · ${a.submissionReason === "timeout" ? "Submitted when time expired" : "Session completed"}`
          : "Your answers save automatically. Keep going—you’re making progress."}
      </PageHeading>
      {a.demo && (
        <p className="demo-notice">
          Demo attempt · Added for Easter egg testing.
        </p>
      )}
      {submitted && (
        <>
          <section className={`result-banner ${resultTone(a)}`}>
            {a.score === 100 ? (
              <ShineScore />
            ) : (
              <div className="result-score">
                {percent(a.score!)}
                <small>Your score</small>
              </div>
            )}
            <div className="result-copy">
              <span className="eyebrow">
                {a.score === 100
                  ? `PERFECT SCORE · ${a.mode === "exam" ? "PRACTICE EXAM" : "STUDY SESSION"}`
                  : a.mode === "study"
                    ? "STUDY SESSION COMPLETE"
                    : a.passed
                      ? "PRACTICE EXAM PASSED"
                      : "KEEP BUILDING YOUR FOUNDATION"}
              </span>
              <h2>
                {a.score === 100
                  ? "Every question, correct."
                  : a.mode === "study"
                    ? "Take the understanding with you."
                    : a.passed
                      ? "You’re moving in the right direction."
                      : "A clearer picture of what to practice."}
              </h2>
              <p>
                {a.mode === "exam"
                  ? "Passing target: 70%. Review the explanations to make your next session count."
                  : "Review your answers below, then come back for another focused session."}
              </p>
            </div>
            <Link
              className="button primary"
              to={a.mode === "exam" ? "/exam/new" : "/study"}
            >
              Practice again <ArrowRight size={16} />
            </Link>
            {a.passed && a.score! < 100 && <Mascot pose="celebrate" />}
          </section>
          <ResultTopics attempt={a} />
        </>
      )}
      {error && <ErrorBox message={error} />}{" "}
      {pending.current && !busy && (
        <button
          className="button secondary retry"
          onClick={() => {
            const p = pending.current!;
            void save(p.questionId, p.selected, p.flagged);
          }}
        >
          Retry saving answer
        </button>
      )}
      <div className="exam-layout">
        <section className="question-panel panel">
          <div className="question-toolbar">
            <span className="eyebrow">
              QUESTION {(visibleIndex ?? 0) + 1}{" "}
              <span className="muted">OF {a.count}</span>
            </span>
            <span className="pill topic-pill category-badge" data-topic={q.topic}>
              {TOPICS[q.topic - 1]}
            </span>
            {!submitted && (
              <button
                className={`flag-button ${response?.flagged ? "flagged" : ""}`}
                disabled={!canNavigate}
                onClick={() =>
                  save(q.id, response?.selected ?? [], !response?.flagged)
                }
              >
                <Flag size={16} />
                {response?.flagged ? "Flagged" : "Flag for review"}
              </button>
            )}
          </div>
          {submitted && (
            <div className="review-filters">
              {[
                ["all", "All questions"],
                ["incorrect", "Incorrect"],
                ["unanswered", "Unanswered"],
                ["flagged", "Flagged"],
              ].map(([value, label]) => (
                <button
                  className={reviewFilter === value ? "active" : ""}
                  key={value}
                  onClick={() => setReviewFilter(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
          {submitted && matches.length === 0 ? (
            <Empty title="Nothing in this view">
              Choose another filter to continue reviewing.
            </Empty>
          ) : (
            <>
              <div className="question-prompt">
                <Content>{q.prompt}</Content>
              </div>
              <div className="answer-instruction">
                {q.type === "multiple"
                  ? `Choose ${q.selectCount} answers`
                  : "Choose one answer"}
                <span>
                  {q.type === "boolean"
                    ? "True / false"
                    : q.type === "multiple"
                      ? "Multiple answer"
                      : "Single answer"}
                </span>
              </div>
              <Options
                question={q}
                response={response}
                reveal={reveal}
                disabled={
                  submitted || !!response?.checked || busy || !!pending.current
                }
                onChange={(selected) =>
                  save(q.id, selected, response?.flagged ?? false)
                }
              />
              {!submitted && response?.selected.length && !response.checked && (
                <div className="answer-tools">
                  <button
                    className="text-button"
                    disabled={!canNavigate}
                    onClick={() => save(q.id, [], response.flagged)}
                  >
                    Clear selection
                  </button>
                  {a.mode === "study" && (
                    <button
                      className="button secondary"
                      disabled={
                        !canNavigate ||
                        response.selected.length !== q.selectCount
                      }
                      onClick={() => check(q.id)}
                    >
                      Check answer <Check size={16} />
                    </button>
                  )}
                </div>
              )}
              {reveal && "correct" in q && (
                <Feedback question={q} response={response} />
              )}
              <div className="question-source">
                <span>{q.id.toUpperCase()} · Community question</span>
              </div>
            </>
          )}
          <div className="question-nav">
            <button
              className="button secondary"
              disabled={
                !canNavigate ||
                (submitted
                  ? !matches.some((x) => x.i < (visibleIndex ?? 0))
                  : index === 0)
              }
              onClick={() =>
                setIndex(
                  submitted
                    ? matches.filter((x) => x.i < (visibleIndex ?? 0)).at(-1)!.i
                    : index - 1,
                )
              }
            >
              <ChevronLeft size={17} />
              Previous
            </button>
            <span className="save-state" role="status">
              {busy ? (
                <LoaderCircle size={14} className="spin" />
              ) : (
                <ShieldCheck size={14} />
              )}{" "}
              {submitted ? "Review mode" : saveState}
            </span>
            <button
              className="button primary"
              disabled={
                !canNavigate ||
                (submitted
                  ? !matches.some((x) => x.i > (visibleIndex ?? 0))
                  : index === a.count - 1)
              }
              onClick={() =>
                setIndex(
                  submitted
                    ? matches.find((x) => x.i > (visibleIndex ?? 0))!.i
                    : index + 1,
                )
              }
            >
              Next question
              <ChevronRight size={17} />
            </button>
          </div>
        </section>
        <aside className="exam-aside">
          <div className="panel question-map">
            <div className="panel-heading">
              <h3>{submitted ? "Your answers" : "Your progress"}</h3>
              <span>
                {answered}/{a.count}
              </span>
            </div>
            <div className="progress-track">
              <span style={{ width: `${(answered / a.count) * 100}%` }} />
            </div>
            <div className="question-grid">
              {a.questions.map((item, i) => {
                const r = a.responses[item.id];
                const correct =
                  "correct" in item &&
                  r?.selected.length === item.correct.length &&
                  item.correct.every((x) => r.selected.includes(x));
                return (
                  <button
                    key={item.id}
                    aria-label={`Question ${i + 1}${r?.selected.length ? ", answered" : ", unanswered"}${r?.flagged ? ", flagged" : ""}`}
                    aria-current={i === visibleIndex ? "step" : undefined}
                    disabled={!canNavigate}
                    onClick={() => {
                      setIndex(i);
                      if (submitted) setReviewFilter("all");
                    }}
                    className={`${i === visibleIndex ? "current" : ""} ${submitted ? (correct ? "q-correct" : "q-incorrect") : r?.selected.length ? "answered" : ""} ${r?.flagged ? "q-flagged" : ""}`}
                  >
                    {i + 1}
                    {r?.flagged && <span />}
                  </button>
                );
              })}
            </div>
            <div className="grid-legend">
              <span>
                <i
                  className={submitted ? "legend-correct" : "legend-answered"}
                />
                {submitted ? "Correct" : "Answered"}
              </span>
              <span>
                <i className={submitted ? "legend-incorrect" : undefined} />
                {submitted ? "Incorrect" : "Unanswered"}
              </span>
              <span>
                <i className="legend-flag" />
                Flagged
              </span>
            </div>
            {!submitted && (
              <>
                <div className="exam-counts">
                  <span>
                    Unanswered <strong>{a.count - answered}</strong>
                  </span>
                  <span>
                    Flagged for review <strong>{flagged}</strong>
                  </span>
                </div>
                <button
                  className="button primary full"
                  disabled={!canNavigate}
                  onClick={() => setConfirm(true)}
                >
                  {a.mode === "exam" ? "Finish exam" : "Finish session"}
                  <ArrowRight size={17} />
                </button>
              </>
            )}
          </div>
          <div className="tip compact">
            <Leaf size={19} />
            <p>
              {submitted
                ? "Read the explanations, including the questions you got right. Understanding lasts longer than an answer letter."
                : "Unsure about a question? Flag it, keep moving, and come back with a fresh perspective."}
            </p>
          </div>
        </aside>
      </div>
      {confirm && (
        <div className="modal-backdrop">
          <section
            ref={modalRef}
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="submit-title"
          >
            <button
              className="icon-button modal-close"
              aria-label="Close submission dialog"
              onClick={() => setConfirm(false)}
            >
              <X />
            </button>
            <span
              className={`mode-icon ${a.mode === "exam" ? "exam-accent" : "blue"}`}
            >
              <GraduationCap size={27} />
            </span>
            <h2 id="submit-title">Ready to finish?</h2>
            <p>
              You’ve answered{" "}
              <strong>
                {answered} of {a.count}
              </strong>{" "}
              questions.{" "}
              {a.count - answered > 0 &&
                `${a.count - answered} unanswered questions will count as incorrect.`}
            </p>
            <p>
              {flagged} question{flagged === 1 ? "" : "s"} flagged for review.
              Once submitted, answers are locked.
            </p>
            <div className="modal-actions">
              <button
                className="button secondary"
                disabled={busy}
                onClick={() => setConfirm(false)}
              >
                Keep reviewing
              </button>
              <button
                className="button primary"
                disabled={busy}
                onClick={submit}
              >
                {busy ? "Submitting…" : "Submit answers"}
                <Check size={17} />
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
function ResultTopics({ attempt }: { attempt: Attempt }) {
  return (
    <div className="result-topics">
      {TOPICS.map((name, i) => {
        const questions = attempt.questions.filter(
          (q) => q.topic === i + 1,
        ) as Question[];
        if (!questions.length) return null;
        const correct = questions.filter(
          (q) =>
            attempt.responses[q.id]?.selected.length === q.correct.length &&
            q.correct.every((x) =>
              attempt.responses[q.id]?.selected.includes(x),
            ),
        ).length;
        return (
          <div key={name}>
            <span>{name}</span>
            <strong>
              {correct}/{questions.length}
            </strong>
            <div className="progress-track">
              <span
                style={{ width: `${(correct / questions.length) * 100}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

type LibraryData = {
  total: number;
  page: number;
  pages: number;
  questions: Question[];
};
function Library() {
  const [search, setSearch] = useState(""),
    [topic, setTopic] = useState(0),
    [status, setStatus] = useState("all"),
    [page, setPage] = useState(1),
    [data, setData] = useState<LibraryData | null>(null),
    [open, setOpen] = useState<string | null>(null),
    [error, setError] = useState("");
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      api<LibraryData>(
        `/questions?search=${encodeURIComponent(search)}&topic=${topic}&status=${status}&page=${page}`,
      )
        .then((d) => {
          if (!cancelled) setData(d);
        })
        .catch((e) => {
          if (!cancelled) setError(e.message);
        });
    }, 150);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search, topic, status, page]);
  return (
    <>
      <PageHeading
        eyebrow="A SHARED FOUNDATION"
        title="Knowledge, collected and connected."
      >
        Browse every collected entry, follow its source, and explore the
        explanations.
      </PageHeading>
      <section className="panel library-panel">
        <div className="library-filters">
          <div className="search-field">
            <Search size={18} />
            <input
              aria-label="Search questions"
              placeholder="Search questions, commands, or concepts…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <select
            aria-label="Filter by objective"
            value={topic}
            onChange={(e) => {
              setTopic(+e.target.value);
              setPage(1);
            }}
          >
            <option value={0}>All objectives</option>
            {TOPICS.map((t, i) => (
              <option key={t} value={i + 1}>
                {t}
              </option>
            ))}
          </select>
          <select
            aria-label="Filter by review status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All entries</option>
            <option value="ready">Ready to practice</option>
            <option value="needs-review">Needs review</option>
          </select>
        </div>
        {!isFloydSearch(search) && (
          <div className="library-summary">
            <span>{data?.total ?? "…"} collected entries</span>
            <span>Source entries are preserved, including duplicates.</span>
          </div>
        )}
        {error && <ErrorBox message={error} />}{" "}
        {isFloydSearch(search) ? (
          <WishYouWereHere
            onBack={() => {
              setSearch("");
              setPage(1);
            }}
          />
        ) : !data ? (
          <Loading />
        ) : data.questions.length ? (
          data.questions.map((q) => (
            <article className="library-question" key={q.id}>
              <button
                className="library-question-toggle"
                aria-expanded={open === q.id}
                onClick={() => setOpen(open === q.id ? null : q.id)}
              >
                <span className="question-id">{q.id.toUpperCase()}</span>
                <div>
                  <Content>{q.prompt}</Content>
                  <div className="library-tags">
                    <span className="category-badge" data-topic={q.topic}>
                      {TOPICS[q.topic - 1]}
                    </span>
                    <span className="community-tag">Community question</span>
                    {q.duplicateOf && (
                      <span className="duplicate-tag">Linked duplicate</span>
                    )}
                    {q.status === "needs-review" && (
                      <span className="review-tag">Needs review</span>
                    )}
                  </div>
                </div>
                <ChevronRight
                  size={18}
                  className={open === q.id ? "rotate" : ""}
                />
              </button>
              {open === q.id && (
                <div className="library-detail">
                  <Options
                    question={q}
                    disabled
                    reveal={q.status === "ready"}
                  />
                  <Feedback question={q} library />
                  <div className="source-detail">
                    <strong>
                      Source:{" "}
                      {q.source.kind === "markdown"
                        ? q.source.file
                        : "Community question"}{" "}
                      · Question {q.source.number}
                    </strong>
                    <p>{q.source.permission}</p>
                    {q.duplicateOf && (
                      <p>
                        Equivalent entry: {q.duplicateOf.toUpperCase()}. Both
                        entries remain in the collection.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </article>
          ))
        ) : (
          <Empty title="No questions found" mascot="library-guide">
            Try another search or objective.
          </Empty>
        )}
        {!isFloydSearch(search) && (
          <div className="pagination">
            <button
              className="button secondary"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            <span>
              Page {data?.page ?? page} of {data?.pages ?? 1}
            </span>
            <button
              className="button secondary"
              disabled={!data || page >= data.pages}
              onClick={() => setPage(page + 1)}
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </section>
    </>
  );
}
function Progress({ data }: { data: Dashboard }) {
  const [filter, setFilter] = useState("all");
  const history = data.history.filter(
      (a) => filter === "all" || a.mode === filter,
    ),
    exams = data.history.filter((a) => a.mode === "exam");
  return (
    <div className="progress-page">
      <PageHeading
        eyebrow="SMALL STEPS ADD UP"
        title="See how far you’ve come."
      >
        Your practice history and objective performance, all in one place.
      </PageHeading>
      {data.history.some((a) => a.demo) && (
        <p className="demo-notice">
          Demo attempts are included in these practice statistics.
        </p>
      )}
      <div className="stats-grid three">
        <Stat
          icon={<GraduationCap />}
          label="Timed exams"
          value={String(exams.length)}
          detail={`${exams.filter((a) => a.passed).length} exams passed`}
        />
        <Stat
          icon={<Target />}
          label="Best exam score"
          value={
            exams.length
              ? percent(Math.max(...exams.map((a) => a.score!)))
              : "—"
          }
          detail="Your strongest timed attempt"
        />
        <Stat
          icon={<BookOpen />}
          label="Study sessions"
          value={String(data.history.filter((a) => a.mode === "study").length)}
          detail="Room to learn at your own pace"
        />
      </div>
      <BrickMilestone count={exams.length} />
      {exams.length > 0 && (
        <section className="panel trend-panel">
          <div className="panel-heading">
            <h2>Your exam scores</h2>
            <span>Last 12 exams · passing target 70%</span>
          </div>
          <div className="score-chart">
            <div className="target-line" style={{ bottom: "70%" }}>
              <span>70%</span>
            </div>
            {exams
              .slice(0, 12)
              .reverse()
              .map((a, i) => (
                <Link
                  key={a.id}
                  className={resultTone(a)}
                  to={`/attempt/${a.id}`}
                  style={{ height: `${Math.max(a.score!, 2)}%` }}
                  aria-label={`Exam ${i + 1}, ${percent(a.score!)}`}
                >
                  <span>{percent(a.score!)}</span>
                  <small>{i + 1}</small>
                </Link>
              ))}
          </div>
        </section>
      )}
      <div className="overview-bottom">
        <section className="panel">
          <div className="panel-heading">
            <h2>Session history</h2>
            <select
              aria-label="Filter history"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All sessions</option>
              <option value="exam">Exams</option>
              <option value="study">Study</option>
            </select>
          </div>
          {data.active.map((a) => (
            <Link className="active-session" key={a.id} to={`/attempt/${a.id}`}>
              <span className="live-dot" />
              {a.mode === "exam" ? "Exam" : "Study session"} in progress ·{" "}
              {a.count} questions
              <ArrowRight size={16} />
            </Link>
          ))}
          {history.length ? (
            <AttemptList attempts={history} />
          ) : (
            <Empty
              title="A fresh page"
              mascot={data.history.length === 0 ? "resting" : undefined}
            >
              Your completed sessions will appear here.
            </Empty>
          )}
        </section>
        <section className="panel">
          <div className="panel-heading">
            <h2>Objective performance</h2>
          </div>
          <TopicMap data={data} />
        </section>
      </div>
    </div>
  );
}
function About() {
  return (
    <>
      <PageHeading
        eyebrow="KNOWLEDGE IS BETTER SHARED"
        title="Practice made for the community."
      >
        A free, independent space to prepare, understand, and keep moving
        forward.
      </PageHeading>
      <section className="panel about-panel">
        <div className="about-title">
          <span className="mode-icon violet">
            <Leaf size={26} />
          </span>
          <h2>Why TerraPrep exists</h2>
        </div>
        <p>
          Good preparation should be accessible. TerraPrep brings community
          study questions into a focused practice experience with explanations,
          objective coverage, and a realistic clock.
        </p>
        <h3>What the simulation measures</h3>
        <p>
          Timed exams run for 60 minutes with 57–60 questions and a 70% passing
          target. These are our simulator settings. One point is awarded for
          each fully correct answer; multiple-answer questions require the exact
          set. Scores are not rounded before determining pass/fail.
        </p>
        <h3>Our question collection</h3>
        <p>
          All collected source entries remain included. Duplicates are linked so
          they do not repeat within an exam. Incomplete, ambiguous, or outdated
          questions remain searchable with a review note and are excluded from
          scored practice until corrected. Source keys and corrections are
          recorded in the question data.
        </p>
        <h3>A community project, free to use</h3>
        <p>
          Local use and free public hosting are welcome. The project uses a
          TerraPrep Community License 1.0, a custom noncommercial, source-sharing
          license. Selling the
          app, charging for access, and closed-source derivatives are
          prohibited. Third-party material retains its applicable terms and
          attribution.
        </p>
        <h3>Your progress stays with your browser</h3>
        <p>
          No account is required. An anonymous browser cookie identifies your
          attempts, which are stored in the app’s SQLite database. Clearing
          cookies or using another browser starts a separate history. The app
          does not use analytics or an AI service.
        </p>
        <div className="about-disclaimer">
          <ShieldCheck size={22} />
          <p>
            TerraPrep is not affiliated with or endorsed by HashiCorp. Questions
            are community practice material, not a claim of verified real-exam
            content. Terraform and HashiCorp are trademarks of their respective
            owners.
          </p>
        </div>
      </section>
    </>
  );
}
