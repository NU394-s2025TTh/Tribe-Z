# Work Item: Create Recent Purchases Component

## Task
Build a React component to display user's recent purchases in a clean, organized layout.

## Acceptance Criteria
- [ ] Create `RecentPurchases` component with TypeScript
- [ ] Display list of recent purchases sorted by date (newest first)
- [ ] Show item name, price, purchase date, and thumbnail image for each item
- [ ] Include loading state while fetching purchase history
- [ ] Handle empty state when user has no purchase history
- [ ] Make component responsive for mobile and desktop
- [ ] Add hover effects and clean styling consistent with app design

## Dependencies
- Work Item 1: Purchase history data model
- Existing UI components (Button, Card, etc.)

## Technical Notes
- Use existing design system components where possible
- Consider virtualization if purchase history becomes very long
- Include accessibility features (proper ARIA labels, keyboard navigation)
