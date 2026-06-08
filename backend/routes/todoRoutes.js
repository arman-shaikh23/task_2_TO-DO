import express from "express";
import {
  createTodo,
  deleteTodo,
  getTodos,
  reorderTodos,
  toggleTodoStatus,
  updateTodo,
} from "../controllers/todoController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/", getTodos);
router.post("/", createTodo);
router.put("/reorder", reorderTodos);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);
router.patch("/:id/status", toggleTodoStatus);

export default router;

