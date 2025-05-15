import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Ticket } from '../../types/ticket';
import TicketStatusBadge from './TicketStatusBadge';
import TicketPriorityBadge from './TicketPriorityBadge';
import { format } from 'date-fns';
import { Clock, Calendar, Tag, Edit, Trash, ChevronLeft, AlertCircle } from 'lucide-react';
import { getApiUrl } from '../../config/api';

interface TicketDetailProps {
  ticket: Ticket;
}

const TicketDetail: React.FC<TicketDetailProps> = ({ ticket }) => {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const assignee = ticket.assignee;
  const creator = ticket.creator;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setDeleteError(null);
      
      const response = await fetch(getApiUrl(`/tickets/${ticket.id}`), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to delete ticket: ${response.status}`);
      }
      
      setShowDeleteConfirm(false);
      navigate('/tickets');
    } catch (error) {
      console.error('Error deleting ticket:', error);
      setDeleteError(error instanceof Error ? error.message : 'Failed to delete the ticket');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="border-b border-gray-200 px-4 py-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
        <div>
          <Link 
            to="/tickets" 
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-2"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to tickets
          </Link>
          <h2 className="text-xl font-medium text-gray-900 flex flex-wrap items-center gap-2">
            <span>{ticket.id}:</span> 
            <span>{ticket.title}</span>
          </h2>
        </div>
        <div className="flex space-x-3">
          <Link 
            to={`/tickets/${ticket.id}/edit`}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Edit size={16} className="mr-2" />
            Edit
          </Link>
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <Trash size={16} className="mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900">Delete Ticket</h3>
            <p className="mt-2 text-sm text-gray-500">
              Are you sure you want to delete this ticket? This action cannot be undone.
            </p>
            
            {deleteError && (
              <div className="mt-3 bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{deleteError}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setShowDeleteConfirm(false)}
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className={`inline-flex justify-center rounded-md border border-transparent ${
                  isDeleting ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'
                } px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2`}
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 py-5 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-8">
          <div className="col-span-2">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-line">{ticket.description}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {ticket.tags.length > 0 ? (
                  ticket.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-blue-100 py-0.5 px-2.5 text-sm font-medium text-blue-700"
                    >
                      <Tag size={14} className="mr-1" />
                      {tag}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No tags</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 h-fit">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ticket Details</h3>
            
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-500 block mb-1">Status</span>
                <TicketStatusBadge status={ticket.status} />
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-500 block mb-1">Priority</span>
                <TicketPriorityBadge priority={ticket.priority} />
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-500 block mb-1">Assigned To</span>
                {assignee ? (
                  <div className="flex items-center">
                    {assignee.avatar && (
                      <img
                        src={assignee.avatar}
                        alt={assignee.name}
                        className="h-6 w-6 rounded-full mr-2"
                      />
                    )}
                    <span className="text-gray-900">{assignee.name}</span>
                  </div>
                ) : (
                  <span className="text-gray-500">Unassigned</span>
                )}
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-500 block mb-1">Created By</span>
                {creator ? (
                  <div className="flex items-center">
                    {creator.avatar && (
                      <img
                        src={creator.avatar}
                        alt={creator.name}
                        className="h-6 w-6 rounded-full mr-2"
                      />
                    )}
                    <span className="text-gray-900">{creator.name}</span>
                  </div>
                ) : (
                  <span className="text-gray-500">Unknown</span>
                )}
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-500 block mb-1">Created Date</span>
                <div className="flex items-center text-gray-900">
                  <Calendar size={16} className="mr-1 text-gray-500" />
                  {format(new Date(ticket.createdAt), 'PP')}
                </div>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-500 block mb-1">Last Updated</span>
                <div className="flex items-center text-gray-900">
                  <Clock size={16} className="mr-1 text-gray-500" />
                  {format(new Date(ticket.updatedAt), 'PP')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;