# RIA Catalyst - Market Screener Prototype

A production-ready frontend prototype for the RIA Catalyst Market Screener, built with React, Vite, Tailwind CSS, and shadcn/ui.

## 🚀 Architectural Decisions

1. **State Management (Zustand):** Implemented a centralized `marketStore` to handle complex multi-parameter filtering, sorting, and pagination. This keeps the React components strictly focused on rendering rather than business logic.
2. **Component Isolation:** Separated the `FilterSidebar`, `MarketTable`, and navigation into distinct feature modules (`src/market`) while keeping primitive UI building blocks segregated in `src/components/ui`.
3. **Strict Type Contracts:** Defined a robust `Firm` interface (`src/types`) to ensure absolute type safety across the application, anticipating future GraphQL/REST API integration.
4. **Deterministic Mocking:** Used modulo-based hashing to dynamically assign relational data (like Custodians) to the mock dataset, keeping the source data lightweight while ensuring consistent renders.

## 💡 Trade-offs & Future Scaling

* **Filter Memoization:** Currently, derived state (filtered & sorted firms) is calculated on the fly within the Zustand store. For the current mock dataset, this is highly performant. When scaling to 50,000+ RIA firms, I would offload this to a custom `useMemo` hook or implement server-side filtering via React Query to prevent main-thread blocking.
* **Virtualization:** For a production screener handling massive lists, I would implement `@tanstack/react-virtual` to render only the visible table rows and protect DOM performance.

## 🛠️ How to Run Locally

```bash
npm install
npm run dev