export class GameController {
  constructor(model, viewCallback, animateEatenPieceCallback) {
    this.model = model;
    this.viewCallback = viewCallback;
    this.animateEatenPieceCallback = animateEatenPieceCallback;
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

  usuarioPierde(){
    return this.model.usuarioPierde()
  }

  usuarioGana(){
    return this.model.usuarioGana()
  }

  movePiece(nx, ny, fichaSetter) {
    if (!this.selected) return;
    const destino = this.model.getCasillero(nx, ny);
    if (
      destino &&
      this.validMoves.find((m) => m.x === destino.x && m.y === destino.y)
    ) {
      const eatenPiece = this.model.mover(this.selected.x, this.selected.y, destino.x, destino.y, fichaSetter);
      if (eatenPiece && this.animateEatenPieceCallback) {
        this.animateEatenPieceCallback(eatenPiece);
      }
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

  resetGame(){
    this.selected = null;
    this.validMoves = [];
    this.model.resetGame()
    this.viewCallback()
  }
}