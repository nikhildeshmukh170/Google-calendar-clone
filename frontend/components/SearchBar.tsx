'use client';

import { useState, useEffect } from 'react';
import { Event } from '@/types/event';

interface SearchBarProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

export default function SearchBar({ events, onEventClick }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Event[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = events.filter(
      (event) =>
        event.title.toLowerCase().includes(lowerQuery) ||
        event.description?.toLowerCase().includes(lowerQuery) ||
        event.location?.toLowerCase().includes(lowerQuery)
    );
    setResults(filtered.slice(0, 10));
    setIsOpen(filtered.length > 0);
  }, [query, events]);

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-800">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          placeholder="Search events..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <svg
          className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {results.map((event) => (
            <button
              key={event.id}
              onClick={() => {
                onEventClick(event);
                setQuery('');
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 last:border-b-0 transition-colors"
            >
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {highlightText(event.title, query)}
              </div>
              {event.description && (
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {highlightText(event.description, query)}
                </div>
              )}
              {event.location && (
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  📍 {highlightText(event.location, query)}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


