export default (OldValue, OldMin, OldMax, NewMin, NewMax) =>
  ((OldValue - OldMin) * (NewMax - NewMin)) / (OldMax - OldMin) + NewMin;
