export interface CreateTicketDto {
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignedTo?: string;
  tags: string[];
}

export interface UpdateTicketDto extends Partial<CreateTicketDto> {
  updatedAt?: Date;
}

export interface TicketResponse {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignedTo?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export type TicketStatus = 'open' | 'in_progress' | 'review' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

export interface TicketQueryParams {
  status?: TicketStatus;
  priority?: TicketPriority;
  assignedTo?: string;
  createdBy?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: keyof TicketResponse;
  sortOrder?: 'ASC' | 'DESC';
}