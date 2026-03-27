import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, ChevronUp, Zap, TrendingUp, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useMarketStore,
  type AumRange,
  type HnwRange,
  type ScoreRange,
  type Custodian,
} from "@/store/marketStore";

const aumRanges: { label: AumRange; count: number }[] = [
  { label: "$0M - $50M", count: 30 },
  { label: "$50M - $100M", count: 25 },
  { label: "$250M - $500M", count: 25 },
  { label: "$500M - $1B", count: 15 },
  { label: "$1B - $2.5B", count: 10 },
];

const hnwRanges: { label: HnwRange; count: number }[] = [
  { label: "85% to 100%", count: 35 },
  { label: "65% to 85%", count: 30 },
  { label: "45% to 65%", count: 25 },
  { label: "0% to 45%", count: 15 },
];

const scoreRanges: { label: string; value: ScoreRange; tag: string; tagColor: string; count: number }[] = [
  { label: "70+", value: "high", tag: "HIGH", tagColor: "text-[#10b981]", count: 45 },
  { label: "50 to 70", value: "moderate", tag: "MODERATE", tagColor: "text-[#f59e0b]", count: 35 },
  { label: "Less than 50", value: "low", tag: "LOW", tagColor: "text-[#dc2626]", count: 25 },
];

const custodians: { label: Custodian; count: number }[] = [
  { label: "Schwab", count: 35 },
  { label: "Fidelity", count: 30 },
  { label: "Goldman Sachs", count: 25 },
  { label: "Other", count: 15 },
];

 const assignedCustodians: Custodian[] = ["Schwab", "Fidelity", "Goldman Sachs", "Other"];

interface FilterCardProps {
  title: string;
  count: number;
  clearLabel?: string;
  onClear?: () => void;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterCard({ title, count, onClear, children, defaultOpen = true }: FilterCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <motion.div
      layout
      className="rounded-lg border border-[#e5e7eb] dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-foreground hover:bg-[#f9fafb] dark:hover:bg-gray-700 transition-colors"
      >
        <span className="flex items-center gap-2 font-semibold text-[13px]">
          {title}
          {count > 0 && (
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#5265F5] text-white text-[10px] font-bold">
              {count}
            </span>
          )}
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-[#6b7280] dark:text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[#6b7280] dark:text-gray-400" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <div className="px-4 pb-4">
              {onClear && (
                <button
                  onClick={onClear}
                  className="text-xs text-[#9ca3af] hover:text-foreground transition-colors mb-2 flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Clear All
                </button>
              )}

              <div className="flex gap-2 mb-3">
                <button className="flex-1 text-xs font-medium py-1.5 rounded-lg bg-[#f3f4f6] text-foreground hover:bg-[#e5e7eb] transition-colors">
                  Preset
                </button>
                <button className="flex-1 text-xs font-medium py-1.5 rounded-lg text-[#9ca3af] hover:bg-[#f3f4f6] transition-colors">
                  Custom
                </button>
              </div>

              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FilterSidebar() {
  const store = useMarketStore();

  // Calculate dynamic counts based on current data
  const getAumCounts = () => {
    const counts: Record<AumRange, number> = {
      "$0M - $50M": 0,
      "$50M - $100M": 0,
      "$250M - $500M": 0,
      "$500M - $1B": 0,
      "$1B - $2.5B": 0,
    };

    store.firms.forEach((firm) => {
      if (firm.totalAum < 50) counts["$0M - $50M"]++;
      else if (firm.totalAum < 100) counts["$50M - $100M"]++;
      else if (firm.totalAum < 500) counts["$250M - $500M"]++;
      else if (firm.totalAum < 1000) counts["$500M - $1B"]++;
      else counts["$1B - $2.5B"]++;
    });

    return counts;
  };

  const getHnwCounts = () => {
    const counts: Record<HnwRange, number> = {
      "85% to 100%": 0,
      "65% to 85%": 0,
      "45% to 65%": 0,
      "0% to 45%": 0,
    };

    store.firms.forEach((firm) => {
      const hnw = firm.hnwAumPercent;
      if (hnw >= 85) counts["85% to 100%"]++;
      else if (hnw >= 65) counts["65% to 85%"]++;
      else if (hnw >= 45) counts["45% to 65%"]++;
      else counts["0% to 45%"]++;
    });

    return counts;
  };

  const getScoreCounts = () => {
    const counts: Record<ScoreRange, number> = {
      high: 0,
      moderate: 0,
      low: 0,
    };

    store.firms.forEach((firm) => {
      const score = firm.acquisitionScore;
      if (score >= 70) counts.high++;
      else if (score >= 50) counts.moderate++;
      else counts.low++;
    });

    return counts;
  };

  const getCustodianCounts = () => {
    const counts: Record<Custodian, number> = {
      Schwab: 0,
      Fidelity: 0,
      "Goldman Sachs": 0,
      Other: 0,
    };

   

    store.firms.forEach((firm) => {
      const assignedCustodian: Custodian = assignedCustodians[firm.id % assignedCustodians.length];
      counts[assignedCustodian] += 1;
    });

    return counts;
  };

  const aumCounts = getAumCounts();
  const hnwCounts = getHnwCounts();
  const scoreCounts = getScoreCounts();
  const custodianCounts = getCustodianCounts();

  return (
    <div className="w-72 border-r border-[#e5e7eb] dark:border-gray-700 bg-white dark:bg-gray-900 flex flex-col h-full overflow-hidden">
      {/* Filter header */}
      <div className="px-4 pt-5 pb-3 border-b border-[#e5e7eb] dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground dark:text-gray-100 flex items-center gap-2">
            Filters
            {store.getActiveFilterCount() > 0 && (
              <span className="flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-[#5265F5] text-white text-[10px] font-bold">
                {store.getActiveFilterCount()}
              </span>
            )}
          </h2>
        </div>

        {/* Filter search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9ca3af]" />
          <input
            type="text"
            placeholder="Search by filter parameters"
            value={store.filterSearch}
            onChange={(e) => store.setFilterSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#f3f4f6] dark:bg-gray-800 text-xs text-foreground placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#5265F5]/30 transition-all border-none"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 overflow-hidden">
        <div className="p-4 space-y-3 pr-4">
          {/* Shortcuts */}
          <div className="rounded-lg border border-[#e5e7eb] dark:border-gray-700 bg-white dark:bg-gray-800 p-4 space-y-3">
            <h3 className="text-xs font-semibold text-[#6b7280] dark:text-gray-400 uppercase tracking-wider">
              Shortcuts
            </h3>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-foreground dark:text-gray-100">
                <Zap className="w-3.5 h-3.5 text-[#5265F5]" />
                Smart Search
              </span>
              <Switch checked={store.smartSearch} onCheckedChange={store.setSmartSearch} />
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-foreground dark:text-gray-100">
                <TrendingUp className="w-3.5 h-3.5 text-[#10b981]" />
                Outpaces market growth
              </span>
              <Switch checked={store.outpacesGrowth} onCheckedChange={store.setOutpacesGrowth} />
            </div>
          </div>

          {/* Firm Metrics Header */}
          <h3 className="text-xs font-semibold text-[#6b7280] dark:text-gray-400 uppercase tracking-wider pt-1">
            Firm Metrics
          </h3>

          {/* Total AUM */}
          <FilterCard
            title="Total AUM ($M)"
            count={store.selectedAumRanges.length}
            onClear={() => store.clearFilters("aum")}
          >
            <div className="space-y-2">
              {aumRanges.map((r) => (
                <label
                  key={r.label}
                  className="flex items-center justify-between group cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <Checkbox
                      checked={store.selectedAumRanges.includes(r.label)}
                      onCheckedChange={() => store.toggleAumRange(r.label)}
                    />
                    <span className="text-sm text-foreground group-hover:text-[#5265F5] transition-colors">
                      {r.label}
                    </span>
                  </span>
                  <span className="text-xs text-[#9ca3af]">({aumCounts[r.label].toLocaleString()})</span>
                </label>
              ))}
            </div>
          </FilterCard>

          {/* HNW Client AUM % */}
          <FilterCard
            title="HNW Client AUM %"
            count={store.selectedHnwRanges.length}
            onClear={() => store.clearFilters("hnw")}
          >
            <div className="space-y-2">
              {hnwRanges.map((r) => (
                <label
                  key={r.label}
                  className="flex items-center justify-between group cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <Checkbox
                      checked={store.selectedHnwRanges.includes(r.label)}
                      onCheckedChange={() => store.toggleHnwRange(r.label)}
                    />
                    <span className="text-sm text-foreground group-hover:text-[#5265F5] transition-colors">
                      {r.label}
                    </span>
                  </span>
                  <span className="text-xs text-[#9ca3af]">({hnwCounts[r.label].toLocaleString()})</span>
                </label>
              ))}
            </div>
          </FilterCard>

          {/* Acquisition Score */}
          <FilterCard
            title="Acquisition Score"
            count={store.selectedScoreRanges.length}
            onClear={() => store.clearFilters("score")}
          >
            <div className="space-y-2">
              {scoreRanges.map((r) => (
                <label
                  key={r.value}
                  className="flex items-center justify-between group cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <Checkbox
                      checked={store.selectedScoreRanges.includes(r.value)}
                      onCheckedChange={() => store.toggleScoreRange(r.value)}
                    />
                    <span className="text-sm text-foreground group-hover:text-[#5265F5] transition-colors">
                      {r.label}
                    </span>
                    <span className={`text-[10px] font-bold uppercase ${r.tagColor}`}>
                      {r.tag}
                    </span>
                  </span>
                  <span className="text-xs text-[#9ca3af]">({scoreCounts[r.value].toLocaleString()})</span>
                </label>
              ))}
            </div>
          </FilterCard>

          {/* Custodian */}
          <FilterCard
            title="Custodian"
            count={store.selectedCustodians.length}
            onClear={() => store.clearFilters("custodian")}
          >
            <div className="space-y-2">
              {custodians.map((c) => (
                <label
                  key={c.label}
                  className="flex items-center justify-between group cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <Checkbox
                      checked={store.selectedCustodians.includes(c.label)}
                      onCheckedChange={() => store.toggleCustodian(c.label)}
                    />
                    <span className="text-sm text-foreground group-hover:text-[#5265F5] transition-colors">
                      {c.label}
                    </span>
                  </span>
                  <span className="text-xs text-[#9ca3af]">({custodianCounts[c.label].toLocaleString()})</span>
                </label>
              ))}
            </div>
          </FilterCard>
        </div>
      </ScrollArea>
    </div>
  );
}
