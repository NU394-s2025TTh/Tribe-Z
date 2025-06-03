# Work Item: Handle Unavailable Items in Recent Purchases

## Task
Implement logic to detect and handle items from recent purchases that are no longer available in the catalog.

## Acceptance Criteria
- [ ] Check item availability when displaying recent purchases
- [ ] Visually distinguish unavailable items (grayed out, strikethrough, etc.)
- [ ] Disable "Add to Cart" button for unavailable items
- [ ] Show clear messaging when items are unavailable
- [ ] Suggest similar available items when possible
- [ ] Cache availability checks to avoid repeated database calls
- [ ] Update availability status when items come back in stock

## Dependencies
- Work Item 1: Purchase history data model
- Work Item 2: Recent Purchases component
- Existing ingredients catalog

## Technical Notes
- Create utility function to check item availability
- Consider showing "Out of Stock" vs "Discontinued" status
- May need to implement item similarity algorithm for suggestions
