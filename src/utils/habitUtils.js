import { format, subDays } from 'date-fns';

export function calculateCurrentStreak(datesDone) {
  if (!datesDone || !Array.isArray(datesDone) || datesDone.length === 0) {
    return 0;
  }

  const today = format(new Date(), 'yyyy-MM-dd');
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
  
  // Use a Set for O(1) lookups
  const doneSet = new Set(datesDone);

  let streak = 0;
  let currentDateObj = new Date(); // Start with today

  // If haven't done today, check if yesterday was done.
  // If yesterday wasn't done either, streak is broken (0).
  if (!doneSet.has(today)) {
    if (!doneSet.has(yesterday)) {
      return 0; // Broken streak
    }
    // Start counting from yesterday
    currentDateObj = subDays(new Date(), 1);
  }

  // Count backwards from the starting date
  while (true) {
    const dateStr = format(currentDateObj, 'yyyy-MM-dd');
    if (doneSet.has(dateStr)) {
      streak++;
      currentDateObj = subDays(currentDateObj, 1);
    } else {
      break;
    }
  }

  return streak;
}
