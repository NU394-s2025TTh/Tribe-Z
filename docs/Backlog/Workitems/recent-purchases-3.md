# Work Item: Integrate Recent Purchases into Ingredients Page

## Task
Add Recent Purchases component to the Ingredients page and implement add-to-cart functionality.

## Acceptance Criteria
- [ ] Import and render RecentPurchases component on Ingredients page
- [ ] Position recent purchases section appropriately (above or beside ingredients grid)
- [ ] Connect recent purchases to existing cart functionality
- [ ] Implement individual item "Add to Cart" buttons
- [ ] Show visual feedback when items are added to cart
- [ ] Ensure recent purchases only show for authenticated users
- [ ] Handle cases where recent purchase items are no longer available

## Dependencies
- Work Item 1: Purchase history data model
- Work Item 2: Recent Purchases component
- Existing cart functionality in Ingredients page

## Technical Notes
- Reuse existing `handleUpdateCart` function from Ingredients component
- Consider showing recent purchases in a collapsible section to save space
- Validate that purchased items still exist before allowing add to cart
