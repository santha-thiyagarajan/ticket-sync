import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Ticket, TicketStatus, TicketPriority } from '../types/ticket';
import { tickets as mockTickets } from '../data/mockData';
import { format } from 'date-fns';

interface TicketContextType {
  tickets: Ticket[];
  createTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => Ticket;
  updateTicket: (id: string, updates: Partial<Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>>) => Ticket | null;
  deleteTicket: (id: string) => boolean;
  getTicket: (id: string) => Ticket | undefined;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
};

interface TicketProviderProps {
  children: ReactNode;
}

export const TicketProvider: React.FC<TicketProviderProps> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);

  const createTicket = (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>): Ticket => {
    const now = format(new Date(), 'yyyy-MM-dd\'T\'HH:mm:ss');
    // Generate a simple ID based on current tickets length + 1
    const newId = `TKT-${String(tickets.length + 1).padStart(3, '0')}`;
    
    const newTicket: Ticket = {
      ...ticketData,
      id: newId,
      createdAt: now,
      updatedAt: now,
    };
    
    setTickets(prev => [...prev, newTicket]);
    return newTicket;
  };

  const updateTicket = (id: string, updates: Partial<Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>>): Ticket | null => {
    let updatedTicket: Ticket | null = null;
    
    setTickets(prev => {
      return prev.map(ticket => {
        if (ticket.id === id) {
          updatedTicket = {
            ...ticket,
            ...updates,
            updatedAt: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm:ss')
          };
          return updatedTicket;
        }
        return ticket;
      });
    });
    
    return updatedTicket;
  };

  const deleteTicket = (id: string): boolean => {
    let deleted = false;
    setTickets(prev => {
      const newTickets = prev.filter(ticket => ticket.id !== id);
      deleted = newTickets.length < prev.length;
      return newTickets;
    });
    return deleted;
  };

  const getTicket = (id: string): Ticket | undefined => {
    return tickets.find(ticket => ticket.id === id);
  };

  return (
    <TicketContext.Provider value={{ tickets, createTicket, updateTicket, deleteTicket, getTicket }}>
      {children}
    </TicketContext.Provider>
  );
};