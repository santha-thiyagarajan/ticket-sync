import React from 'react';
import Layout from '../components/layout/Layout';
import TicketForm from '../components/tickets/TicketForm';

const CreateTicketPage: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Ticket</h1>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <TicketForm />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateTicketPage;