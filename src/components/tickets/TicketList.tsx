import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ticket } from '../../types/ticket';
import TicketStatusBadge from './TicketStatusBadge';
import TicketPriorityBadge from './TicketPriorityBadge';
import { formatDistanceToNow } from 'date-fns';
import { Filter, ChevronDown, ChevronUp, Loader } from 'lucide-react';
import { getApiUrl } from '../../config/api';

interface TicketListProps {}

type SortField = 'id' | 'title' | 'status' | 'priority' | 'assignedTo' | 'updatedAt';
type SortDirection = 'asc' | 'desc';

interface ApiResponse {
  data: Ticket[];
  meta: {
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const TicketList: React.FC<TicketListProps> = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('updatedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await fetch(getApiUrl('/tickets'));
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data: ApiResponse = await response.json();
        setTickets(data.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching tickets:', err);
        setError('Failed to load tickets. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedTickets = [...tickets]
    .filter(ticket => statusFilter === 'all' || ticket.status === statusFilter)
    .sort((a, b) => {
      let compareA: string | Date = '';
      let compareB: string | Date = '';

      switch (sortField) {
        case 'id':
        case 'title':
        case 'status':
        case 'priority':
          compareA = a[sortField];
          compareB = b[sortField];
          break;
        case 'assignedTo':
          compareA = a.assignedTo || '';
          compareB = b.assignedTo || '';
          break;
        case 'updatedAt':
          compareA = new Date(a.updatedAt);
          compareB = new Date(b.updatedAt);
          break;
      }

      if (compareA < compareB) return sortDirection === 'asc' ? -1 : 1;
      if (compareA > compareB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const getSortIcon = (field: SortField) => {
    if (field === sortField) {
      return sortDirection === 'asc' ? (
        <ChevronUp size={16} className="ml-1" />
      ) : (
        <ChevronDown size={16} className="ml-1" />
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin h-8 w-8 text-blue-500" />
        <span className="ml-2 text-gray-600">Loading tickets...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="border-b border-gray-200 px-4 py-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
        <h2 className="text-lg font-medium text-gray-900">Tickets</h2>
        <div className="flex items-center space-x-2">
          <Filter size={16} className="text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="review">In Review</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center">
                  Ticket {getSortIcon('id')}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center">
                  Title {getSortIcon('title')}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center">
                  Status {getSortIcon('status')}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('priority')}
              >
                <div className="flex items-center">
                  Priority {getSortIcon('priority')}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('assignedTo')}
              >
                <div className="flex items-center">
                  Assigned To {getSortIcon('assignedTo')}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('updatedAt')}
              >
                <div className="flex items-center">
                  Updated {getSortIcon('updatedAt')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedTickets.length > 0 ? (
              sortedTickets.map((ticket) => {
                return (
                  <tr 
                    key={ticket.id} 
                    className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      <Link to={`/tickets/${ticket.id}`} className="hover:underline">
                        {ticket.id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">
                      <Link to={`/tickets/${ticket.id}`} className="hover:underline">
                        {ticket.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <TicketStatusBadge status={ticket.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <TicketPriorityBadge priority={ticket.priority} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticket.assignee ? (
                        <div className="flex items-center">
                          {ticket.assignee.avatar && (
                            <img
                              src={ticket.assignee.avatar}
                              alt={ticket.assignee.name}
                              className="h-6 w-6 rounded-full mr-2"
                            />
                          )}
                          <span>{ticket.assignee.name}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No tickets found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketList;