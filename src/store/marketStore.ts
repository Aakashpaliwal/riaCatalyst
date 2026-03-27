import { create } from "zustand";
import type {
  MarketState,
  Custodian,
} from "@/types/market";
import { sampleFirms, allColumns } from "@/data/mockFirms";



export const useMarketStore = create<MarketState>((set, get) => ({
  firms: sampleFirms,
  searchQuery: "",
  filterSearch: "",

  selectedAumRanges: ["$50M - $100M", "$250M - $500M"],
  selectedHnwRanges: ["85% to 100%", "45% to 65%"],
  selectedScoreRanges: ["high", "moderate"],
  selectedCustodians: ["Schwab", "Fidelity"],

  smartSearch: true,
  outpacesGrowth: true,

  sortField: null,
  sortDirection: "desc",

  page: 1,
  itemsPerPage: 25,

  visibleColumns: allColumns,

  setSearchQuery: (q) => set({ searchQuery: q, page: 1 }),
  setFilterSearch: (q) => set({ filterSearch: q }),

  toggleAumRange: (r) =>
    set((s) => ({
      selectedAumRanges: s.selectedAumRanges.includes(r)
        ? s.selectedAumRanges.filter((x) => x !== r)
        : [...s.selectedAumRanges, r],
      page: 1,
    })),

  toggleHnwRange: (r) =>
    set((s) => ({
      selectedHnwRanges: s.selectedHnwRanges.includes(r)
        ? s.selectedHnwRanges.filter((x) => x !== r)
        : [...s.selectedHnwRanges, r],
      page: 1,
    })),

  toggleScoreRange: (r) =>
    set((s) => ({
      selectedScoreRanges: s.selectedScoreRanges.includes(r)
        ? s.selectedScoreRanges.filter((x) => x !== r)
        : [...s.selectedScoreRanges, r],
      page: 1,
    })),

  toggleCustodian: (c) =>
    set((s) => ({
      selectedCustodians: s.selectedCustodians.includes(c)
        ? s.selectedCustodians.filter((x) => x !== c)
        : [...s.selectedCustodians, c],
      page: 1,
    })),

  setSmartSearch: (v) => set({ smartSearch: v }),
  setOutpacesGrowth: (v) => set({ outpacesGrowth: v }),

  setSort: (field) =>
    set((s) => ({
      sortField: field,
      sortDirection: s.sortField === field && s.sortDirection === "desc" ? "asc" : "desc",
    })),

  setPage: (p) => set({ page: p }),
  setItemsPerPage: (n) => set({ itemsPerPage: n, page: 1 }),

  toggleColumn: (col) =>
    set((s) => {
      if (s.visibleColumns.includes(col)) {
        return { visibleColumns: s.visibleColumns.filter((c) => c !== col) };
      }

      const nextVisible = new Set([...s.visibleColumns, col]);
      return { visibleColumns: allColumns.filter((c) => nextVisible.has(c)) };
    }),

  clearFilters: (type) => {
    switch (type) {
      case "aum": set({ selectedAumRanges: [], page: 1 }); break;
      case "hnw": set({ selectedHnwRanges: [], page: 1 }); break;
      case "score": set({ selectedScoreRanges: [], page: 1 }); break;
      case "custodian": set({ selectedCustodians: [], page: 1 }); break;
    }
  },

  clearAllFilters: () =>
    set({
      searchQuery: "",
      filterSearch: "",
      selectedAumRanges: [],
      selectedHnwRanges: [],
      selectedScoreRanges: [],
      selectedCustodians: [],
      smartSearch: false,
      outpacesGrowth: false,
      page: 1,
    }),

  getFilteredFirms: () => {
    const s = get();
    let filtered = [...s.firms];

    // Search filter
    if (s.searchQuery) {
      const q = s.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (f) => f.name.toLowerCase().includes(q) || f.location.toLowerCase().includes(q) || f.decisionMaker.toLowerCase().includes(q)
      );
    }

    // AUM Range filter
    if (s.selectedAumRanges.length > 0) {
      filtered = filtered.filter((f) => {
        const aum = f.totalAum;
        return s.selectedAumRanges.some(range => {
          switch (range) {
            case "$0M - $50M": return aum < 50000000;
            case "$50M - $100M": return aum >= 50000000 && aum < 100000000;
            case "$250M - $500M": return aum >= 250000000 && aum < 500000000;
            case "$500M - $1B": return aum >= 500000000 && aum < 1000000000;
            case "$1B - $2.5B": return aum >= 1000000000;
            default: return false;
          }
        });
      });
    }

    // HNW Range filter
    if (s.selectedHnwRanges.length > 0) {
      filtered = filtered.filter((f) => {
        const hnw = f.hnwAumPercent;
        return s.selectedHnwRanges.some(range => {
          switch (range) {
            case "85% to 100%": return hnw >= 85;
            case "65% to 85%": return hnw >= 65 && hnw < 85;
            case "45% to 65%": return hnw >= 45 && hnw < 65;
            case "0% to 45%": return hnw < 45;
            default: return false;
          }
        });
      });
    }

    // Score Range filter
    if (s.selectedScoreRanges.length > 0) {
      filtered = filtered.filter((f) => {
        const score = f.acquisitionScore;
        return s.selectedScoreRanges.some(range => {
          switch (range) {
            case "high": return score >= 70;
            case "moderate": return score >= 50 && score < 70;
            case "low": return score < 50;
            default: return false;
          }
        });
      });
    }

    // Custodian filter (for now, randomly assign custodians to firms)
    if (s.selectedCustodians.length > 0) {
      filtered = filtered.filter((f) => {
        // Simple hash-based assignment for demo purposes
        const custodians = ["Schwab", "Fidelity", "Goldman Sachs", "Other"];
        const assignedCustodian = custodians[f.id % custodians.length];
        return s.selectedCustodians.includes(assignedCustodian as Custodian);
      });
    }

    // Sorting
    if (s.sortField) {
      filtered.sort((a, b) => {
        const aVal = a[s.sortField!];
        const bVal = b[s.sortField!];
        if (typeof aVal === "string" && typeof bVal === "string") {
          const cmp = aVal.localeCompare(bVal, undefined, { sensitivity: "base" });
          return s.sortDirection === "asc" ? cmp : -cmp;
        }

        const aNum = Number(aVal);
        const bNum = Number(bVal);
        const cmp = aNum - bNum;
        return s.sortDirection === "asc" ? cmp : -cmp;
      });
    }

    return filtered;
  },

  getTotalPages: () => {
    const s = get();
    return Math.ceil(s.getFilteredFirms().length / s.itemsPerPage);
  },

  getActiveFilterCount: () => {
    const s = get();
    return s.selectedAumRanges.length + s.selectedHnwRanges.length + s.selectedScoreRanges.length + s.selectedCustodians.length;
  },
}));
