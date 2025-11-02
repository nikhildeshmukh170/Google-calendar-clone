'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const today = new Date();
    const day = today.getDate();
    const month = format(today, 'MMMM').toLowerCase();
    const year = today.getFullYear();
    router.push(`/${day}/${month}/${year}`);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}


