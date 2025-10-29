export class Casillero {
  constructor(x, y, ocupado = false) {
    this.x = x;
    this.y = y;
    this.ocupado = ocupado;
  }
}

export class Tablero {
  constructor(filas, columnas) {
    this.filas = filas;
    this.columnas = columnas;
    this.casilleros = [];
    this.initTablero();
  }

  initTablero() {
    //inicializa el tablero en forma de cruz (7x7), el 7x7 esta pasado desde la vista
    for (let y = 0; y < this.filas; y++) {
      const fila = [];
      for (let x = 0; x < this.columnas; x++) {
        // Configuración tipo cruz (7x7), los dos primeros y ultimos de las primeras dos filas y ultimas dos son nulos
        const valido =
          (x >= 2 && x <= 4) || (y >= 2 && y <= 4)
            ? true
            : false;
            //lo agrega al casillero si es valido y no es el del centro
        fila.push(new Casillero(x, y, valido && !(x === 3 && y === 3)));
      }
      this.casilleros.push(fila);
    }
  }

  getCasillero(x, y) {
    //sin esto te tomaria como valido cualquier casillero fuera de la cruz ya que existe en el array y estan vacios (sin fichas)
    if (
      x < 0 ||
      y < 0 ||
      y >= this.filas ||
      x >= this.columnas ||
      !((x >= 2 && x <= 4) || (y >= 2 && y <= 4))
    ) {
      return null; // fuera del tablero o en zona no válida ya que es una cruz
    }
    return this.casilleros[y][x];
  }

  posiblesMovimientos(cx, cy) {
    //de dos en dos tanto en x como en y
    const saltos = [
      { dx: 0, dy: -2 },
      { dx: 0, dy: 2 },
      { dx: -2, dy: 0 },
      { dx: 2, dy: 0 },
    ];
    const moves = [];
    const origen = this.getCasillero(cx, cy);
    //si en el origen no hay nada vuelve
    if (!origen || !origen.ocupado) return moves;

    //define el casillero a saltar (medio) que debe estar ocupado y el destino que debe estar vacio
    for (let { dx, dy } of saltos) {
        //la mitad del salto es ek casillero intermedio
      const medio = this.getCasillero(cx + dx / 2, cy + dy / 2);
      const destino = this.getCasillero(cx + dx, cy + dy);
      if (medio && destino && medio.ocupado && !destino.ocupado) {
        //guarda las coordenadas de los destinos validos y las retorna
        moves.push(destino);
      }
    }
    return moves;
  }

  mover(cx, cy, nx, ny) {
    //casillero intermedio entre origen C y destino N
    const medio = this.getCasillero((cx + nx) / 2, (cy + ny) / 2);
    const origen = this.getCasillero(cx, cy);
    const destino = this.getCasillero(nx, ny);
    //si todo es valido realiza el movimiento (desocupa el origen, el medio xq come la ficha y ocupa el destino)
    if (origen && destino && medio && medio.ocupado && destino.ocupado === false) {
      origen.ocupado = false;
      medio.ocupado = false;
      destino.ocupado = true;
    }
  }
}