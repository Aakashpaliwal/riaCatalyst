import { create } from "zustand";

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

export type SortField = "totalAum" | "advisors" | "hnwAumPercent" | "acquisitionScore";
export type SortDirection = "asc" | "desc";

interface MarketState {
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
  getFilteredFirms: () => Firm[];
  getTotalPages: () => number;
  getActiveFilterCount: () => number;
}

const sampleFirms: Firm[] = [
  // $0M - $50M Range (25 firms)
  { id: 1, name: "Bright Future Strategies", location: "Riverside, CA", totalAum: 8901234, advisors: 42, hnwAumPercent: 42, acquisitionScore: 71, decisionMaker: "Alex Johnson" },
  { id: 2, name: "Nexus Technology Partners", location: "Cedar Falls, IA", totalAum: 2600000, advisors: 50, hnwAumPercent: 50, acquisitionScore: 95, decisionMaker: "Michael Brown" },
  { id: 3, name: "Pinnacle Consulting Group", location: "Fairfield, OH", totalAum: 2900000, advisors: 60, hnwAumPercent: 80, acquisitionScore: 32, decisionMaker: "Daniel Anderson" },
  { id: 4, name: "Quantum Dynamic Solutions", location: "Salem, OR", totalAum: 3100000, advisors: 70, hnwAumPercent: 70, acquisitionScore: 98, decisionMaker: "James Jackson" },
  { id: 5, name: "Synergy Enterprise Mgmt", location: "Harrisonburg, VA", totalAum: 3000000, advisors: 65, hnwAumPercent: 65, acquisitionScore: 41, decisionMaker: "Laura Thomas" },
  { id: 6, name: "Vertex Strategic Advisors", location: "Springfield, IL", totalAum: 2550000, advisors: 30, hnwAumPercent: 30, acquisitionScore: 92, decisionMaker: "David Wilson" },
  { id: 7, name: "Elysium Venture Capital", location: "Dover, DE", totalAum: 3200000, advisors: 75, hnwAumPercent: 75, acquisitionScore: 22, decisionMaker: "Megan White" },
  { id: 8, name: "Horizon Analytical Group", location: "Burlington, VT", totalAum: 2800000, advisors: 35, hnwAumPercent: 35, acquisitionScore: 99, decisionMaker: "Sarah Davis" },
  { id: 9, name: "Catalyst Innovation Labs", location: "Lakewood, CO", totalAum: 2650000, advisors: 55, hnwAumPercent: 55, acquisitionScore: 97, decisionMaker: "Jessica Taylor" },
  { id: 10, name: "Summit Solutions Corp", location: "Maplewood, NJ", totalAum: 2750000, advisors: 45, hnwAumPercent: 45, acquisitionScore: 70, decisionMaker: "Emily Smith" },
  { id: 11, name: "Infinity Group Holdings", location: "Troy, MI", totalAum: 3300000, advisors: 80, hnwAumPercent: 80, acquisitionScore: 69, decisionMaker: "Christopher Harris" },
  { id: 12, name: "Elemental Tech Solutions", location: "Glenview, IL", totalAum: 3400000, advisors: 85, hnwAumPercent: 85, acquisitionScore: 97, decisionMaker: "Ashley Martin" },
  { id: 13, name: "Elemental Tech Partners", location: "Glenview, IL", totalAum: 3400000, advisors: 85, hnwAumPercent: 85, acquisitionScore: 97, decisionMaker: "Ashley Martin" },
  { id: 14, name: "Apex Wealth Management", location: "Austin, TX", totalAum: 5200000, advisors: 92, hnwAumPercent: 72, acquisitionScore: 88, decisionMaker: "Robert Clark" },
  { id: 15, name: "Meridian Capital Partners", location: "Boston, MA", totalAum: 7800000, advisors: 110, hnwAumPercent: 91, acquisitionScore: 76, decisionMaker: "Susan Lee" },
  { id: 16, name: "Vanguard Advisory Group", location: "Seattle, WA", totalAum: 1200000, advisors: 22, hnwAumPercent: 38, acquisitionScore: 54, decisionMaker: "Thomas Green" },
  { id: 17, name: "Emerald Coast Advisors", location: "Destin, FL", totalAum: 980000, advisors: 18, hnwAumPercent: 62, acquisitionScore: 43, decisionMaker: "Karen Wright" },
  { id: 18, name: "Pacific Rim Investments", location: "San Diego, CA", totalAum: 4500000, advisors: 68, hnwAumPercent: 78, acquisitionScore: 81, decisionMaker: "Jason Park" },
  { id: 19, name: "Iron Bridge Financial", location: "Pittsburgh, PA", totalAum: 1900000, advisors: 31, hnwAumPercent: 44, acquisitionScore: 67, decisionMaker: "Linda Hall" },
  { id: 20, name: "Silver Oak Wealth Group", location: "Charlotte, NC", totalAum: 3600000, advisors: 57, hnwAumPercent: 69, acquisitionScore: 83, decisionMaker: "Mark Thompson" },
  { id: 21, name: "Atlas Global Partners", location: "New York, NY", totalAum: 12000000, advisors: 145, hnwAumPercent: 95, acquisitionScore: 91, decisionMaker: "Victoria Chen" },
  { id: 22, name: "Redwood Capital Mgmt", location: "Portland, OR", totalAum: 2100000, advisors: 38, hnwAumPercent: 52, acquisitionScore: 74, decisionMaker: "Daniel Brooks" },
  { id: 23, name: "Lighthouse Advisory", location: "Savannah, GA", totalAum: 870000, advisors: 15, hnwAumPercent: 33, acquisitionScore: 29, decisionMaker: "Amy Foster" },
  { id: 24, name: "Granite Peak Holdings", location: "Denver, CO", totalAum: 6100000, advisors: 88, hnwAumPercent: 81, acquisitionScore: 86, decisionMaker: "Richard Young" },
  { id: 25, name: "Cascade Financial Group", location: "Tacoma, WA", totalAum: 1500000, advisors: 27, hnwAumPercent: 47, acquisitionScore: 58, decisionMaker: "Nancy King" },
  { id: 26, name: "Blue Ridge Advisors", location: "Asheville, NC", totalAum: 4200000, advisors: 63, hnwAumPercent: 76, acquisitionScore: 79, decisionMaker: "Steven Miller" },
  { id: 27, name: "Mountain View Capital", location: "Boulder, CO", totalAum: 3800000, advisors: 58, hnwAumPercent: 71, acquisitionScore: 85, decisionMaker: "Rachel Garcia" },
  { id: 28, name: "Sunset Financial Services", location: "Santa Barbara, CA", totalAum: 5600000, advisors: 95, hnwAumPercent: 84, acquisitionScore: 77, decisionMaker: "Kevin Rodriguez" },
  { id: 29, name: "Prairie Wealth Partners", location: "Omaha, NE", totalAum: 2400000, advisors: 42, hnwAumPercent: 48, acquisitionScore: 63, decisionMaker: "Lisa Martinez" },
  { id: 30, name: "Coastal Investment Group", location: "Charleston, SC", totalAum: 4700000, advisors: 72, hnwAumPercent: 79, acquisitionScore: 82, decisionMaker: "Brian Wilson" },

  // $50M - $100M Range (25 firms)
  { id: 31, name: "Liberty Financial Advisors", location: "Philadelphia, PA", totalAum: 65000000, advisors: 125, hnwAumPercent: 88, acquisitionScore: 94, decisionMaker: "Jennifer Davis" },
  { id: 32, name: "Heritage Wealth Management", location: "Dallas, TX", totalAum: 72000000, advisors: 138, hnwAumPercent: 92, acquisitionScore: 89, decisionMaker: "Matthew Johnson" },
  { id: 33, name: "Oakwood Investment Partners", location: "Minneapolis, MN", totalAum: 58000000, advisors: 112, hnwAumPercent: 85, acquisitionScore: 91, decisionMaker: "Amanda White" },
  { id: 34, name: "Sterling Capital Advisors", location: "Atlanta, GA", totalAum: 81000000, advisors: 152, hnwAumPercent: 94, acquisitionScore: 96, decisionMaker: "David Brown" },
  { id: 35, name: "Golden Gate Financial", location: "San Francisco, CA", totalAum: 95000000, advisors: 178, hnwAumPercent: 96, acquisitionScore: 98, decisionMaker: "Michelle Chen" },
  { id: 36, name: "Evergreen Wealth Partners", location: "Seattle, WA", totalAum: 67000000, advisors: 128, hnwAumPercent: 89, acquisitionScore: 87, decisionMaker: "Robert Taylor" },
  { id: 37, name: "Diamond Financial Group", location: "Chicago, IL", totalAum: 88000000, advisors: 165, hnwAumPercent: 95, acquisitionScore: 97, decisionMaker: "Sarah Anderson" },
  { id: 38, name: "Summit Ridge Advisors", location: "Denver, CO", totalAum: 62000000, advisors: 118, hnwAumPercent: 87, acquisitionScore: 84, decisionMaker: "James Wilson" },
  { id: 39, name: "Crystal Lake Investments", location: "Madison, WI", totalAum: 54000000, advisors: 98, hnwAumPercent: 82, acquisitionScore: 78, decisionMaker: "Lisa Thompson" },
  { id: 40, name: "Royal Oak Financial", location: "Detroit, MI", totalAum: 71000000, advisors: 135, hnwAumPercent: 91, acquisitionScore: 88, decisionMaker: "Michael Davis" },
  { id: 41, name: "Maple Leaf Advisors", location: "Toronto, ON", totalAum: 68000000, advisors: 132, hnwAumPercent: 90, acquisitionScore: 86, decisionMaker: "Karen Smith" },
  { id: 42, name: "Silver Fox Wealth Mgmt", location: "Vancouver, BC", totalAum: 75000000, advisors: 142, hnwAumPercent: 93, acquisitionScore: 92, decisionMaker: "Paul Johnson" },
  { id: 43, name: "Northern Lights Capital", location: "Edmonton, AB", totalAum: 59000000, advisors: 115, hnwAumPercent: 86, acquisitionScore: 81, decisionMaker: "Emma Brown" },
  { id: 44, name: "Pacific Northwest Advisors", location: "Portland, OR", totalAum: 63000000, advisors: 120, hnwAumPercent: 88, acquisitionScore: 85, decisionMaker: "Mark Wilson" },
  { id: 45, name: "Mountain State Financial", location: "Boise, ID", totalAum: 52000000, advisors: 95, hnwAumPercent: 80, acquisitionScore: 76, decisionMaker: "Jessica Lee" },
  { id: 46, name: "Desert Rose Investments", location: "Phoenix, AZ", totalAum: 78000000, advisors: 148, hnwAumPercent: 94, acquisitionScore: 93, decisionMaker: "Thomas Garcia" },
  { id: 47, name: "Gulf Coast Advisors", location: "Houston, TX", totalAum: 85000000, advisors: 160, hnwAumPercent: 95, acquisitionScore: 96, decisionMaker: "Maria Rodriguez" },
  { id: 48, name: "Appalachian Wealth Group", location: "Nashville, TN", totalAum: 56000000, advisors: 105, hnwAumPercent: 83, acquisitionScore: 79, decisionMaker: "William Martinez" },
  { id: 49, name: "Great Lakes Financial", location: "Cleveland, OH", totalAum: 61000000, advisors: 117, hnwAumPercent: 87, acquisitionScore: 83, decisionMaker: "Patricia Taylor" },
  { id: 50, name: "Sun Belt Advisors", location: "Orlando, FL", totalAum: 73000000, advisors: 140, hnwAumPercent: 92, acquisitionScore: 90, decisionMaker: "Christopher Anderson" },
  { id: 51, name: "Plains Capital Partners", location: "Kansas City, MO", totalAum: 57000000, advisors: 108, hnwAumPercent: 84, acquisitionScore: 80, decisionMaker: "Nancy Thomas" },
  { id: 52, name: "Rocky Mountain Wealth", location: "Salt Lake City, UT", totalAum: 64000000, advisors: 122, hnwAumPercent: 89, acquisitionScore: 86, decisionMaker: "Daniel Jackson" },
  { id: 53, name: "Bay Area Financial Group", location: "San Jose, CA", totalAum: 92000000, advisors: 172, hnwAumPercent: 96, acquisitionScore: 97, decisionMaker: "Helen White" },
  { id: 54, name: "Heartland Advisors", location: "Indianapolis, IN", totalAum: 55000000, advisors: 102, hnwAumPercent: 81, acquisitionScore: 77, decisionMaker: "George Harris" },
  { id: 55, name: "Southern Cross Financial", location: "Miami, FL", totalAum: 69000000, advisors: 130, hnwAumPercent: 90, acquisitionScore: 87, decisionMaker: "Sandra Clark" },

  // $250M - $500M Range (25 firms)
  { id: 56, name: "Empire State Investments", location: "New York, NY", totalAum: 350000000, advisors: 285, hnwAumPercent: 97, acquisitionScore: 99, decisionMaker: "Alexander Chen" },
  { id: 57, name: "Golden State Capital", location: "Los Angeles, CA", totalAum: 420000000, advisors: 340, hnwAumPercent: 98, acquisitionScore: 100, decisionMaker: "Victoria Rodriguez" },
  { id: 58, name: "Windy City Wealth Mgmt", location: "Chicago, IL", totalAum: 380000000, advisors: 310, hnwAumPercent: 96, acquisitionScore: 98, decisionMaker: "Richard Thompson" },
  { id: 59, name: "Texas Star Financial", location: "Houston, TX", totalAum: 410000000, advisors: 335, hnwAumPercent: 97, acquisitionScore: 99, decisionMaker: "Margaret Garcia" },
  { id: 60, name: "Magnolia State Advisors", location: "Jackson, MS", totalAum: 280000000, advisors: 225, hnwAumPercent: 89, acquisitionScore: 85, decisionMaker: "Charles Wilson" },
  { id: 61, name: "Everglades Investment Group", location: "Miami, FL", totalAum: 360000000, advisors: 295, hnwAumPercent: 95, acquisitionScore: 96, decisionMaker: "Barbara Martinez" },
  { id: 62, name: "Cascade Wealth Partners", location: "Seattle, WA", totalAum: 330000000, advisors: 270, hnwAumPercent: 94, acquisitionScore: 95, decisionMaker: "Joseph Anderson" },
  { id: 63, name: "Mile High Financial", location: "Denver, CO", totalAum: 310000000, advisors: 250, hnwAumPercent: 92, acquisitionScore: 93, decisionMaker: "Dorothy Taylor" },
  { id: 64, name: "Sunshine State Capital", location: "Tampa, FL", totalAum: 290000000, advisors: 235, hnwAumPercent: 90, acquisitionScore: 88, decisionMaker: "Thomas Jackson" },
  { id: 65, name: "Lone Star Advisors", location: "Austin, TX", totalAum: 370000000, advisors: 300, hnwAumPercent: 95, acquisitionScore: 97, decisionMaker: "Linda White" },
  { id: 66, name: "Bear State Investments", location: "Sacramento, CA", totalAum: 320000000, advisors: 260, hnwAumPercent: 93, acquisitionScore: 94, decisionMaker: "Christopher Harris" },
  { id: 67, name: "Prairie State Financial", location: "Springfield, IL", totalAum: 270000000, advisors: 220, hnwAumPercent: 88, acquisitionScore: 84, decisionMaker: "Patricia Clark" },
  { id: 68, name: "Volunteer State Wealth", location: "Memphis, TN", totalAum: 300000000, advisors: 245, hnwAumPercent: 91, acquisitionScore: 89, decisionMaker: "Donald Lewis" },
  { id: 69, name: "Granite State Advisors", location: "Concord, NH", totalAum: 260000000, advisors: 210, hnwAumPercent: 87, acquisitionScore: 83, decisionMaker: "Betty Robinson" },
  { id: 70, name: "Ocean State Capital", location: "Providence, RI", totalAum: 280000000, advisors: 230, hnwAumPercent: 89, acquisitionScore: 86, decisionMaker: "Ronald Walker" },
  { id: 71, name: "Pine Tree Financial", location: "Augusta, ME", totalAum: 250000000, advisors: 200, hnwAumPercent: 86, acquisitionScore: 82, decisionMaker: "Helen Hall" },
  { id: 72, name: "Centennial State Wealth", location: "Boulder, CO", totalAum: 340000000, advisors: 275, hnwAumPercent: 94, acquisitionScore: 95, decisionMaker: "Jason Allen" },
  { id: 73, name: "First State Investments", location: "Dover, DE", totalAum: 290000000, advisors: 240, hnwAumPercent: 90, acquisitionScore: 87, decisionMaker: "Sharon Young" },
  { id: 74, name: "Diamond State Advisors", location: "Wilmington, DE", totalAum: 310000000, advisors: 255, hnwAumPercent: 92, acquisitionScore: 91, decisionMaker: "Anthony Hernandez" },
  { id: 75, name: "Old Dominion Wealth", location: "Richmond, VA", totalAum: 330000000, advisors: 265, hnwAumPercent: 93, acquisitionScore: 92, decisionMaker: "Deborah King" },
  { id: 76, name: "Commonwealth Financial", location: "Boston, MA", totalAum: 390000000, advisors: 315, hnwAumPercent: 96, acquisitionScore: 97, decisionMaker: "Larry Wright" },
  { id: 77, name: "Keystone State Capital", location: "Harrisburg, PA", totalAum: 350000000, advisors: 285, hnwAumPercent: 94, acquisitionScore: 93, decisionMaker: "Frances Lopez" },
  { id: 78, name: "Garden State Advisors", location: "Trenton, NJ", totalAum: 360000000, advisors: 290, hnwAumPercent: 95, acquisitionScore: 94, decisionMaker: "Gary Hill" },
  { id: 79, name: "Empire State Wealth Mgmt", location: "Albany, NY", totalAum: 380000000, advisors: 305, hnwAumPercent: 96, acquisitionScore: 96, decisionMaker: "Anna Green" },
  { id: 80, name: "Show Me State Financial", location: "Jefferson City, MO", totalAum: 270000000, advisors: 215, hnwAumPercent: 88, acquisitionScore: 85, decisionMaker: "Ralph Adams" },

  // $500M - $1B Range (15 firms)
  { id: 81, name: "Wall Street Elite Advisors", location: "New York, NY", totalAum: 750000000, advisors: 450, hnwAumPercent: 98, acquisitionScore: 100, decisionMaker: "Jonathan Mitchell" },
  { id: 82, name: "Silicon Valley Capital", location: "Palo Alto, CA", totalAum: 820000000, advisors: 490, hnwAumPercent: 99, acquisitionScore: 100, decisionMaker: "Rebecca Turner" },
  { id: 83, name: "Beverly Hills Wealth Mgmt", location: "Los Angeles, CA", totalAum: 680000000, advisors: 410, hnwAumPercent: 97, acquisitionScore: 99, decisionMaker: "Stephen Campbell" },
  { id: 84, name: "Magnificent Mile Financial", location: "Chicago, IL", totalAum: 720000000, advisors: 435, hnwAumPercent: 97, acquisitionScore: 99, decisionMaker: "Laura Parker" },
  { id: 85, name: "Texas Tower Advisors", location: "Dallas, TX", totalAum: 790000000, advisors: 475, hnwAumPercent: 98, acquisitionScore: 100, decisionMaker: "Edward Evans" },
  { id: 86, name: "Golden Gate Bridge Capital", location: "San Francisco, CA", totalAum: 850000000, advisors: 510, hnwAumPercent: 99, acquisitionScore: 100, decisionMaker: "Martha Edwards" },
  { id: 87, name: "Space Needle Wealth", location: "Seattle, WA", totalAum: 650000000, advisors: 390, hnwAumPercent: 96, acquisitionScore: 98, decisionMaker: "Bruce Collins" },
  { id: 88, name: "Mile High Capital Partners", location: "Denver, CO", totalAum: 620000000, advisors: 375, hnwAumPercent: 95, acquisitionScore: 97, decisionMaker: "Diane Stewart" },
  { id: 89, name: "Sunshine State Premier", location: "Orlando, FL", totalAum: 580000000, advisors: 350, hnwAumPercent: 94, acquisitionScore: 96, decisionMaker: "Alan Sanchez" },
  { id: 90, name: "Lone Star Premier Advisors", location: "Austin, TX", totalAum: 710000000, advisors: 425, hnwAumPercent: 97, acquisitionScore: 99, decisionMaker: "Frances Morris" },
  { id: 91, name: "Bear State Elite", location: "Sacramento, CA", totalAum: 640000000, advisors: 385, hnwAumPercent: 95, acquisitionScore: 97, decisionMaker: "Philip Rogers" },
  { id: 92, name: "Prairie State Premier", location: "Springfield, IL", totalAum: 560000000, advisors: 335, hnwAumPercent: 93, acquisitionScore: 95, decisionMaker: "Gloria Reed" },
  { id: 93, name: "Volunteer State Elite", location: "Nashville, TN", totalAum: 600000000, advisors: 360, hnwAumPercent: 94, acquisitionScore: 96, decisionMaker: "Harry Cook" },
  { id: 94, name: "Granite State Premier", location: "Concord, NH", totalAum: 540000000, advisors: 325, hnwAumPercent: 92, acquisitionScore: 94, decisionMaker: "Irene Morgan" },
  { id: 95, name: "Ocean State Elite", location: "Providence, RI", totalAum: 570000000, advisors: 345, hnwAumPercent: 93, acquisitionScore: 95, decisionMaker: "Jack Bell" },

  // $1B+ Range (10 firms)
  { id: 96, name: "Global Titan Advisors", location: "New York, NY", totalAum: 2500000000, advisors: 1200, hnwAumPercent: 99, acquisitionScore: 100, decisionMaker: "William Foster" },
  { id: 97, name: "Pacific Rim Global", location: "San Francisco, CA", totalAum: 1800000000, advisors: 850, hnwAumPercent: 98, acquisitionScore: 100, decisionMaker: "Elizabeth Butler" },
  { id: 98, name: "Continental Wealth Empire", location: "Chicago, IL", totalAum: 2200000000, advisors: 1050, hnwAumPercent: 99, acquisitionScore: 100, decisionMaker: "David Simmons" },
  { id: 99, name: "American Financial Dynasty", location: "Boston, MA", totalAum: 1600000000, advisors: 780, hnwAumPercent: 97, acquisitionScore: 99, decisionMaker: "Margaret Hughes" },
  { id: 100, name: "Liberty Bell Global Advisors", location: "Philadelphia, PA", totalAum: 1400000000, advisors: 680, hnwAumPercent: 96, acquisitionScore: 98, decisionMaker: "Charles Russell" },
  { id: 101, name: "Golden State Global", location: "Los Angeles, CA", totalAum: 2100000000, advisors: 1000, hnwAumPercent: 98, acquisitionScore: 100, decisionMaker: "Sandra Ortiz" },
  { id: 102, name: "Texas Global Partners", location: "Houston, TX", totalAum: 1900000000, advisors: 920, hnwAumPercent: 98, acquisitionScore: 99, decisionMaker: "Joseph Bennett" },
  { id: 103, name: "Florida Global Wealth", location: "Miami, FL", totalAum: 1700000000, advisors: 820, hnwAumPercent: 97, acquisitionScore: 99, decisionMaker: "Dorothy Ward" },
  { id: 104, name: "Seattle Global Advisors", location: "Seattle, WA", totalAum: 1500000000, advisors: 720, hnwAumPercent: 96, acquisitionScore: 98, decisionMaker: "Thomas Cox" },
  { id: 105, name: "Denver Global Partners", location: "Denver, CO", totalAum: 1300000000, advisors: 620, hnwAumPercent: 95, acquisitionScore: 97, decisionMaker: "Helen Diaz" },
];

const allColumns = ["name", "location", "totalAum", "advisors", "hnwAumPercent", "acquisitionScore", "decisionMaker"];

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
    set((s) => ({
      visibleColumns: s.visibleColumns.includes(col)
        ? s.visibleColumns.filter((c) => c !== col)
        : [...s.visibleColumns, col],
    })),

  clearFilters: (type) => {
    switch (type) {
      case "aum": set({ selectedAumRanges: [], page: 1 }); break;
      case "hnw": set({ selectedHnwRanges: [], page: 1 }); break;
      case "score": set({ selectedScoreRanges: [], page: 1 }); break;
      case "custodian": set({ selectedCustodians: [], page: 1 }); break;
    }
  },

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
        return s.sortDirection === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
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
