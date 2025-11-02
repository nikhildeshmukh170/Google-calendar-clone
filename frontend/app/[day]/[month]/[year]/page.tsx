'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Calendar from '@/components/Calendar';

export default function DatePage() {
  const params = useParams();
  const [date, setDate] = useState<Date | null>(null);

  useEffect(() => {
    const day = parseInt(params.day as string, 10);
    const monthName = params.month as string;
    const year = parseInt(params.year as string, 10);

    const monthMap: { [key: string]: number } = {
      january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
      july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
    };

    const month = monthMap[monthName.toLowerCase()];
    if (month !== undefined && !isNaN(day) && !isNaN(year)) {
      const newDate = new Date(year, month, day);
      if (!isNaN(newDate.getTime())) {
        setDate(newDate);
      } else {
        setDate(new Date());
      }
    } else {
      setDate(new Date());
    }
  }, [params]);

  if (!date) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <Calendar initialDate={date} />;
}


