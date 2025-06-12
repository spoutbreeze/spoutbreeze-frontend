'use client';

import React, { useState } from 'react';
import { getJoinUrlWithName } from '@/actions/events';
import { useParams, useSearchParams } from 'next/navigation';

const JoinEventPage: React.FC = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const eventId = params.eventId as string;
  const role = (searchParams.get('role') as 'attendee' | 'moderator') || 'attendee';
  
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoinEvent = async () => {
    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const joinUrl = await getJoinUrlWithName(eventId, fullName.trim(), role);
      if (joinUrl) {
        // Redirect to BBB session
        window.location.href = joinUrl;
      } else {
        setError('Failed to get join URL');
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.message === 'EVENT_NOT_FOUND') {
        setError('Event not found');
      } else if (error.message === 'EVENT_NOT_STARTED') {
        setError('Event has not started yet');
      } else {
        setError('Failed to join event. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Join Event</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please enter your name to join the {role} session
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your full name"
              disabled={isLoading}
            />
          </div>
          
          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}
          
          <button
            onClick={handleJoinEvent}
            disabled={isLoading || !fullName.trim()}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Joining...' : 'Join Meeting'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinEventPage;