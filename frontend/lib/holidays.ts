export interface Holiday {
  name: string;
  date: Date;
  isNational: boolean;
}

export const indianHolidays: Holiday[] = [
  // 2024
  { name: 'New Year Day', date: new Date(2024, 0, 1), isNational: true },
  { name: 'Makar Sankranti', date: new Date(2024, 0, 14), isNational: false },
  { name: 'Republic Day', date: new Date(2024, 0, 26), isNational: true },
  { name: 'Vasant Panchami', date: new Date(2024, 1, 14), isNational: false },
  { name: 'Maha Shivratri', date: new Date(2024, 2, 8), isNational: false },
  { name: 'Holi', date: new Date(2024, 2, 25), isNational: true },
  { name: 'Good Friday', date: new Date(2024, 2, 29), isNational: true },
  { name: 'Eid-ul-Fitr', date: new Date(2024, 3, 11), isNational: true },
  { name: 'Ram Navami', date: new Date(2024, 3, 17), isNational: false },
  { name: 'Maharashtra Day', date: new Date(2024, 4, 1), isNational: false },
  { name: 'Buddha Purnima', date: new Date(2024, 4, 23), isNational: false },
  { name: 'Eid al-Adha', date: new Date(2024, 5, 17), isNational: true },
  { name: 'Independence Day', date: new Date(2024, 7, 15), isNational: true },
  { name: 'Janmashtami', date: new Date(2024, 7, 26), isNational: false },
  { name: 'Ganesh Chaturthi', date: new Date(2024, 8, 7), isNational: false },
  { name: 'Gandhi Jayanti', date: new Date(2024, 9, 2), isNational: true },
  { name: 'Dussehra', date: new Date(2024, 9, 12), isNational: true },
  { name: 'Diwali', date: new Date(2024, 10, 1), isNational: true }, // Nov 1, 2024
  { name: 'Guru Nanak Jayanti', date: new Date(2024, 10, 15), isNational: true },
  { name: 'Christmas', date: new Date(2024, 11, 25), isNational: true },
  
  // 2025
  { name: 'New Year Day', date: new Date(2025, 0, 1), isNational: true },
  { name: 'Makar Sankranti', date: new Date(2025, 0, 14), isNational: false },
  { name: 'Republic Day', date: new Date(2025, 0, 26), isNational: true },
  { name: 'Vasant Panchami', date: new Date(2025, 1, 3), isNational: false },
  { name: 'Maha Shivratri', date: new Date(2025, 1, 26), isNational: false },
  { name: 'Holi', date: new Date(2025, 2, 14), isNational: true },
  { name: 'Good Friday', date: new Date(2025, 3, 18), isNational: true },
  { name: 'Ram Navami', date: new Date(2025, 3, 6), isNational: false },
  { name: 'Eid-ul-Fitr', date: new Date(2025, 3, 31), isNational: true },
  { name: 'Maharashtra Day', date: new Date(2025, 4, 1), isNational: false },
  { name: 'Buddha Purnima', date: new Date(2025, 4, 13), isNational: false },
  { name: 'Eid al-Adha', date: new Date(2025, 5, 7), isNational: true },
  { name: 'Independence Day', date: new Date(2025, 7, 15), isNational: true },
  { name: 'Janmashtami', date: new Date(2025, 7, 15), isNational: false },
  { name: 'Ganesh Chaturthi', date: new Date(2025, 7, 28), isNational: false },
  { name: 'Gandhi Jayanti', date: new Date(2025, 9, 2), isNational: true },
  { name: 'Dussehra', date: new Date(2025, 9, 2), isNational: true },
  { name: 'Diwali', date: new Date(2025, 9, 20), isNational: true }, // Oct 20, 2025
  { name: 'Guru Nanak Jayanti', date: new Date(2025, 10, 4), isNational: true },
  { name: 'Christmas', date: new Date(2025, 11, 25), isNational: true },
  
  // 2026
  { name: 'New Year Day', date: new Date(2026, 0, 1), isNational: true },
  { name: 'Makar Sankranti', date: new Date(2026, 0, 14), isNational: false },
  { name: 'Republic Day', date: new Date(2026, 0, 26), isNational: true },
  { name: 'Vasant Panchami', date: new Date(2026, 0, 23), isNational: false },
  { name: 'Maha Shivratri', date: new Date(2026, 1, 15), isNational: false },
  { name: 'Holi', date: new Date(2026, 2, 3), isNational: true },
  { name: 'Good Friday', date: new Date(2026, 3, 3), isNational: true },
  { name: 'Ram Navami', date: new Date(2026, 2, 26), isNational: false },
  { name: 'Eid-ul-Fitr', date: new Date(2026, 2, 21), isNational: true },
  { name: 'Maharashtra Day', date: new Date(2026, 4, 1), isNational: false },
  { name: 'Buddha Purnima', date: new Date(2026, 4, 2), isNational: false },
  { name: 'Eid al-Adha', date: new Date(2026, 4, 28), isNational: true },
  { name: 'Independence Day', date: new Date(2026, 7, 15), isNational: true },
  { name: 'Janmashtami', date: new Date(2026, 7, 5), isNational: false },
  { name: 'Ganesh Chaturthi', date: new Date(2026, 8, 17), isNational: false },
  { name: 'Gandhi Jayanti', date: new Date(2026, 9, 2), isNational: true },
  { name: 'Dussehra', date: new Date(2026, 8, 21), isNational: true },
  { name: 'Diwali', date: new Date(2026, 10, 8), isNational: true }, // Nov 8, 2026
  { name: 'Guru Nanak Jayanti', date: new Date(2026, 10, 24), isNational: true },
  { name: 'Christmas', date: new Date(2026, 11, 25), isNational: true },
];

export const isHoliday = (date: Date): Holiday | null => {
  const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return indianHolidays.find(
    (holiday) =>
      holiday.date.getFullYear() === normalized.getFullYear() &&
      holiday.date.getMonth() === normalized.getMonth() &&
      holiday.date.getDate() === normalized.getDate()
  ) || null;
};

export const isPastDate = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  return checkDate < today;
};


