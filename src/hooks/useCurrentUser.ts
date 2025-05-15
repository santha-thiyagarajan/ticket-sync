import { useState, useEffect } from 'react';
import { User } from '../types/ticket';
import { getApiUrl } from '../config/api';

// Since we don't have authentication, we're using a fixed user ID
const CURRENT_USER_ID = '3f6c8476-d2fd-477d-a7dc-14d052bd95e7';

export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        const response = await fetch(getApiUrl(`/users/${CURRENT_USER_ID}`));
        
        if (!response.ok) {
          throw new Error(`Failed to fetch current user: ${response.statusText}`);
        }
        
        const userData: User = await response.json();
        setCurrentUser(userData);
        setError(null);
      } catch (err) {
        console.error('Error fetching current user:', err);
        setError(err instanceof Error ? err.message : 'Failed to load current user');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  return { currentUser, loading, error };
} 