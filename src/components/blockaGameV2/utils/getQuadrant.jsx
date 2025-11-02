
export const getQuadrant = (x, y, w, h) => {
    const mx = w / 2;
    const my = h / 2;
    if (x < mx && y < my) return 0;
    if (x >= mx && y < my) return 1;
    if (x < mx && y >= my) return 2;
    return 3;
  };