'use client';

import { format } from 'date-fns';

interface CalendarLogoProps {
  isCollapsed?: boolean;
}

export default function CalendarLogo({ isCollapsed = false }: CalendarLogoProps) {
  const today = new Date();

  return (
    // `group` here enables the subtle hover glow defined on the overlay
    <div className={["flex", "items-center", isCollapsed ? "justify-center" : "gap-3", "group"].join(" ")} aria-hidden={false} role="img" aria-label={format(today, "EEEE, MMMM d")}> 
      <div className="relative">
        <div className={[isCollapsed ? 'w-11 h-11' : 'w-12 h-12', 'bg-white', 'dark:bg-gray-800', 'rounded-xl', 'shadow-sm', 'border', 'border-gray-200', 'dark:border-gray-700', 'overflow-hidden', 'flex', 'flex-col', 'transition-all', 'duration-200', 'items-stretch', 'justify-start'].join(' ')}>
          {/* Calendar Month */}
          <div className="h-4 bg-red-500 w-full flex items-center justify-center">
            <span className="text-[10px] font-medium text-white uppercase tracking-wider">
              {format(today, "MMM")}
            </span>
          </div>
          {/* Calendar Date */}
          <div className="flex items-center justify-center flex-1 text-base font-bold text-gray-800 dark:text-gray-200">
            {format(today, "d")}
          </div>
        </div>

        {/* subtle glow that appears when the parent (group) is hovered */}
        <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {!isCollapsed && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-800 dark:text-gray-200">Calendar</span>
            {/* <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 dark:border-blue-400/20">
              PRO
            </span> */}
          </div>
          <span className="text-xs font-medium text-gray-300 dark:text-gray-400">
            {format(today, "EEEE, MMM d")}
          </span>
        </div>
      )}
    </div>
  );
}