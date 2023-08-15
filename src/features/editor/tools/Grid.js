import paper from 'paper'

class Grid {
  setDimensions({ cellSize, boundingRect }) {
    this.cellSize = cellSize
    this.boundingRect = boundingRect
  }

  buildGrid() {
    let cells_per_width = this.boundingRect.width / this.cellSize
    let cells_per_height = this.boundingRect.height / this.cellSize

    let gridGroup = new paper.Group()
    gridGroup.name = 'grid'
    gridGroup.locked = true

    for (let i = 0; i < cells_per_width; i++) {
      for (let j = 0; j < cells_per_height; j++) {
        let cell = new paper.Path.Rectangle(
          this.boundingRect.x + i * this.cellSize,
          this.boundingRect.y + j * this.cellSize,
          this.cellSize,
          this.cellSize
        )
        cell.strokeColor = 'black'
        cell.fillColor = 'white'
        cell.strokeWidth = 0.03

        gridGroup.addChild(cell)
      }
    }

    //gridGroup.sendToBack()

    // TODO: Заменить на линии, проверить производительность. Сейчас это для производительности на большом количестве прямоугольников
    let gridRaster = gridGroup.rasterize()
    gridGroup.sendToBack()
    gridRaster.locked = true
    gridRaster.addTo(paper.project.activeLayer)

    gridGroup.remove()
  }

  // Нужны абсолютные координаты ТОЧКИ (объекта, который позиционируется от нее)
  snapPointToGrid({ currentPosition, cursor, tolerance = 10 }) {
    let newPosition = {
      x: currentPosition.x,
      y: currentPosition.y
    }

    let nearestXBorder = Math.round(cursor.x / this.cellSize) * this.cellSize
    let nearestYBorder = Math.round(cursor.y / this.cellSize) * this.cellSize

    let xOffset = cursor.x - nearestXBorder
    let yOffset = cursor.y - nearestYBorder

    newPosition.x =
      Math.abs(xOffset) <= tolerance ? nearestXBorder : newPosition.x
    newPosition.y =
      Math.abs(yOffset) <= tolerance ? nearestYBorder : newPosition.y

    return newPosition
  }

  // Магнит относительно границ фигуры (bbox) без учета загиба handles
  snapShapeToGrid({ shape, cursor, tolerance = 10 }) {
    console.log(shape.internalBounds)

    let bbox = shape.internalBounds
    let newPosition = { x: shape.position.x, y: shape.position.y }

    let leftClosetBorder = Math.round(bbox.left / this.cellSize) * this.cellSize
    let rightClosetBorder =
      Math.round(bbox.right / this.cellSize) * this.cellSize
    let topClosetBorder = Math.round(bbox.top / this.cellSize) * this.cellSize
    let bottomClosetBorder =
      Math.round(bbox.bottom / this.cellSize) * this.cellSize

    let leftOffset = Math.abs(bbox.left - leftClosetBorder)
    let rightOffset = Math.abs(bbox.right - rightClosetBorder)
    let topOffset = Math.abs(bbox.top - topClosetBorder)
    let bottomOffset = Math.abs(bbox.bottom - bottomClosetBorder)

    // if (
    //   (leftOffset <= tolerance || rightOffset <= tolerance) &&
    //   leftOffset < rightOffset
    // ) {
    //   newPosition.x += rightOffset
    // }
    // if (
    //   (leftOffset <= tolerance || rightOffset <= tolerance) &&
    //   leftOffset > rightOffset
    // ) {
    //   newPosition.x -= leftOffset
    // }

    // if (
    //   (topOffset <= tolerance || bottomOffset <= tolerance) &&
    //   topOffset < bottomOffset
    // ) {
    //   newPosition.y += bottomOffset
    // }
    // if (
    //   (topOffset <= tolerance || bottomOffset <= tolerance) &&
    //   topOffset > bottomOffset
    // ) {
    //   newPosition.y -= topOffset
    // }

    if (leftOffset < rightOffset) {
      newPosition.x += rightOffset
    }
    if (leftOffset > rightOffset) {
      newPosition.x -= leftOffset
    }

    if (topOffset < bottomOffset) {
      newPosition.y += bottomOffset
    }
    if (topOffset > bottomOffset) {
      newPosition.y -= topOffset
    }

    console.log(newPosition)

    return newPosition
  }
}

export const grid = new Grid()
