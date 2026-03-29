export type Task = {
  id: string;
  title: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  due_date: string | null;
  created_at: string;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};
