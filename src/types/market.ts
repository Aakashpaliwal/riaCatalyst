export interface Firm {
  id: number;
  name: string;
  location: string;
  totalAum: number;
  advisors: number;
  hnwAumPercent: number;
  acquisitionScore: number;
  decisionMaker: string;
}

export type AumRange = "$0M - $50M" | "$50M - $100M" | "$250M - $500M" | "$500M - $1B" | "$1B - $2.5B";
export type HnwRange = "85% to 100%" | "65% to 85%" | "45% to 65%" | "0% to 45%";
export type ScoreRange = "high" | "moderate" | "low";
export type Custodian = "Schwab" | "Fidelity" | "Goldman Sachs" | "Other";

export type SortField =
  | "name"
  | "location"
  | "decisionMaker"
  | "totalAum"
  | "advisors"
  | "hnwAumPercent"
  | "acquisitionScore";
export type SortDirection = "asc" | "desc";

export interface MarketState {
  firms: Firm[];
  searchQuery: string;
  filterSearch: string;

  // Filters
  selectedAumRanges: AumRange[];
  selectedHnwRanges: HnwRange[];
  selectedScoreRanges: ScoreRange[];
  selectedCustodians: Custodian[];

  // Shortcuts
  smartSearch: boolean;
  outpacesGrowth: boolean;

  // Sorting
  sortField: SortField | null;
  sortDirection: SortDirection;

  // Pagination
  page: number;
  itemsPerPage: number;

  // Column visibility
  visibleColumns: string[];

  // Actions
  setSearchQuery: (q: string) => void;
  setFilterSearch: (q: string) => void;
  toggleAumRange: (r: AumRange) => void;
  toggleHnwRange: (r: HnwRange) => void;
  toggleScoreRange: (r: ScoreRange) => void;
  toggleCustodian: (c: Custodian) => void;
  setSmartSearch: (v: boolean) => void;
  setOutpacesGrowth: (v: boolean) => void;
  setSort: (field: SortField) => void;
  setPage: (p: number) => void;
  setItemsPerPage: (n: number) => void;
  toggleColumn: (col: string) => void;
  clearFilters: (type: "aum" | "hnw" | "score" | "custodian") => void;
  clearAllFilters: () => void;
  getFilteredFirms: () => Firm[];
  getTotalPages: () => number;
  getActiveFilterCount: () => number;
}
