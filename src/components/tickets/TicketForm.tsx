import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, TicketPriority, TicketStatus, User } from '../../types/ticket';
import { getApiUrl } from '../../config/api';
import { useUsers } from '../../hooks/useUsers';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { Loader } from 'lucide-react';

interface TicketFormProps {
  ticket?: Ticket; // For editing existing ticket
  isEditing?: boolean;
  showCreatedBy?: boolean;
}

interface CreateTicketPayload {
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignedTo?: string;
  createdBy: string; // Required for new tickets
  tags: string[];
}

interface UpdateTicketPayload {
  title?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  assignedTo?: string;
  tags?: string[];
}

const TicketForm: React.FC<TicketFormProps> = ({ 
  ticket, 
  isEditing = false,
  showCreatedBy = false
}) => {
  const navigate = useNavigate();
  const { users, loading: loadingUsers, error: usersError } = useUsers();
  const { currentUser, loading: loadingCurrentUser, error: currentUserError } = useCurrentUser();

  const [creatorUser, setCreatorUser] = useState<User | null>(null);
  const [loadingCreator, setLoadingCreator] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'open' as TicketStatus,
    priority: 'medium' as TicketPriority,
    assignedTo: '',
    tags: [] as string[],
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // If editing, populate form with ticket data
  useEffect(() => {
    if (isEditing && ticket) {
      setFormData({
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        assignedTo: ticket.assignedTo || '',
        tags: ticket.tags,
      });
    }
  }, [isEditing, ticket]);

  // Fetch creator user data if showing createdBy field
  useEffect(() => {
    if (showCreatedBy && isEditing && ticket && ticket.createdBy && !ticket.creator) {
      const fetchCreator = async () => {
        try {
          setLoadingCreator(true);
          const response = await fetch(getApiUrl(`/users/${ticket.createdBy}`));
          
          if (!response.ok) {
            throw new Error('Failed to fetch creator user');
          }
          
          const userData: User = await response.json();
          setCreatorUser(userData);
        } catch (err) {
          console.error('Error fetching creator:', err);
        } finally {
          setLoadingCreator(false);
        }
      };
      
      fetchCreator();
    } else if (ticket?.creator) {
      setCreatorUser(ticket.creator);
    }
  }, [showCreatedBy, isEditing, ticket]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, trimmedTag],
      }));
    }
    setTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createTicketAPI = async (payload: CreateTicketPayload): Promise<Ticket> => {
    console.log('Creating ticket with payload:', payload);
    const response = await fetch(getApiUrl('/tickets'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to create ticket: ${response.status}`
      );
    }

    return response.json();
  };

  const updateTicketAPI = async (id: string, payload: UpdateTicketPayload): Promise<Ticket> => {
    console.log('Updating ticket with payload:', payload);
    const response = await fetch(getApiUrl(`/tickets/${id}`), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to update ticket: ${response.status}`
      );
    }

    return response.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (!currentUser) {
      setErrors((prev) => ({ ...prev, form: 'Current user information is not available' }));
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      if (isEditing && ticket) {
        // For updating an existing ticket
        const updatePayload: UpdateTicketPayload = {
          title: formData.title,
          description: formData.description,
          status: formData.status,
          priority: formData.priority,
          tags: formData.tags,
        };
        
        // Only add assignedTo if not empty
        if (formData.assignedTo) {
          updatePayload.assignedTo = formData.assignedTo;
        }
        
        const savedTicket = await updateTicketAPI(ticket.id, updatePayload);
        navigate(`/tickets/${savedTicket.id}`);
      } else {
        // For creating a new ticket
        const createPayload: CreateTicketPayload = {
          title: formData.title,
          description: formData.description,
          status: formData.status,
          priority: formData.priority,
          tags: formData.tags,
          createdBy: currentUser.id,  // Always include the current user ID
        };
        
        // Only add assignedTo if not empty
        if (formData.assignedTo) {
          createPayload.assignedTo = formData.assignedTo;
        }
        
        const savedTicket = await createTicketAPI(createPayload);
        navigate(`/tickets/${savedTicket.id}`);
      }
    } catch (error) {
      console.error('Error saving ticket:', error);
      setErrors((prev) => ({ 
        ...prev, 
        form: error instanceof Error ? error.message : 'Failed to save ticket' 
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isEditing && ticket) {
      navigate(`/tickets/${ticket.id}`);
    } else {
      navigate('/tickets');
    }
  };

  if (loadingUsers || loadingCurrentUser) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="h-6 w-6 text-blue-500 animate-spin" />
        <span className="ml-2 text-gray-600">Loading form...</span>
      </div>
    );
  }

  if (usersError || currentUserError) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div>
            <p className="text-sm text-red-700">
              {usersError || currentUserError || 'Failed to load required data. Please try again later.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.form && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div>
              <p className="text-sm text-red-700">{errors.form}</p>
            </div>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-2 shadow-sm sm:text-sm py-2 px-3 ${
            errors.title
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
        />
        {errors.title && (
          <p className="mt-2 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-2 shadow-sm sm:text-sm ${
            errors.description
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
        />
        {errors.description && (
          <p className="mt-2 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-2 border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="review">In Review</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-2 border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      {showCreatedBy && isEditing && ticket && (
        <div>
          <label htmlFor="createdBy" className="block text-sm font-medium text-gray-700">
            Created By
          </label>
          <div className="mt-1 flex items-center">
            {loadingCreator ? (
              <div className="flex items-center text-sm text-gray-500">
                <Loader className="h-4 w-4 text-blue-500 animate-spin mr-2" />
                Loading creator...
              </div>
            ) : creatorUser ? (
              <div className="flex items-center">
                {creatorUser.avatar && (
                  <img
                    src={creatorUser.avatar}
                    alt={creatorUser.name}
                    className="h-8 w-8 rounded-full mr-2"
                  />
                )}
                <span className="text-sm text-gray-700">{creatorUser.name}</span>
                <span className="ml-2 text-xs text-gray-500">({creatorUser.email})</span>
              </div>
            ) : (
              <span className="text-sm text-gray-500">
                {ticket.createdBy || 'Unknown'}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">This field cannot be modified</p>
        </div>
      )}

      <div>
        <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700">
          Assigned To
        </label>
        <select
          id="assignedTo"
          name="assignedTo"
          value={formData.assignedTo}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-2 border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Unassigned</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
          Tags (Press Enter or comma to add)
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            type="text"
            id="tagInput"
            value={tagInput}
            onChange={handleTagInputChange}
            onKeyDown={handleTagInputKeyDown}
            onBlur={addTag}
            className="block w-full rounded-md border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3"
            placeholder="Add tags..."
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {formData.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-blue-100 py-0.5 pl-2 pr-0.5 text-sm font-medium text-blue-700"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:bg-blue-500 focus:text-white focus:outline-none"
              >
                <span className="sr-only">Remove {tag} tag</span>
                &times;
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-5">
        <button
          type="button"
          onClick={handleCancel}
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`inline-flex justify-center rounded-md border border-transparent ${
            isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          } py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isEditing ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            isEditing ? 'Update Ticket' : 'Create Ticket'
          )}
        </button>
      </div>
    </form>
  );
};

export default TicketForm;