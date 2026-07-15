export function getGrade(total: number): string {
  if (total >= 70) return 'A';
  if (total >= 60) return 'B';
  if (total >= 50) return 'C';
  if (total >= 45) return 'D';
  if (total >= 40) return 'E';
  return 'F';
}

export function getGradeRemark(grade: string): string {
  const map: Record<string, string> = {
    A: 'Excellent', B: 'Very Good', C: 'Good', D: 'Fair', E: 'Pass', F: 'Fail',
  };
  return map[grade] ?? '';
}
