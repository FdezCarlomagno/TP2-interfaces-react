import pelotaImg from "../../../assets/imgs/Pelotafutbol.png";
import pelotaImg2 from "../../../assets/imgs/football1.png"
import pelotaImg3 from "../../../assets/imgs/football2.png"
import pelotaImg4 from "../../../assets/imgs/football3.png"
import pelotaImg5 from "../../../assets/imgs/football4.png"

export class Ficha {
  constructor(tipo, imagen) {
    this.tipo = tipo
    this.imagen = imagen
  }
}

export class Casillero {
  constructor(x, y, ocupado = false, ficha) {
    this.x = x;
    this.y = y;
    this.ficha = ficha
    this.ocupado = ocupado;
  }
}

export class Tablero {
  constructor(filas = 9, columnas = 9, imagenes = []) {
    this.filas = filas;
    this.columnas = columnas;
    this.casilleros = [];
    this.initTablero(imagenes);
  }

  initTablero(imagenes) {
    //inicializa el tablero en forma de cruz (7x7), el 7x7 esta pasado desde la vista
    for (let y = 0; y < this.filas; y++) {
      const fila = [];
      for (let x = 0; x < this.columnas; x++) {
        // Configuración tipo cruz (7x7), los dos primeros y ultimos de las primeras dos filas y ultimas dos son nulos
        const valido = this.esValido(x, y)
        let ficha = null
        if (valido && !(x === 4 && y === 4)) {

          //lo agrega al casillero si es valido y no es el del centro
          const img = imagenes[Math.floor(Math.random() * imagenes.length)]
          const tipo = `tipo-${Math.floor(Math.random() * imagenes.length)}`;
          ficha = new Ficha(tipo, img)
        }
        fila.push(new Casillero(x, y, ficha !== null, ficha));
      }
      this.casilleros.push(fila);
    }
  }

  getAllEmptyCasilleros() {
    const vacios = [];
    for (let y = 0; y < this.filas; y++) {
      for (let x = 0; x < this.columnas; x++) {
        const c = this.getCasillero(x, y);
        if (c && !c.ocupado) {
          vacios.push(c);
        }
      }
    }
    return vacios;
  }


  getCasillero(x, y) {
    //sin esto te tomaria como valido cualquier casillero fuera de la cruz ya que existe en el array y estan vacios (sin fichas)
    if (
      x < 0 ||
      y < 0 ||
      y >= this.filas ||
      x >= this.columnas ||
      !this.esValido(x, y)
    ) {
      return null; // fuera del tablero o en zona no válida ya que es una cruz
    }
    return this.casilleros[y][x];
  }

  esValido(x, y) {
    return (x >= 3 && x <= 5) || (y >= 3 && y <= 5) ? true : false
  }

  usuarioPierde() {
    for (let y = 0; y < this.filas; y++) {
      for (let x = 0; x < this.columnas; x++) {
        const casillero = this.getCasillero(x, y)
        if (!casillero || !casillero.ocupado) {
          continue
        }

        if (this.posiblesMovimientos(x, y).length > 0) {
          return false;
        }
      }
    }
    return true;
  }

  usuarioGana() {
    return this.getCasillero(3, 3).ocupado
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

  mover(cx, cy, nx, ny, fichaSetter) {
    const medio = this.getCasillero((cx + nx) / 2, (cy + ny) / 2);
    const origen = this.getCasillero(cx, cy);
    const destino = this.getCasillero(nx, ny);

    if (origen && destino && medio && medio.ocupado && !destino.ocupado) {
      // Guardar copia de la ficha comida ANTES de eliminarla
      const eatenFicha = {
        x: medio.x,
        y: medio.y,
        img: medio.ficha?.imagen || null,
      };

      // Mover la ficha
      destino.ficha = origen.ficha;
      origen.ficha = null;
      medio.ficha = null;

      // Actualizar flags
      destino.ocupado = true;
      origen.ocupado = false;
      medio.ocupado = false;

      fichaSetter(prev => prev - 1);
      return eatenFicha; // devolvemos un objeto listo para animar
    }
    return null;
  }



  resetGame(imagenes = []) {
    // this.initTablero()
    this.initTablero(imagenes)
  }
}