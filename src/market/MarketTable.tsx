import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Search, Bookmark, Columns3, Download, SearchX } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useMarketStore, type SortField } from "@/store/marketStore";
import { toast } from "sonner";

const columnLabels: Record<string, string> = {
  name: "Firm Name",
  location: "Location",
  totalAum: "Total AUM ($)",
  advisors: "Advisors",
  hnwAumPercent: "HNW AUM (%)",
  acquisitionScore: "Acquisition Score",
  decisionMaker: "Decision Maker",
};

const sortableColumns: SortField[] = [
  "name",
  "location",
  "decisionMaker",
  "totalAum",
  "advisors",
  "hnwAumPercent",
  "acquisitionScore",
];

function ScoreBadge({ score }: { score: number }) {
  let bg = "bg-[#fee2e2] text-[#dc2626]";
  if (score >= 70) bg = "bg-[#d1fae5] text-[#047857]";
  else if (score >= 50) bg = "bg-[#fef3c7] text-[#d97706]";

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center justify-center w-10 h-7 rounded-md text-sm font-bold ${bg}`}
    >
      {score}
    </motion.span>
  );
}

function formatAum(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}`;
  return `$${value}`;
}

export default function MarketTable() {
  const store = useMarketStore();
  const [isSearchSaved, setIsSearchSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const filteredFirms = store.getFilteredFirms();
  const totalPages = store.getTotalPages();
  const startIdx = (store.page - 1) * store.itemsPerPage;
  const paginatedFirms = filteredFirms.slice(startIdx, startIdx + store.itemsPerPage);
  const totalItems = filteredFirms.length;

  useEffect(() => {
    setIsLoading(true);
    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [
    store.searchQuery,
    store.selectedAumRanges,
    store.selectedHnwRanges,
    store.selectedScoreRanges,
    store.selectedCustodians,
    store.page,
    store.itemsPerPage,
  ]);

  const handleSaveSearch = () => {
    const newSavedState = !isSearchSaved;
    setIsSearchSaved(newSavedState);
    toast.success(newSavedState ? "Search saved successfully!" : "Search unsaved!", { position: "top-center" });
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (!sortableColumns.includes(field as SortField)) return null;
    if (store.sortField === field) {
      return store.sortDirection === "asc" ? (
        <ArrowUp className="w-3.5 h-3.5 text-[#5265F5]" />
      ) : (
        <ArrowDown className="w-3.5 h-3.5 text-[#5265F5]" />
      );
    }
    // Show an "available to sort" indicator even when not active.
    return <ArrowUpDown className="w-3.5 h-3.5 text-[#9ca3af] opacity-70 group-hover:opacity-100 transition-opacity" />;
  };

  const showEmptyState = !isLoading && paginatedFirms.length === 0;

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      {/* Top bar */}
      <div className="px-6 py-4 border-b border-[#e5e7eb] bg-white flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h4 className="text-xl font-semibold text-foreground">Market Insights</h4>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
              <input
                type="text"
                placeholder="Search by company name..."
                value={store.searchQuery}
                onChange={(e) => store.setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-72 rounded-lg bg-[#f3f4f6] text-sm text-foreground placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#5265F5]/30 transition-all border-none"
              />
            </div>
            <Button
              variant="ghost"
              size="lg"
              onClick={handleSaveSearch}
              className={`font-medium gap-1.5 border transition-all duration-200 cursor-pointer ${
                isSearchSaved
                  ? "border-[#5265F5] bg-[#5265F5] text-white"
                  : "border-[#e5e7eb] text-[#5265F5] hover:border-[#5265F5] hover:bg-[#5265F5] hover:text-white"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSearchSaved ? "fill-current" : ""}`} />
              Save Search
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 text-[#6b7280] border-[#e5e7eb]">
                  <Columns3 className="w-4 h-4" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {Object.entries(columnLabels).map(([key, label]) => (
                  <DropdownMenuCheckboxItem
                    key={key}
                    checked={store.visibleColumns.includes(key)}
                    onCheckedChange={() => store.toggleColumn(key)}
                  >
                    {label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="sm" className="gap-1.5 text-[#6b7280] border-[#e5e7eb]">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="flex-1 min-h-0 px-6 py-4 bg-[#f1f3f8]">
        <ScrollArea className="h-full w-full rounded-lg border border-[#e5e7eb] bg-white">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-white">
            <TableRow className="bg-white hover:bg-white">
              {store.visibleColumns.map((col) => (
                <TableHead
                  key={col}
                  className={`sticky top-0 z-20 bg-white text-xs font-semibold uppercase tracking-wider text-[#6b7280] whitespace-nowrap ${
                    sortableColumns.includes(col as SortField)
                      ? "cursor-pointer group select-none hover:text-foreground transition-colors"
                      : ""
                  }`}
                  onClick={() => {
                    if (sortableColumns.includes(col as SortField)) {
                      store.setSort(col as SortField);
                    }
                  }}
                >
                  <span className="flex items-center gap-1.5">
                    {columnLabels[col]}
                    <SortIcon field={col} />
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
            <TableBody>
            {isLoading &&
              Array.from({ length: Math.min(store.itemsPerPage, 8) }).map((_, idx) => (
                <TableRow key={`skeleton-${idx}`} className="border-b border-[#e5e7eb]">
                  {store.visibleColumns.includes("name") && (
                    <TableCell>
                      <Skeleton className="h-4 w-44" />
                    </TableCell>
                  )}
                  {store.visibleColumns.includes("location") && (
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                  )}
                  {store.visibleColumns.includes("totalAum") && (
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                  )}
                  {store.visibleColumns.includes("advisors") && (
                    <TableCell>
                      <Skeleton className="h-4 w-12" />
                    </TableCell>
                  )}
                  {store.visibleColumns.includes("hnwAumPercent") && (
                    <TableCell>
                      <Skeleton className="h-4 w-14" />
                    </TableCell>
                  )}
                  {store.visibleColumns.includes("acquisitionScore") && (
                    <TableCell>
                      <Skeleton className="h-7 w-10 rounded-md" />
                    </TableCell>
                  )}
                  {store.visibleColumns.includes("decisionMaker") && (
                    <TableCell>
                      <Skeleton className="h-4 w-36" />
                    </TableCell>
                  )}
                </TableRow>
              ))}

            {!isLoading && paginatedFirms.map((firm, idx) => (
              <motion.tr
                key={firm.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: idx * 0.02 }}
                onClick={() => toast(`${firm.name} • ${firm.location}`, { position: "top-center" })}
                className="border-b border-[#e5e7eb] hover:bg-[#f3f4f6] transition-colors cursor-pointer group"
              >
                {store.visibleColumns.includes("name") && (
                  <TableCell className="font-medium text-foreground whitespace-nowrap text-sm text-[#5265F5]">
                    {firm.name}
                  </TableCell>
                )}
                {store.visibleColumns.includes("location") && (
                  <TableCell className="text-[#6b7280] whitespace-nowrap text-sm">
                    {firm.location}
                  </TableCell>
                )}
                {store.visibleColumns.includes("totalAum") && (
                  <TableCell className="text-foreground font-medium tabular-nums text-sm">
                    {formatAum(firm.totalAum)}
                  </TableCell>
                )}
                {store.visibleColumns.includes("advisors") && (
                  <TableCell className="text-foreground tabular-nums text-sm">
                    {firm.advisors}
                  </TableCell>
                )}
                {store.visibleColumns.includes("hnwAumPercent") && (
                  <TableCell className="text-foreground tabular-nums text-sm">
                    {firm.hnwAumPercent}%
                  </TableCell>
                )}
                {store.visibleColumns.includes("acquisitionScore") && (
                  <TableCell>
                    <ScoreBadge score={firm.acquisitionScore} />
                  </TableCell>
                )}
                {store.visibleColumns.includes("decisionMaker") && (
                  <TableCell className="text-foreground whitespace-nowrap text-sm">
                    {firm.decisionMaker}
                  </TableCell>
                )}
              </motion.tr>
            ))}

            {showEmptyState && (
              <TableRow>
                <TableCell colSpan={Math.max(store.visibleColumns.length, 1)} className="py-16">
                  <div className="flex flex-col items-center justify-center text-center gap-4">
                    <div className="rounded-full p-3 bg-[#f3f4f6] text-[#6b7280]">
                      <SearchX className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">No firms match your current filters</p>
                      <p className="text-xs text-[#6b7280] mt-1">Try broadening your search or reset all filters.</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => store.clearAllFilters()}
                      className="border-[#e5e7eb]"
                    >
                      Clear All Filters
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {/* Pagination */}
      <div className="px-6 py-3 border-t border-[#e5e7eb] bg-white flex-shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm text-[#6b7280]">
          <Select
            value={String(store.itemsPerPage)}
            onValueChange={(v) => store.setItemsPerPage(Number(v))}
          >
            <SelectTrigger className="w-[70px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span>items per page</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-[#6b7280]">
          <span>
            Page {store.page} of {totalPages || 1}
          </span>
          <span className="text-xs">({isLoading ? "Loading..." : `${totalItems} results`})</span>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={store.page <= 1}
            onClick={() => store.setPage(store.page - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={store.page >= totalPages}
            onClick={() => store.setPage(store.page + 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
    </div>
      </div>
    
  );
}
