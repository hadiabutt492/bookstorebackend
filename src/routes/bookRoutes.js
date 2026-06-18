const express = require("express");
const { protect, adminOnly } = require("../middleware/auth");
const {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
  orderBook,
  createRequest,
  getRequests,
  updateRequestStatus,
  addComment,
  getComments,
  getUsers,
  updateMembership,
} = require("../controllers/bookController");

const router = express.Router();

router.get("/books", getBooks);
router.post("/books", protect, adminOnly, createBook);
router.put("/books/:id", protect, adminOnly, updateBook);
router.delete("/books/:id", protect, adminOnly, deleteBook);

router.post("/books/:id/order", protect, orderBook);
router.get("/books/:id/comments", getComments);
router.post("/books/:id/comments", protect, addComment);

router.post("/requests", protect, createRequest);
router.get("/requests", protect, adminOnly, getRequests);
router.put("/requests/:id", protect, adminOnly, updateRequestStatus);

router.get("/users", protect, adminOnly, getUsers);
router.put("/users/:id/membership", protect, adminOnly, updateMembership);

module.exports = router;
