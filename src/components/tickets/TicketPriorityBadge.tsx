import React from 'react';
import { TicketPriority } from '../../types/ticket';
import { AlertCircle, AlertTriangle, BadgeAlert as Alert, CircleDot } from 'lucide-react';

interface TicketPriorityBadgeProps {
  priority: TicketPriority;
}

const TicketPriorityBadge: React.FC<TicketPriorityBadgeProps> = ({ priority }) => {
  const getPriorityStyles = (priority: TicketPriority) => {
    switch (priority) {
      case 'low':
        return 'text-blue-700 bg-blue-50';
      case 'medium':
        return 'text-yellow-700 bg-yellow-50';
      case 'high':
        return 'text-orange-700 bg-orange-50';
      case 'critical':
        return 'text-red-700 bg-red-50';
      default:
        return 'text-gray-700 bg-gray-50';
    }
  };

  const getPriorityIcon = (priority: TicketPriority) => {
    switch (priority) {
      case 'low':
        return <CircleDot size={14} />;
      case 'medium':
        return <Alert size={14} />;
      case 'high':
        return <AlertTriangle size={14} />;
      case 'critical':
        return <AlertCircle size={14} />;
      default:
        return <CircleDot size={14} />;
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityStyles(
        priority
      )}`}
    >
      {getPriorityIcon(priority)}
      <span className="ml-1 capitalize">{priority}</span>
    </span>
  );
};

export default TicketPriorityBadge;