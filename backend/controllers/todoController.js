import Todo from "../models/Todo.js";
import { sanitizePagination } from "../utils/validators.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { buildFilters, buildSort } from "../utils/todoHelpers.js";

const baseCategories = ["Personal", "Work", "Study", "Health", "Shopping", "Other"];

export const getTodos = asyncHandler(async (req, res) => {
  const { page, limit, skip } = sanitizePagination(req.query.page, req.query.limit);
  const filters = buildFilters(req.user._id, req.query);
  const sort = buildSort(req.query.sortBy);

  // We use aggregation to handle custom sorting weights (e.g., for priority)
  const pipeline = [
    { $match: filters },
    {
      $addFields: {
        priorityWeight: {
          $switch: {
            branches: [
              { case: { $eq: ["$priority", "High"] }, then: 3 },
              { case: { $eq: ["$priority", "Medium"] }, then: 2 },
              { case: { $eq: ["$priority", "Low"] }, then: 1 },
            ],
            default: 0,
          },
        },
      },
    },
    { $sort: sort },
    {
      $facet: {
        metadata: [{ $count: "total" }],
        data: [{ $skip: skip }, { $limit: limit }],
      },
    },
  ];

  const [results, distinctCategories] = await Promise.all([
    Todo.aggregate(pipeline),
    Todo.distinct("category", { user: req.user._id }),
  ]);

  const todos = results[0].data;
  const total = results[0].metadata[0]?.total || 0;

  const categorySet = new Set(baseCategories);
  distinctCategories.forEach((category) => categorySet.add(category));

  res.json({
    todos,
    categories: Array.from(categorySet),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

export const createTodo = asyncHandler(async (req, res) => {
  const { title, description, category, dueDate, priority } = req.body;

  if (!title?.trim()) {
    return res.status(400).json({ message: "Title is required" });
  }

  const currentLastTodo = await Todo.findOne({ user: req.user._id }).sort({ order: -1 });

  const todo = await Todo.create({
    user: req.user._id,
    title,
    description,
    category,
    dueDate: dueDate || null,
    priority,
    order: currentLastTodo ? currentLastTodo.order + 1 : 1,
  });

  res.status(201).json(todo);
});

export const updateTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }

  Object.assign(todo, {
    title: req.body.title ?? todo.title,
    description: req.body.description ?? todo.description,
    category: req.body.category ?? todo.category,
    dueDate: req.body.dueDate === "" ? null : req.body.dueDate ?? todo.dueDate,
    priority: req.body.priority ?? todo.priority,
    order: req.body.order ?? todo.order,
  });

  const updated = await todo.save();
  res.json(updated);
});

export const deleteTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }

  res.json({ message: "Todo deleted successfully" });
});

export const toggleTodoStatus = asyncHandler(async (req, res) => {
  const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }

  todo.status = req.body.status === "completed" ? "completed" : "pending";
  const updated = await todo.save();
  res.json(updated);
});

export const reorderTodos = asyncHandler(async (req, res) => {
  const { orderedIds } = req.body;

  if (!Array.isArray(orderedIds)) {
    return res.status(400).json({ message: "orderedIds must be an array" });
  }

  await Promise.all(
    orderedIds.map((id, index) =>
      Todo.updateOne({ _id: id, user: req.user._id }, { order: index + 1 })
    )
  );

  res.json({ message: "Tasks reordered successfully" });
});
