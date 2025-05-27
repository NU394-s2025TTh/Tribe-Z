const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const cors = require("cors");
const corsHandler = cors({ origin: true }); // Allow all origins

// Constants for Firestore collections
const CARTS_COLLECTION = "carts";

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

// Get Firestore instance
const db = admin.firestore();
// Utility function to get a user's cart
async function getUserCart(userId: string) {
    console.log(`Retrieving cart for user: ${userId}`);
  const cartDoc = await db.collection(CARTS_COLLECTION).doc(userId).get();
  if (!cartDoc.exists) {
    console.log(`Cart for user ${userId} does not exist.`);
    return null;
  }
  return cartDoc.data();
}

// Utility function to create or update a user's cart
async function createOrUpdateCart(userId: string, items: any[]) {
  const cartRef = db.collection(CARTS_COLLECTION).doc(userId);
  console.log(`Creating or updating cart for user: ${userId}`, items);
  const cartDoc = await cartRef.get();

  const cartData = {
    userId,
    lastModified: admin.firestore.FieldValue.serverTimestamp(),
    items,
  };
  console.log(`Cart data to be saved:`, cartData);

  if (!cartDoc.exists) {
    // Create a new cart
    await cartRef.set(cartData);
    return { message: "Cart created successfully", cart: cartData };
  } else {
    // Update the existing cart
    await cartRef.update(cartData);
    return { message: "Cart updated successfully", cart: cartData };
  }
}

// Firebase HTTP Function to retrieve cart data
exports.getCart = onRequest((req : any, res : any) => {
  corsHandler(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send({ error: "Method Not Allowed" });
    }

    const userId = req.body.userId; // Assuming userId is passed in the request body

    try {
      const cart = await getUserCart(userId);
      if (!cart) {
        return res.status(404).send({ message: "Cart not found", cart: null });
      }
      return res.status(200).send({ message: "Cart retrieved successfully", cart });
    } catch (error) {
      console.error("Error retrieving cart:", error);
      return res.status(500).send({ error: "An error occurred while retrieving the cart." });
    }
  });
});

exports.updateCart = onRequest((req: any, res: any) => {
    corsHandler(req, res, async () => {
      if (req.method !== "POST") {
        return res.status(405).send({ error: "Method Not Allowed" });
      }
      console.log("Received request body:", req.body);
      const { userId, items } = req.body;
  
      console.log("Received userId:", userId);
      console.log("Received items:", items);
  
      if (!userId) {
        console.warn("Missing userId in request body");
        return res.status(400).send({ error: "The 'userId' field is required." });
      }
  
      if (!Array.isArray(items)) {
        console.warn("Invalid items format:", items);
        return res.status(400).send({ error: "The 'items' field must be an array." });
      }
  
      // Validate each item in the array
      const invalidItems = items.filter(
        (item) => !item.itemId || !item.name || !item.quantity 
      );
      if (invalidItems.length > 0) {
        console.warn("Invalid item structure:", invalidItems);
        return res.status(400).send({
          error: "Each item must have itemId, name, quantity, and price.",
          invalidItems,
        });
      }
  
      console.log(`Updating cart for user: ${userId}`, items);
      try {
        const result = await createOrUpdateCart(userId, items);
        return res.status(200).send(result);
      } catch (error) {
        console.error("Error updating cart:", error);
        return res.status(500).send({ error: "An error occurred while updating the cart." });
      }
    });
  });