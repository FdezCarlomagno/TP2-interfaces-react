export class GameController {
  constructor(model, viewCallback) {
    this.model = model;
    this.viewCallback = viewCallback;
    this.selected = null;
    this.validMoves = [];
  }

  selectPiece(x, y) {
    //le pide las coordenadas al modelo
    const c = this.model.getCasillero(x, y);
    if (c && c.ocupado) {
      this.selected = c;
      this.validMoves = this.model.posiblesMovimientos(x, y);
      //refrescar la vista
      this.viewCallback();
    }
  }

  movePiece(nx, ny) {
    if (!this.selected) return;
    const destino = this.model.getCasillero(nx, ny);
    if (
      destino &&
      this.validMoves.find((m) => m.x === destino.x && m.y === destino.y)
    ) {
      this.model.mover(this.selected.x, this.selected.y, destino.x, destino.y);
    }
    this.selected = null;
    this.validMoves = [];
    //para refrescar la vista
    this.viewCallback();
  }

  clearSelection() {
    this.selected = null;
    this.validMoves = [];
    //para refrescar la vista
    this.viewCallback();
  }
}