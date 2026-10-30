"use client";

import { useEffect, useRef, useState } from "react";
import HanziWriter from "hanzi-writer";
import { loadCharacterData } from "./character-data";

const TEST_CHARACTERS = [
  { character: "你", pinyin: "nǐ", translation: "ты" },
  { character: "好", pinyin: "hǎo", translation: "хорошо" },
  { character: "我", pinyin: "wǒ", translation: "я" },
  { character: "学", pinyin: "xué", translation: "учиться" },
  { character: "中", pinyin: "zhōng", translation: "середина, Китай" },
  { character: "国", pinyin: "guó", translation: "страна" },
  { character: "人", pinyin: "rén", translation: "человек" },
];
const LEVELS = {
  easy: { label: "Легко", showOutline: true, showHintAfterMisses: 1, leniency: 1.4 },
  normal: { label: "Нормально", showOutline: true, showHintAfterMisses: 3, leniency: 1 },
  hard: { label: "Сложно", showOutline: false, showHintAfterMisses: false as const, leniency: 0.7 },
};
type Difficulty = keyof typeof LEVELS;
type Mode = "demo" | "practice";
export interface HanziAttempt {
  id: string;
  character: string;
  difficulty: Difficulty;
  totalMistakes: number;
  score: number;
  durationMs: number;
  completedAt: string;
}
const button = "min-h-11 rounded-xl border border-ze-border px-4 py-2 text-sm font-medium transition hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ze-primary disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-800";
const primary = `${button} border-transparent bg-ze-primary text-white hover:bg-ze-primary-dark dark:hover:bg-ze-primary-dark`;
const card = "rounded-2xl border border-ze-border bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900";

export function HanziLab() {
  const [selected, setSelected] = useState(TEST_CHARACTERS[0]);
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [mode, setMode] = useState<Mode>("demo");
  const [revision, setRevision] = useState(0);
  const [input, setInput] = useState("");
  const [inputError, setInputError] = useState("");
  const [attempts, setAttempts] = useState<HanziAttempt[]>([]);
  const [started, setStarted] = useState(0);
  const index = TEST_CHARACTERS.findIndex((item) => item.character === selected.character);

  return (
    <div className="min-h-screen bg-ze-surface px-4 py-10 text-ze-ink dark:bg-slate-950 dark:text-slate-100 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex items-start justify-between gap-4">
          <div><p className="mb-2 text-sm font-semibold text-ze-primary dark:text-blue-300">ZagranEasy · Китайский язык · Тестовая страница</p>
            <h1 className="text-3xl font-bold sm:text-4xl">Лаборатория иероглифов</h1>
            <p className="mt-3 text-slate-500 dark:text-slate-400">Изучайте порядок черт и тренируйте написание китайских иероглифов</p></div>
        </header>

        <section className={card} aria-label="Выбор иероглифа">
          <div className="flex flex-wrap gap-2">{TEST_CHARACTERS.map((item) => (
            <button key={item.character} className={`${button} min-w-14 text-2xl ${selected.character === item.character ? "bg-blue-100 text-ze-primary dark:bg-blue-950 dark:text-blue-200" : ""}`} aria-pressed={selected.character === item.character} onClick={() => setSelected(item)}>{item.character}</button>
          ))}</div>
          <form className="mt-4 flex flex-wrap items-end gap-3" onSubmit={(event) => {
            event.preventDefault();
            const value = input.trim();
            if (Array.from(value).length !== 1 || !/^\p{Script=Han}$/u.test(value)) {
              setInputError("Введите ровно один китайский иероглиф, например 我.");
              return;
            }
            setInputError("");
            setSelected(TEST_CHARACTERS.find((item) => item.character === value) ?? { character: value, pinyin: "—", translation: "Собственный иероглиф · перевод не задан" });
          }}>
            <label className="flex flex-col gap-1 text-sm">Свой иероглиф
              <input value={input} onChange={(event) => setInput(event.target.value)} aria-invalid={!!inputError} aria-describedby={inputError ? "hanzi-input-error" : undefined} placeholder="Например, 爱" className="min-h-11 w-48 rounded-xl border border-ze-border bg-transparent px-3 dark:border-slate-700" />
            </label><button className={button}>Открыть</button>
          </form>
          {inputError && <p id="hanzi-input-error" role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">{inputError}</p>}
        </section>

        <div className="grid gap-6 md:grid-cols-[1fr_1.4fr]">
          <aside className={`${card} space-y-6`}>
            <div><p className="text-sm text-slate-500 dark:text-slate-400">{index >= 0 ? `Задание ${index + 1} из 7` : "Собственное задание"}</p>
              <div className="mt-3 flex items-center gap-4"><span className="text-6xl" lang="zh">{selected.character}</span><div><p className="text-xl font-semibold">{selected.pinyin}</p><p className="text-slate-500 dark:text-slate-400">{selected.translation}</p></div></div>
            </div>
            <fieldset><legend className="mb-2 font-semibold">Режим</legend><div className="flex flex-wrap gap-2">{([["demo", "Демонстрация"], ["practice", "Практика"]] as const).map(([value, label]) => <button key={value} className={mode === value ? primary : button} aria-pressed={mode === value} onClick={() => setMode(value)}>{label}</button>)}</div></fieldset>
            <fieldset><legend className="mb-2 font-semibold">Сложность</legend><div className="flex flex-wrap gap-2">{(Object.keys(LEVELS) as Difficulty[]).map((value) => <button key={value} className={difficulty === value ? primary : button} aria-pressed={difficulty === value} onClick={() => setDifficulty(value)}>{LEVELS[value].label}</button>)}</div>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{difficulty === "hard" ? "Без контура и автоматических подсказок. Строгая проверка." : `Контур включён. Подсказка после ${LEVELS[difficulty].showHintAfterMisses} ошибок на черте.`} Смена сложности сбрасывает упражнение.</p>
            </fieldset>
            <p className="text-sm">Начато попыток за сеанс: <strong>{started}</strong><br />Завершено: <strong>{attempts.length}</strong></p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Результаты хранятся только на этой странице и исчезнут после обновления.</p>
          </aside>
          <Exercise key={`${selected.character}-${difficulty}-${mode}-${revision}`} character={selected.character} difficulty={difficulty} mode={mode}
            onStart={() => setStarted((value) => value + 1)}
            onComplete={(attempt) => setAttempts((previous) => [attempt, ...previous])}
            onRetry={() => setRevision((value) => value + 1)}
            onNext={() => setSelected(TEST_CHARACTERS[(index + 1) % TEST_CHARACTERS.length])} />
        </div>
        <section className={card}><h2 className="text-lg font-semibold">Последние пять попыток</h2>
          {!attempts.length ? <p className="mt-3 text-sm text-slate-500">Завершите практику, чтобы увидеть результат.</p> : <ol className="mt-4 space-y-3">{attempts.slice(0, 5).map((attempt) => <li key={attempt.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-blue-50 p-3 dark:bg-slate-800"><span><strong className="mr-3 text-2xl">{attempt.character}</strong>{LEVELS[attempt.difficulty].label}</span><span className="text-sm">{attempt.totalMistakes} ошибок · {Math.round(attempt.durationMs / 1000)} сек. · <strong>{attempt.score}%</strong></span></li>)}</ol>}
        </section>
        <p className="text-sm text-slate-500 dark:text-slate-400">Hanzi Writer проверяет ожидаемые черты выбранного иероглифа. Он не распознаёт произвольный текст, не оценивает красоту каллиграфии, не проверяет произношение и не определяет перевод. Это инструмент практики, а не замена преподавателю.</p>
      </div>
    </div>
  );
}

function Exercise({ character, difficulty, mode, onStart, onComplete, onRetry, onNext }: {
  character: string; difficulty: Difficulty; mode: Mode;
  onStart: () => void; onComplete: (attempt: HanziAttempt) => void; onRetry: () => void; onNext: () => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const writer = useRef<HanziWriter | null>(null);
  const alive = useRef(false);
  const run = useRef(0);
  const [status, setStatus] = useState<"loading" | "ready" | "error" | "animating" | "paused" | "practice" | "complete">("loading");
  const [totalStrokes, setTotalStrokes] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [message, setMessage] = useState("Данные иероглифа загружаются…");
  const [outline, setOutline] = useState(LEVELS[difficulty].showOutline);
  const [visible, setVisible] = useState(mode === "demo");
  const [result, setResult] = useState<HanziAttempt | null>(null);

  useEffect(() => {
    const host = container.current!;
    host.replaceChildren();
    // A separate mount prevents late async callbacks from touching a newer SVG.
    const mount = document.createElement("div");
    host.append(mount);
    const controller = new AbortController();
    let disposed = false;
    alive.current = true;
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    const instance = HanziWriter.create(mount, character, {
      width: host.clientWidth, height: host.clientWidth, padding: 22,
      showCharacter: mode === "demo", showOutline: LEVELS[difficulty].showOutline,
      strokeColor: "#1a56db", drawingColor: "#1a56db", outlineColor: "#cbd5e1", highlightColor: "#38bdf8",
      delayBetweenStrokes: 280,
      charDataLoader: (char, onLoad, onError) => {
        void loadCharacterData(char, controller.signal).then((data) => {
          if (!disposed) onLoad(data);
        }).catch((error: unknown) => { if (!disposed) onError(error); });
      },
      onLoadCharDataSuccess: (data) => {
        clearTimeout(timeout);
        if (disposed) return;
        setTotalStrokes(data.strokes.length);
        setStatus("ready");
        setMessage(mode === "demo" ? "Посмотрите, в каком порядке пишутся черты." : "Нажмите «Начать писать» и проведите первую черту.");
      },
      onLoadCharDataError: () => {
        clearTimeout(timeout);
        if (disposed) return;
        setStatus("error");
        setMessage(`Не удалось загрузить «${character}». Проверьте подключение или выберите другой иероглиф: данные могут отсутствовать.`);
      },
    });
    writer.current = instance;
    const observer = new ResizeObserver(() => {
      if (!disposed && host.clientWidth) instance.updateDimensions({ width: host.clientWidth, height: host.clientWidth });
    });
    observer.observe(host);
    return () => {
      disposed = true;
      alive.current = false;
      clearTimeout(timeout);
      controller.abort();
      observer.disconnect();
      instance.cancelQuiz();
      void instance.pauseAnimation();
      writer.current = null;
      host.replaceChildren();
    };
  }, [character, difficulty, mode]);

  function start() {
    const instance = writer.current;
    if (!instance) return;
    const attemptRun = ++run.current;
    const startedAt = performance.now();
    const active = () => alive.current && run.current === attemptRun;
    instance.cancelQuiz();
    setCorrect(0); setMistakes(0); setResult(null); setStatus("practice");
    setMessage("Пишите первую черту мышью или пальцем.");
    onStart();
    void instance.quiz({
      ...LEVELS[difficulty], acceptBackwardsStrokes: false,
      onMistake: (data) => {
        if (!active()) return;
        setMistakes(data.totalMistakes);
        setMessage(`Попробуйте ещё раз. Ожидается черта ${data.strokeNum + 1}.`);
      },
      onCorrectStroke: (data) => {
        if (!active()) return;
        setCorrect(data.strokeNum + 1);
        setMessage(`Черта ${data.strokeNum + 1} написана правильно!`);
      },
      onComplete: (data) => {
        if (!active()) return;
        run.current++;
        const attempt: HanziAttempt = {
          id: crypto.randomUUID(), character, difficulty, totalMistakes: data.totalMistakes,
          score: Math.max(0, 100 - data.totalMistakes * 10), durationMs: performance.now() - startedAt,
          completedAt: new Date().toISOString(),
        };
        setMistakes(data.totalMistakes); setCorrect(totalStrokes); setResult(attempt); setStatus("complete");
        setMessage("Попытка завершена!"); onComplete(attempt);
      },
    });
  }
  const loaded = status !== "loading" && status !== "error";
  const animating = status === "animating" || status === "paused";

  return <section className={`${card} space-y-4`} aria-label="Рабочая область">
    <div className="relative mx-auto aspect-square w-full max-w-80 overflow-hidden rounded-xl border border-slate-300 bg-white" style={{ touchAction: "none" }}>
      <svg viewBox="0 0 320 320" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true"><path d="M160 0V320 M0 160H320 M0 0L320 320 M320 0L0 320" fill="none" stroke="#e2e8f0" strokeDasharray="5 5" /></svg>
      <div ref={container} className="relative h-full w-full" aria-label={`Поле написания иероглифа ${character}`} />
      {status === "loading" && <div className="absolute inset-0 flex items-center justify-center bg-white/90"><span className="h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-ze-primary" aria-label="Загрузка" /></div>}
    </div>
    <p role={status === "error" ? "alert" : "status"} className={`min-h-10 text-center text-sm ${status === "error" ? "text-red-600" : "text-slate-500 dark:text-slate-400"}`}>{message}</p>
    {status === "error" && <button className={button} onClick={onRetry}>Повторить загрузку</button>}
    {mode === "demo" ? <div className="flex flex-wrap gap-2">
      <button className={primary} disabled={!loaded || animating} onClick={() => {
        setStatus("animating"); setVisible(true); setMessage("Показываем порядок черт…");
        void writer.current?.animateCharacter({ onComplete: ({ canceled }) => {
          if (alive.current && !canceled) { setStatus("ready"); setMessage("Анимация завершена. Можно перейти к практике."); }
        } });
      }}>Показать порядок черт</button>
      <button className={button} disabled={status !== "animating"} onClick={() => { void writer.current?.pauseAnimation(); setStatus("paused"); setMessage("Анимация приостановлена."); }}>Пауза</button>
      <button className={button} disabled={status !== "paused"} onClick={() => { void writer.current?.resumeAnimation(); setStatus("animating"); setMessage("Показываем порядок черт…"); }}>Продолжить</button>
      <button className={button} disabled={!loaded || animating} onClick={() => { void (visible ? writer.current?.hideCharacter() : writer.current?.showCharacter()); setVisible(!visible); }}>{visible ? "Скрыть иероглиф" : "Показать иероглиф"}</button>
      <button className={button} disabled={!loaded} onClick={() => { void (outline ? writer.current?.hideOutline() : writer.current?.showOutline()); setOutline(!outline); }}>{outline ? "Скрыть контур" : "Показать контур"}</button>
    </div> : <>
      <div className="grid grid-cols-3 gap-2 rounded-xl bg-blue-50 p-3 text-center text-sm dark:bg-slate-800">
        <div>Черта<strong className="block text-lg">{totalStrokes ? Math.min(correct + 1, totalStrokes) : "—"} / {totalStrokes || "—"}</strong></div>
        <div>Осталось<strong className="block text-lg">{totalStrokes - correct}</strong></div>
        <div>Ошибки<strong className="block text-lg">{mistakes}</strong></div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button className={primary} disabled={!loaded || status === "practice"} onClick={start}>Начать писать</button>
        <button className={button} disabled={!loaded} onClick={start}>Начать заново</button>
        <button className={button} disabled={status !== "practice"} onClick={() => { void writer.current?.highlightStroke(correct); setMessage(`Подсказка: проследите за чертой ${correct + 1}.`); }}>Показать подсказку</button>
        <button className={button} onClick={onNext}>Следующий иероглиф</button>
      </div>
    </>}
    {result && <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
      <h2 className="font-semibold">Иероглиф: {result.character} · Попытка завершена</h2>
      <p className="mt-2 text-sm">Правильных черт: {correct} · Ошибок: {result.totalMistakes}<br />Время: {Math.round(result.durationMs / 1000)} секунд · Результат: <strong>{result.score}%</strong></p>
      <p className="mt-2 text-xs">Внутренний тестовый результат, а не официальная оценка качества каллиграфии. Формула: max(0, 100 − ошибки × 10).</p>
    </div>}
  </section>;
}
