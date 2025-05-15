export type TicketStatus = 'open' | 'in_progress' | 'review' | 'resolved' | 'closed';

export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignedTo?: string;
  assignee?: User;
  createdBy: string;
  creator?: User;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}