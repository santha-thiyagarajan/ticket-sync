import { Ticket, User } from '../types/ticket';
import { format, subDays, subHours } from 'date-fns';

// Mock users
export const users: User[] = [
  {
    id: 'user-001',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: 'user-002',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: 'user-003',
    name: 'David Miller',
    email: 'david.miller@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
  {
    id: 'user-004',
    name: 'Emma Wilson',
    email: 'emma.wilson@example.com',
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
  },
];

// Generate mock tickets
export const tickets: Ticket[] = [
  {
    id: 'TKT-001',
    title: 'Login page not loading correctly',
    description: 'Users are reporting that the login page fails to load correctly on Firefox browsers.',
    status: 'open',
    priority: 'high',
    assignedTo: 'user-001',
    createdBy: 'user-002',
    createdAt: format(subDays(new Date(), 5), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    updatedAt: format(subHours(new Date(), 8), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    tags: ['frontend', 'bug', 'authentication'],
  },
  {
    id: 'TKT-002',
    title: 'Add export to CSV feature',
    description: 'We need to implement a feature that allows users to export their data to CSV format.',
    status: 'in_progress',
    priority: 'medium',
    assignedTo: 'user-003',
    createdBy: 'user-001',
    createdAt: format(subDays(new Date(), 10), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    updatedAt: format(subDays(new Date(), 2), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    tags: ['feature', 'data-export'],
  },
  {
    id: 'TKT-003',
    title: 'API rate limiting not working',
    description: 'The rate limiting on our API is not functioning as expected. Users are able to make unlimited requests.',
    status: 'review',
    priority: 'critical',
    assignedTo: 'user-002',
    createdBy: 'user-004',
    createdAt: format(subDays(new Date(), 3), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    updatedAt: format(subHours(new Date(), 4), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    tags: ['backend', 'security', 'api'],
  },
  {
    id: 'TKT-004',
    title: 'Update documentation for new API endpoints',
    description: 'We need to update our API documentation to include the newly added endpoints.',
    status: 'open',
    priority: 'low',
    assignedTo: 'user-004',
    createdBy: 'user-003',
    createdAt: format(subDays(new Date(), 7), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    updatedAt: format(subDays(new Date(), 7), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    tags: ['documentation', 'api'],
  },
  {
    id: 'TKT-005',
    title: 'Dashboard performance issues',
    description: 'The dashboard is loading slowly for users with large datasets. We need to optimize the queries and rendering.',
    status: 'in_progress',
    priority: 'high',
    assignedTo: 'user-001',
    createdBy: 'user-002',
    createdAt: format(subDays(new Date(), 8), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    updatedAt: format(subHours(new Date(), 12), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    tags: ['performance', 'frontend', 'optimization'],
  },
  {
    id: 'TKT-006',
    title: 'Add email notifications for ticket updates',
    description: 'Implement email notifications to alert users when their assigned tickets are updated.',
    status: 'open',
    priority: 'medium',
    assignedTo: undefined,
    createdBy: 'user-004',
    createdAt: format(subDays(new Date(), 4), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    updatedAt: format(subDays(new Date(), 4), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    tags: ['feature', 'notifications', 'email'],
  },
  {
    id: 'TKT-007',
    title: 'Fix broken links in help section',
    description: 'Several links in the help documentation are broken and need to be updated.',
    status: 'resolved',
    priority: 'low',
    assignedTo: 'user-003',
    createdBy: 'user-001',
    createdAt: format(subDays(new Date(), 15), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    updatedAt: format(subDays(new Date(), 1), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    tags: ['documentation', 'bug', 'ui'],
  },
  {
    id: 'TKT-008',
    title: 'Implement two-factor authentication',
    description: 'Add two-factor authentication option for users to enhance security.',
    status: 'review',
    priority: 'high',
    assignedTo: 'user-002',
    createdBy: 'user-003',
    createdAt: format(subDays(new Date(), 12), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    updatedAt: format(subHours(new Date(), 24), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    tags: ['security', 'authentication', 'feature'],
  },
  {
    id: 'TKT-009',
    title: 'Mobile responsiveness issues on Android',
    description: 'The application is not displaying correctly on certain Android devices.',
    status: 'open',
    priority: 'medium',
    assignedTo: 'user-004',
    createdBy: 'user-002',
    createdAt: format(subDays(new Date(), 6), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    updatedAt: format(subDays(new Date(), 6), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    tags: ['mobile', 'ui', 'bug'],
  },
  {
    id: 'TKT-010',
    title: 'Data import functionality',
    description: 'Create functionality to allow users to import data from CSV files.',
    status: 'closed',
    priority: 'medium',
    assignedTo: 'user-001',
    createdBy: 'user-004',
    createdAt: format(subDays(new Date(), 20), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    updatedAt: format(subDays(new Date(), 3), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    tags: ['feature', 'data-import'],
  },
];

// Helper function to find user by ID
export function getUserById(userId: string): User | undefined {
  return users.find(user => user.id === userId);
}

// Helper function to find ticket by ID
export function getTicketById(ticketId: string): Ticket | undefined {
  return tickets.find(ticket => ticket.id === ticketId);
}