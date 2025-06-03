# Work Item: Create Purchase History Data Model

## Task
Create Firebase data structure and functions to store and retrieve user purchase history.

## Acceptance Criteria
- [ ] Design Firebase collection structure for purchase history (`purchases` collection)
- [ ] Create TypeScript interfaces for Purchase and PurchaseItem types
- [ ] Implement function to save purchases when orders are completed
- [ ] Implement function to fetch recent purchases for a user (last 20 items)
- [ ] Add proper indexing for efficient queries by user and date
- [ ] Include error handling for database operations

## Dependencies
- User authentication system
- Existing cart/order completion functionality

## Technical Notes
- Purchase document should include: userId, items[], purchaseDate, totalAmount
- Each item should include: itemId, name, price, quantity, category
- Consider data retention policies for purchase history
