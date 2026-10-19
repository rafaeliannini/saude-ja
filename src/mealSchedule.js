export function mealIdForHour(hour) {
  if (hour >= 5 && hour < 9) return 'cafe'
  if (hour >= 9 && hour < 11) return 'manha'
  if (hour >= 11 && hour < 15) return 'almoco'
  if (hour >= 15 && hour < 18) return 'tarde'
  return 'jantar'
}
