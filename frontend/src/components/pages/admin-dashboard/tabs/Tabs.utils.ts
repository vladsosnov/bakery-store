const DAY_RANGE = 7;

const getLastDays = (days: number) => {
  const result: { key: string; label: string }[] = [];
  const today = new Date();

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    const key = date.toISOString().slice(0, 10);
    const label = date.toLocaleDateString(undefined, { weekday: 'short' });

    result.push({ key, label });
  }

  return result;
};

export const getDayKey = (dateValue: string) => {
  return new Date(dateValue).toISOString().slice(0, 10);
};

export const toDailySeries = (items: string[]) => {
  const days = getLastDays(DAY_RANGE);
  const counts = items.reduce<Record<string, number>>((acc, createdAt) => {
    const dayKey = getDayKey(createdAt);
    acc[dayKey] = (acc[dayKey] ?? 0) + 1;
    return acc;
  }, {});

  return days.map((day) => ({
    key: day.key,
    label: day.label,
    value: counts[day.key] ?? 0
  }));
};