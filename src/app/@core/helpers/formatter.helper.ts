/**
 * @description Format matches array
 * @param matches
 * @return {any[]}
 */
export function formatMatches(matches) {
  const formatted = [];

  matches.forEach(match => {
    match['enrollmentOpens'] = match.enrollment.enrollmentOpens;
    match['enrollmentCloses'] = match.enrollment.enrollmentCloses;
    match['enrollmentPlayers'] = match.enrollment.players;
    match['enrollmentMaxCap'] = match.enrollment.maxCapacity;

    formatted.push(match);
  });

  return formatted;
}
