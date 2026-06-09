export const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const buildFilters = (userId, query) => {
  const filters = { user: userId };

  if (query.search) {
    const escapedSearch = escapeRegex(query.search);
    filters.$or = [
      { title: { $regex: escapedSearch, $options: "i" } },
      { description: { $regex: escapedSearch, $options: "i" } },
      { category: { $regex: escapedSearch, $options: "i" } },
    ];
  }

  if (query.status && query.status !== "all") {
    filters.status = query.status;
  }

  if (query.priority && query.priority !== "all") {
    filters.priority = query.priority;
  }

  if (query.category && query.category !== "all") {
    filters.category = query.category;
  }

  return filters;
};

export const buildSort = (sortBy = "latest") => {
  const sortMap = {
    latest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    dueSoon: { dueDate: 1, createdAt: -1 },
    priority: { priorityWeight: -1, dueDate: 1 },
    custom: { order: 1, createdAt: -1 },
  };

  return sortMap[sortBy] || sortMap.latest;
};

export const getPriorityWeight = (priority) => {
  const weights = {
    High: 3,
    Medium: 2,
    Low: 1,
  };
  return weights[priority] || 0;
};
