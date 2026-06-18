const Book = require("../models/Book");
const Order = require("../models/Order");
const Comment = require("../models/Comment");
const Request = require("../models/Request");
const User = require("../models/User");

const getBooks = async (req, res) => {
  const books = await Book.find().sort({ createdAt: -1 });
  res.json(books);
};

const createBook = async (req, res) => {
  const book = await Book.create(req.body);
  res.status(201).json(book);
};

const updateBook = async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book);
};

const deleteBook = async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json({ message: "Book removed" });
};

const orderBook = async (req, res) => {
  const { type } = req.body;
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });
  if (!req.user.membershipActive) return res.status(403).json({ message: "Membership inactive" });
  if (book.stock < 1) return res.status(400).json({ message: "Book unavailable, please create request" });

  const amount = type === "rent" ? book.rentPrice : book.price;
  const order = await Order.create({ user: req.user._id, book: book._id, type, amount });
  book.stock -= 1;
  await book.save();
  res.status(201).json(order);
};

const createRequest = async (req, res) => {
  const request = await Request.create({ ...req.body, user: req.user._id });
  res.status(201).json(request);
};

const getRequests = async (req, res) => {
  const requests = await Request.find().populate("user", "name email").sort({ createdAt: -1 });
  res.json(requests);
};

const updateRequestStatus = async (req, res) => {
  const request = await Request.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!request) return res.status(404).json({ message: "Request not found" });
  res.json(request);
};

const addComment = async (req, res) => {
  const { content } = req.body;
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });
  const comment = await Comment.create({ user: req.user._id, book: req.params.id, content });
  const populated = await comment.populate("user", "name");
  res.status(201).json(populated);
};

const getComments = async (req, res) => {
  const comments = await Comment.find({ book: req.params.id })
    .populate("user", "name")
    .sort({ createdAt: -1 });
  res.json(comments);
};

const getUsers = async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
};

const updateMembership = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { membershipActive: req.body.membershipActive },
    { new: true }
  ).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

module.exports = {
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
};
