"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "@/i18n/useTranslations";

/**
 * The eight panels shown in the sticky frame on /solutions. Each one renders
 * from `solutions.demo.<key>` in the dictionary; only the non-textual values
 * that drive geometry (scores, coordinates, chart heights) live in code.
 */

export type SolutionId =
  | "doc-search"
  | "research-assistant"
  | "support-agent"
  | "sales-enablement"
  | "helpdesk"
  | "data-analyst"
  | "contract-review"
  | "compliance-report";

type StepState = "done" | "running" | "pending";

function StateIcon({ state }: { state: StepState }) {
  if (state === "done") {
    return (
      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-ok-line bg-ok-soft">
        <svg viewBox="0 0 10 10" className="h-2.5 w-2.5">
          <path
            d="M2 5l2.5 2.5 4-4"
            stroke="var(--ok)"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }
  if (state === "running") {
    return (
      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-brand-200 bg-brand-50">
        <motion.div
          className="h-3 w-3 rounded-full border border-brand-500"
          style={{ borderTopColor: "transparent" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }
  return (
    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-line">
      <div className="h-1.5 w-1.5 rounded-full bg-line-strong" />
    </div>
  );
}

/* ── 01 · Enterprise search ──────────────────────────────────────────────── */

// Each row's score split between the vector and the keyword leg of the hybrid
// query. Ordered to match `solutions.demo.docSearch.rows`.
const DOC_SEARCH_SPLIT = [
  { vector: 62, keyword: 32, superseded: false },
  { vector: 58, keyword: 33, superseded: false },
  { vector: 40, keyword: 46, superseded: false },
  { vector: 48, keyword: 23, superseded: false },
  { vector: 31, keyword: 24, superseded: true },
];

function DocSearchDemo() {
  const { t, raw } = useTranslations("solutions.demo");
  const rows =
    raw<{ source: string; system: string; score: string }[]>("docSearch.rows");

  return (
    <div className="flex h-full flex-col px-4 pt-4 pb-3">
      <div className="mb-2 flex shrink-0 items-center justify-between">
        <p className="font-mono text-[10px] tracking-widest text-ink-faint uppercase">
          {t("docSearch.eyebrow")}
        </p>
        <div className="flex items-center gap-3 font-mono text-[10px] text-ink-faint">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-brand-500" />
            {t("docSearch.legendVector")}
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-brand-300" />
            {t("docSearch.legendKeyword")}
          </span>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-1.5">
        {rows.map((row, i) => {
          const split = DOC_SEARCH_SPLIT[i];
          return (
            <motion.div
              key={row.source}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.2 }}
              className={`flex flex-1 flex-col justify-center rounded-lg px-3 py-2 ${
                split.superseded ? "opacity-55" : ""
              }`}
              style={{ backgroundColor: "var(--panel)" }}
            >
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <span className="truncate text-[11px] font-medium text-ink-muted">
                  {row.source}
                </span>
                <div className="flex shrink-0 items-center gap-2">
                  {split.superseded && (
                    <span className="rounded-sm bg-warn-soft px-1.5 py-0.5 text-[10px] font-semibold text-warn">
                      {t("docSearch.supersededLabel")}
                    </span>
                  )}
                  <span className="font-mono text-[10px] text-ink-faint">
                    {row.system}
                  </span>
                  <span className="font-mono text-[10px] font-semibold text-brand-600">
                    {row.score}
                  </span>
                </div>
              </div>
              <div className="flex h-1.5 overflow-hidden rounded-full bg-line">
                <motion.div
                  className="h-full bg-brand-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${split.vector}%` }}
                  transition={{ delay: i * 0.05 + 0.1, duration: 0.45 }}
                />
                <motion.div
                  className="h-full bg-brand-300"
                  initial={{ width: 0 }}
                  animate={{ width: `${split.keyword}%` }}
                  transition={{ delay: i * 0.05 + 0.2, duration: 0.45 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-1 flex shrink-0 items-center gap-2 border-t border-line-soft pt-2 text-[11px] text-ink-faint">
        <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-ok" />
        {t("docSearch.footer")}
      </div>
    </div>
  );
}

/* ── 02 · Research assistant ─────────────────────────────────────────────── */

// Facet × source coverage. 0 means the source contributed nothing to that facet.
const COVERAGE_GRID = [
  [0.92, 0.71, 0.34, 0.18, 0.55],
  [0.48, 0.94, 0.62, 0.0, 0.21],
  [0.22, 0.51, 0.88, 0.44, 0.0],
  [0.66, 0.38, 0.29, 0.12, 0.4],
  [0.15, 0.24, 0.57, 0.71, 0.0],
  [0.58, 0.33, 0.0, 0.0, 0.82],
];

function coverageColor(score: number): string {
  // Light lavender → deep violet, tracking the brand hue.
  const lightness = Math.round(74 - score * 44);
  const saturation = Math.round(45 + score * 35);
  return `hsl(263, ${saturation}%, ${lightness}%)`;
}

function ResearchAssistantDemo() {
  const { t, raw } = useTranslations("solutions.demo");
  const facets = raw<string[]>("researchAssistant.facets");
  const columns = ["wiki", "drive", "tickets", "chat", "web"] as const;
  const [hovered, setHovered] = useState<{ row: number; col: number } | null>(
    null,
  );

  return (
    <div className="flex h-full flex-col px-4 pt-4 pb-3">
      <div className="mb-2.5 flex shrink-0 items-center justify-between">
        <p className="font-mono text-[10px] tracking-widest text-ink-faint uppercase">
          {t("researchAssistant.eyebrow")}
        </p>
        <motion.span
          className="font-mono text-[10px] text-brand-600"
          animate={{ opacity: [1, 0.35, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          ● {t("researchAssistant.working")}
        </motion.span>
      </div>

      <div className="mb-1 flex shrink-0" style={{ paddingLeft: "126px" }}>
        {columns.map((col) => (
          <div
            key={col}
            className="flex-1 text-center font-mono text-[10px] text-ink-faint"
          >
            {t(`researchAssistant.columns.${col}`)}
          </div>
        ))}
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        {facets.map((facet, i) => (
          <motion.div
            key={facet}
            className="flex flex-1 items-center"
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.22 }}
          >
            <div className="w-[126px] shrink-0 pr-2">
              <span className="block truncate text-[10px] leading-tight text-ink-subtle">
                {facet}
              </span>
            </div>
            {COVERAGE_GRID[i].map((score, j) => {
              const isHovered = hovered?.row === i && hovered?.col === j;
              const size = score > 0 ? Math.round(8 + score * 14) : 0;
              return (
                <div
                  key={j}
                  className="relative flex flex-1 items-center justify-center"
                  onMouseEnter={() => score > 0 && setHovered({ row: i, col: j })}
                  onMouseLeave={() => setHovered(null)}
                >
                  {score > 0 ? (
                    <motion.div
                      className="cursor-default rounded-full"
                      style={{
                        width: size,
                        height: size,
                        backgroundColor: coverageColor(score),
                      }}
                      animate={{ scale: isHovered ? 1.25 : 1 }}
                      transition={{ duration: 0.12 }}
                    />
                  ) : (
                    <div className="h-3 w-3 rounded-full border border-line" />
                  )}
                  {isHovered && (
                    <motion.div
                      className="pointer-events-none absolute -top-6 left-1/2 z-10 -translate-x-1/2 rounded-sm px-1.5 py-0.5 font-mono text-[10px] whitespace-nowrap text-white"
                      style={{ backgroundColor: coverageColor(score) }}
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.1 }}
                    >
                      {score.toFixed(2)}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </motion.div>
        ))}
      </div>

      <div className="mt-2.5 flex shrink-0 items-center gap-2 border-t border-line-soft pt-2">
        <span className="shrink-0 font-mono text-[10px] text-ink-faint">
          {t("status.low")}
        </span>
        <div className="flex items-center gap-0.5">
          {[0.2, 0.45, 0.65, 0.82, 1.0].map((s) => {
            const size = Math.round(5 + s * 10);
            return (
              <div
                key={s}
                className="rounded-full"
                style={{
                  width: size,
                  height: size,
                  backgroundColor: coverageColor(s),
                }}
              />
            );
          })}
        </div>
        <span className="shrink-0 font-mono text-[10px] text-ink-faint">
          {t("status.high")}
        </span>
        <span className="ml-auto font-mono text-[10px] text-ink-faint">
          {t("researchAssistant.coverage")}
        </span>
      </div>
    </div>
  );
}

/* ── 03 · Support deflection ─────────────────────────────────────────────── */

function SupportAgentDemo() {
  const { t, raw } = useTranslations("solutions.demo");
  const metrics = raw<{ label: string; value: string }[]>("supportAgent.metrics");
  const rows =
    raw<{ topic: string; state: string; detail: string }[]>("supportAgent.rows");

  return (
    <div className="flex h-full flex-col px-4 pt-4 pb-3">
      <p className="mb-2.5 shrink-0 font-mono text-[10px] tracking-widest text-ink-faint uppercase">
        {t("supportAgent.eyebrow")}
      </p>

      <div className="mb-3 grid shrink-0 grid-cols-3 gap-1.5">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.2 }}
            className="rounded-lg bg-panel px-2 py-2.5 text-center"
          >
            <p className="mb-0.5 text-[10px] text-ink-subtle">{metric.label}</p>
            <p className="text-sm font-bold text-brand-600">{metric.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-1">
        {rows.map((row, i) => {
          const resolved = row.state === "resolved";
          return (
            <motion.div
              key={row.topic}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 + 0.1, duration: 0.2 }}
              className="flex flex-1 items-center gap-2.5 rounded-lg bg-panel px-3"
            >
              <StateIcon state={resolved ? "done" : "pending"} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-medium text-ink-muted">
                  {row.topic}
                </p>
                <p className="truncate font-mono text-[10px] text-ink-faint">
                  {row.detail}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-sm px-1.5 py-0.5 text-[10px] font-semibold ${
                  resolved ? "bg-ok-soft text-ok" : "bg-warn-soft text-warn"
                }`}
              >
                {t(`supportAgent.states.${row.state}`)}
              </span>
            </motion.div>
          );
        })}
      </div>

      <p className="mt-2 shrink-0 border-t border-line-soft pt-2 text-[11px] text-ink-faint">
        {t("supportAgent.footer")}
      </p>
    </div>
  );
}

/* ── 04 · RFPs & security questionnaires ─────────────────────────────────── */

function SalesEnablementDemo() {
  const { t, raw } = useTranslations("solutions.demo");
  const sections =
    raw<{ name: string; matched: number; state: StepState }[]>(
      "salesEnablement.sections",
    );
  const gaps =
    raw<{ id: string; topic: string; owner: string }[]>("salesEnablement.gaps");

  return (
    <div className="flex h-full flex-col px-5 pt-4 pb-3">
      <div className="mb-3 flex shrink-0 items-center justify-between">
        <p className="font-mono text-[10px] tracking-widest text-ink-faint uppercase">
          {t("salesEnablement.eyebrow")}
        </p>
        <motion.span
          className="font-mono text-[10px] text-warn"
          animate={{ opacity: [1, 0.35, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          ● {t("salesEnablement.generating")}
        </motion.span>
      </div>

      <div className="mb-3 flex min-h-0 flex-1 flex-col gap-1.5">
        {sections.map((section, i) => (
          <motion.div
            key={section.name}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07, duration: 0.25 }}
            className="flex flex-1 items-center gap-3 rounded-lg bg-panel px-3"
          >
            <StateIcon state={section.state} />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-ink-muted">{section.name}</p>
              <p className="mt-0.5 text-[10px] text-ink-faint">
                {section.state === "running"
                  ? t("salesEnablement.runningLabel", { count: section.matched })
                  : t("salesEnablement.matchedLabel", { count: section.matched })}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="shrink-0 border-t border-line-soft pt-3">
        <p className="mb-2 font-mono text-[10px] tracking-widest text-ink-faint uppercase">
          {t("salesEnablement.topLabel")}
        </p>
        <table className="w-full text-xs">
          <tbody className="divide-y divide-line-soft">
            {gaps.map((gap, i) => (
              <motion.tr
                key={gap.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.06 }}
              >
                <td className="py-1.5 pr-2 font-mono text-[11px] text-brand-600">
                  {gap.id}
                </td>
                <td className="py-1.5 pr-2 text-[11px] text-ink-subtle">
                  {gap.topic}
                </td>
                <td className="py-1.5 text-right font-mono text-[10px] text-ink-faint">
                  {gap.owner}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── 05 · IT & HR helpdesk ───────────────────────────────────────────────── */

const TICKET_TEAM_COLOR: Record<string, string> = {
  IT: "var(--brand-500)",
  HR: "var(--ok)",
  Finance: "var(--warn)",
};

function HelpdeskDemo() {
  const { t, raw } = useTranslations("solutions.demo");
  const [tab, setTab] = useState<"policies" | "tickets">("policies");
  const policies =
    raw<
      { name: string; freshness: string; sources: number; confidence: number }[]
    >("helpdesk.policies");
  const legend = raw<string[]>("helpdesk.ticketsLegend");
  const tickets =
    raw<{ topic: string; team: string; volume: string; trend: string }[]>(
      "helpdesk.tickets",
    );

  return (
    <div className="flex h-full flex-col px-4 pt-4 pb-3">
      <div className="mb-3 flex shrink-0 gap-1.5">
        {(["policies", "tickets"] as const).map((tabId) => (
          <button
            key={tabId}
            type="button"
            aria-pressed={tab === tabId}
            onClick={() => setTab(tabId)}
            className={`rounded-full px-3 py-1 text-[11px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
              tab === tabId
                ? "bg-brand-100 text-brand-600"
                : "text-ink-faint hover:text-ink-subtle"
            }`}
          >
            {t(tabId === "policies" ? "helpdesk.tabPolicies" : "helpdesk.tabTickets")}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === "policies" ? (
          <motion.div
            key="policies"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="flex min-h-0 flex-1 flex-col gap-1.5">
              {policies.map((policy, i) => {
                const low = policy.confidence < 0.7;
                return (
                  <motion.div
                    key={policy.name}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.2 }}
                    className="flex flex-1 flex-col justify-center rounded-lg bg-panel px-3 py-2"
                  >
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-[11px] leading-snug font-medium text-ink-muted">
                        {policy.name}
                      </span>
                      <div className="ml-2 flex shrink-0 items-center gap-2">
                        <span className="font-mono text-[10px] text-ink-faint">
                          {policy.freshness}
                        </span>
                        <span className="text-[10px] text-ink-faint">
                          {policy.sources}×
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            backgroundColor: low ? "var(--warn)" : "var(--brand-500)",
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${policy.confidence * 100}%` }}
                          transition={{ delay: i * 0.06 + 0.1, duration: 0.5 }}
                        />
                      </div>
                      <span
                        className={`w-8 shrink-0 text-right font-mono text-[10px] font-semibold ${
                          low ? "text-warn" : "text-brand-600"
                        }`}
                      >
                        {policy.confidence.toFixed(2)}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <p className="shrink-0 pt-2 text-[10px] text-ink-faint">
              {t("helpdesk.confidenceNote")}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="tickets"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="mb-2 flex shrink-0 items-center gap-3">
              {legend.map((team) => (
                <span
                  key={team}
                  className="flex items-center gap-1 font-mono text-[10px] text-ink-faint"
                >
                  <span
                    className="inline-block h-2 w-2 rounded-sm"
                    style={{ backgroundColor: TICKET_TEAM_COLOR[team] }}
                  />
                  {team}
                </span>
              ))}
            </div>
            <div className="flex min-h-0 flex-1 flex-col gap-2">
              {tickets.map((ticket, i) => {
                const color = TICKET_TEAM_COLOR[ticket.team];
                const magnitude = parseFloat(ticket.volume);
                return (
                  <motion.div
                    key={ticket.topic}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="flex flex-1 flex-col justify-center rounded-lg bg-panel px-3 py-2"
                  >
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="truncate text-xs font-semibold text-ink-muted">
                          {ticket.topic}
                        </span>
                        <span
                          className="shrink-0 rounded-sm px-1.5 py-0.5 font-mono text-[10px]"
                          style={{ backgroundColor: `${color}20`, color }}
                        >
                          {ticket.team}
                        </span>
                      </div>
                      <span className="shrink-0 text-xs font-bold text-brand-600">
                        {ticket.volume}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: color }}
                          initial={{ width: 0 }}
                          animate={{
                            width: `${Math.min((magnitude / 4) * 100, 100)}%`,
                          }}
                          transition={{ delay: i * 0.07 + 0.1, duration: 0.5 }}
                        />
                      </div>
                      <span className="w-28 shrink-0 text-right text-[10px] text-ink-faint">
                        {ticket.trend}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <p className="shrink-0 pt-2 text-[10px] text-ink-faint">
              {t("helpdesk.ticketsFooter")}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── 06 · Analytics agent ────────────────────────────────────────────────── */

// MRR per quarter, indexed to match `dataAnalyst.quarters`.
const MRR_SERIES = [128, 141, 139, 166];

function DataAnalystDemo() {
  const { t, raw } = useTranslations("solutions.demo");
  const queryLines = raw<string[]>("dataAnalyst.queryLines");
  const quarters = raw<string[]>("dataAnalyst.quarters");
  const peak = Math.max(...MRR_SERIES);

  return (
    <div className="flex h-full flex-col px-4 pt-4 pb-3">
      <div className="mb-2 flex shrink-0 items-center justify-between">
        <p className="font-mono text-[10px] tracking-widest text-ink-faint uppercase">
          {t("dataAnalyst.eyebrow")}
        </p>
        <span className="font-mono text-[10px] text-ink-faint">
          {t("dataAnalyst.queryLabel")}
        </span>
      </div>

      <div className="mb-3 shrink-0 overflow-hidden rounded-lg bg-[#14121d] p-3 font-mono text-[10px] leading-relaxed text-slate-200">
        {queryLines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>

      <p className="mb-2 shrink-0 font-mono text-[10px] tracking-widest text-ink-faint uppercase">
        {t("dataAnalyst.chartLabel")}
      </p>

      <div className="flex min-h-0 flex-1 items-end gap-3 px-1">
        {MRR_SERIES.map((value, i) => (
          <div key={quarters[i]} className="flex flex-1 flex-col items-center gap-1.5">
            <span className="font-mono text-[10px] font-semibold text-brand-600">
              {value}k
            </span>
            <motion.div
              className="w-full rounded-t bg-brand-500"
              initial={{ height: 0 }}
              animate={{ height: `${(value / peak) * 100}%` }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: "easeOut" }}
              style={{ minHeight: 4 }}
            />
            <span className="font-mono text-[10px] text-ink-faint">
              {quarters[i]}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 shrink-0 rounded-lg bg-warn-soft px-3 py-2 text-[10px] text-warn">
        {t("dataAnalyst.caveat")}
      </div>
      <p className="mt-2 shrink-0 text-[11px] text-ink-faint">
        {t("dataAnalyst.footer")}
      </p>
    </div>
  );
}

/* ── 07 · Contract review ────────────────────────────────────────────────── */

// Deviation (x) × commercial exposure (y), both 0–1. Top-right is escalate.
const CLAUSE_FINDINGS = [
  { id: "liability", x: 0.62, y: 0.74, tone: "warn", state: "done" },
  { id: "termination", x: 0.48, y: 0.44, tone: "warn", state: "done" },
  { id: "indemnity", x: 0.14, y: 0.22, tone: "ok", state: "done" },
  { id: "dataResidency", x: 0.78, y: 0.82, tone: "bad", state: "done" },
  { id: "audit", x: 0.34, y: 0.38, tone: "neutral", state: "running" },
] as const;

const TONE_COLOR: Record<string, string> = {
  ok: "var(--ok)",
  warn: "var(--warn)",
  bad: "var(--bad)",
  neutral: "var(--ink-faint)",
};

function ContractReviewDemo() {
  const { t } = useTranslations("solutions.demo");
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="flex h-full flex-col px-4 pt-4 pb-3">
      <p className="mb-3 shrink-0 font-mono text-[10px] tracking-widest text-ink-faint uppercase">
        {t("contractReview.eyebrow")}
      </p>

      <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl">
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
          <div className="bg-warn-soft" />
          <div className="bg-bad-soft" />
          <div className="bg-ok-soft" />
          <div className="bg-warn-soft" />
        </div>

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-y-0 left-1/2 border-l border-window/70" />
          <div className="absolute inset-x-0 top-1/2 border-t border-window/70" />
        </div>

        <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 font-mono text-[10px] text-ink-faint">
          {t("contractReview.likelihood")}
        </span>
        <span
          className="absolute top-1/2 left-1.5 font-mono text-[10px] text-ink-faint"
          style={{
            writingMode: "vertical-rl",
            transform: "translateY(-50%) rotate(180deg)",
          }}
        >
          {t("contractReview.severity")}
        </span>
        <span className="absolute top-1.5 right-2 font-mono text-[10px] text-bad">
          {t("contractReview.highRisk")}
        </span>
        <span className="absolute bottom-1.5 left-8 font-mono text-[10px] text-ok">
          {t("contractReview.acceptable")}
        </span>

        {CLAUSE_FINDINGS.map((finding, i) => (
          <motion.div
            key={finding.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-default"
            style={{ left: `${finding.x * 100}%`, top: `${(1 - finding.y) * 100}%` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: i * 0.1 + 0.15,
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {finding.state === "running" ? (
              <motion.div
                className="h-3 w-3 rounded-full border-2"
                style={{
                  borderColor: TONE_COLOR[finding.tone],
                  borderTopColor: "transparent",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <div
                className="h-3 w-3 rounded-full ring-2 ring-window"
                style={{ backgroundColor: TONE_COLOR[finding.tone] }}
              />
            )}
            {hovered === i && (
              <motion.div
                className="absolute top-0 left-4 z-10 rounded-lg bg-ink px-2 py-1.5 whitespace-nowrap shadow-lg"
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.1 }}
              >
                <p className="text-[10px] font-semibold text-page">
                  {t(`contractReview.findings.${finding.id}.label`)}
                </p>
                <p className="text-[10px] text-page/70">
                  {t(`contractReview.findings.${finding.id}.sub`)}
                </p>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-3 flex shrink-0 items-center gap-2 border-t border-line-soft pt-2 text-[11px] text-ink-faint">
        <motion.span
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-warn"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />
        {t("contractReview.footer")}
      </div>
    </div>
  );
}

/* ── 08 · Compliance reporting ───────────────────────────────────────────── */

function ComplianceReportDemo() {
  const { t, raw } = useTranslations("solutions.demo");
  const metrics =
    raw<{ label: string; value: string }[]>("complianceReport.metrics");
  const docs =
    raw<{ name: string; format: string; state: StepState }[]>(
      "complianceReport.docs",
    );

  return (
    <div className="flex h-full flex-col px-4 pt-4 pb-3">
      <div className="mb-3 flex shrink-0 items-center justify-between">
        <p className="font-mono text-[10px] tracking-widest text-ink-faint uppercase">
          {t("complianceReport.eyebrow")}
        </p>
        <span className="font-mono text-[10px] font-semibold text-warn">
          {t("complianceReport.generatedCount")}
        </span>
      </div>

      <div className="mb-3 grid shrink-0 grid-cols-3 gap-1.5">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.2 }}
            className="rounded-lg bg-panel px-2 py-2.5 text-center"
          >
            <p className="mb-0.5 text-[10px] text-ink-subtle">{metric.label}</p>
            <p className="text-[11px] font-bold text-brand-600">{metric.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-1">
        {docs.map((doc, i) => (
          <motion.div
            key={doc.name}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 + 0.1, duration: 0.2 }}
            className="flex flex-1 items-center gap-2.5 rounded-lg bg-panel px-3"
          >
            <StateIcon state={doc.state} />
            <p
              className={`flex-1 text-[11px] font-medium ${
                doc.state === "pending" ? "text-ink-faint" : "text-ink-muted"
              }`}
            >
              {doc.name}
            </p>
            <span
              className={`rounded-sm px-1.5 py-0.5 font-mono text-[10px] font-semibold ${
                doc.state === "done"
                  ? "bg-ok-soft text-ok"
                  : doc.state === "running"
                    ? "bg-warn-soft text-warn"
                    : "bg-subtle text-ink-faint"
              }`}
            >
              {doc.format}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="mt-2 flex shrink-0 items-center gap-2 border-t border-line-soft pt-2 text-[11px] text-ink-faint">
        <motion.span
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-warn"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />
        {t("complianceReport.footer")}
      </div>
    </div>
  );
}

/* ── Registry ────────────────────────────────────────────────────────────── */

/** Maps a solution id to its demo component and its `solutions.demo` key. */
export const DEMO_REGISTRY: Record<
  SolutionId,
  { Component: React.ComponentType; i18nKey: string }
> = {
  "doc-search": { Component: DocSearchDemo, i18nKey: "docSearch" },
  "research-assistant": {
    Component: ResearchAssistantDemo,
    i18nKey: "researchAssistant",
  },
  "support-agent": { Component: SupportAgentDemo, i18nKey: "supportAgent" },
  "sales-enablement": {
    Component: SalesEnablementDemo,
    i18nKey: "salesEnablement",
  },
  helpdesk: { Component: HelpdeskDemo, i18nKey: "helpdesk" },
  "data-analyst": { Component: DataAnalystDemo, i18nKey: "dataAnalyst" },
  "contract-review": { Component: ContractReviewDemo, i18nKey: "contractReview" },
  "compliance-report": {
    Component: ComplianceReportDemo,
    i18nKey: "complianceReport",
  },
};
