export type ClientStatus = "active" | "paused" | "done";

export interface Client {
  id: string;
  user_id: string;
  name: string;
  status: ClientStatus;
  notes: string | null;
  created_at: string;
  tasks?: Task[];
}

export interface Task {
  id: string;
  client_id: string;
  user_id: string;
  title: string;
  due_date: string | null;
  completed: boolean;
  created_at: string;
}