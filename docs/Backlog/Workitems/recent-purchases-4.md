# Work Item: Implement Bulk Add to Cart Functionality

## Task
Add the ability to select multiple items from recent purchases and add them all to cart at once.

## Acceptance Criteria
- [ ] Add checkboxes to each recent purchase item
- [ ] Implement "Select All" / "Deselect All" functionality
- [ ] Add "Add Selected to Cart" button that's only enabled when items are selected
- [ ] Show count of selected items in the button text
- [ ] Provide feedback showing how many items were added successfully
- [ ] Handle mixed scenarios where some selected items are unavailable
- [ ] Clear selections after successful bulk add operation

## Dependencies
- Work Item 2: Recent Purchases component
- Work Item 3: Integration with Ingredients page

## Technical Notes
- Use controlled checkbox inputs with React state
- Batch the cart updates for better performance
- Consider animation/transition effects for better UX
