import paper from 'paper'

import { grid } from './Grid'

export class CreatePath {
  hitOptions = {
    segments: true,
    stroke: true,
    curves: true,
    handles: true,
    fill: true,
    guide: false,
    tolerance: 5
  }

  constructor() {
    this.tool = new paper.Tool()
    this.tool.name = 'createPath'

    this.tool.onMouseDown = this.onMouseDown
    this.tool.onMouseDrag = this.onMouseDrag
    this.tool.onKeyDown = this.onKeyDown
    this.tool.onKeyUp = this.onKeyUp

    this.path = null

    this.selectedSegment = null
    this.selectedPath = null
  }
  isSegmentHitted = hit =>
    hit && hit.item === this.path && hit.type === 'segment'
  isBorderHitted = hit => hit && hit.item === this.path && hit.type === 'stroke'
  isInnerHitted = hit => hit && hit.item === this.path && hit.type === 'fill'

  setCallbacks(callbacks) {
    Object.entries(callbacks).forEach(([name, cb]) => {
      this[name] = cb
    })
  }

  activate(editingPath = null) {
    paper.project.selectedItems.forEach(item => {
      item.selected = false
    })
    if (this.path) {
      this.path = null
    }
    if (editingPath) {
      editingPath.selected = true
      editingPath.fullySelected = true

      editingPath.segments.forEach(segment => {
        segment.selected = true
        segment.handleIn.selected = true
      })
      this.path = editingPath
    }

    this.tool.activate()
  }
  stop() {
    if (paper.tool.name === this.tool.name) {
      paper.tool = null
    }
  }

  complete() {
    let clone = this.path.clone()
    this.onComplete(clone)

    this.path.remove()
    this.path = null

    this.stop()
  }
  cancel = () => {
    this.onCancel()

    //this.path.remove()
    this.path = null

    this.stop()
  }

  onMouseDown = e => {
    this.selectedPath = this.selectedSegment = this.selectedHandle = null

    let hit = paper.project.hitTest(e.point, this.hitOptions)

    // Тык по пустому месту
    if (e.event.ctrlKey && e.event.which !== 3) {
      if (!this.path) {
        this.path = new paper.Path()
        this.path.style = {
          fillColor: 'rgba(0,255,0,0.5)',
          strokeColor: 'rgba(0,0,0,0.5)',
          strokeWidth: 1
        }
        this.path.fullySelected = true
        this.path.closed = true
      }
      this.path.fullySelected = true
      this.appendSegment(e.point)
      return
    }
    if (hit) {
      // Тык по фигуре (внутри)
      if (this.isInnerHitted(hit) && e.event.which !== 3) {
        this.selectedPath = hit.item
      }

      // Тык по точке изгиба
      if (this.isSegmentHitted(hit)) {
        this.selectedSegment = hit.segment
        if (e.event.which === 3) {
          this.removeSegment(this.selectedSegment)
        }
      }

      // Тык по границе
      if (this.isBorderHitted(hit) && e.event.which !== 3) {
        this.selectedSegment = this.insertSegment(
          hit.location.index + 1,
          e.point
        )
      }

      if (hit.type === 'handle-in') {
        this.selectedSegment = hit.segment
        this.selectedHandle = hit.segment.handleIn
      }
    }
  }
  onMouseDrag = e => {
    if (this.selectedSegment && !this.selectedHandle) {
      this.moveSegment(e.point, e.delta)
    }
    if (this.selectedPath) {
      this.moveShape(e.point, e.delta)
    }
    if (this.selectedSegment && this.selectedHandle) {
      this.moveHandle(this.selectedSegment, e.point, e.delta)
    }
  }
  onKeyDown = e => {
    if (e.key === 'enter') {
      this.complete()
    }
    if (e.key === 'escape') {
      this.cancel()
    }
  }
  onKeyUp = e => {
    return
  }

  appendSegment(point) {
    this.path.add(new paper.Point(point.x, point.y))

    let prevSegment = this.path.segments.at(-2) || null

    let handleIn = this.path.segments.at(-1).handleIn

    if (prevSegment) {
      handleIn.x = -(point.x - prevSegment.point.x) / 2
      handleIn.y = -(point.y - prevSegment.point.y) / 2
    } else {
      handleIn.x -= 10
      handleIn.y -= 10
    }

    handleIn.selected = true
  }
  removeSegment(segment) {
    segment.remove()
  }
  insertSegment(location, point) {
    let segment = this.path.insert(location, point)

    segment.handleIn.x =
      -(point.x - this.path.segments[location - 1].point.x) / 2

    segment.handleIn.y =
      -(point.y - this.path.segments[location - 1].point.y) / 2

    segment.handleIn.selected = true
  }

  moveShape(cursor, delta) {
    this.selectedPath.position.x += delta.x
    this.selectedPath.position.y += delta.y

    // TODO:
    // let newPosition = grid.snapShapeToGrid({
    //   shape: this.selectedPath,
    //   cursor: cursor
    // })

    // this.selectedPath.position.x = newPosition.x
    // this.selectedPath.position.y = newPosition.y
  }
  moveHandle(segment, cursor, delta) {
    this.selectedHandle.x += delta.x
    this.selectedHandle.y += delta.y

    let newPosition = grid.snapPointToGrid({
      currentPosition: {
        x: segment.point.x + this.selectedHandle.x,
        y: segment.point.y + this.selectedHandle.y
      },
      cursor: cursor
    })

    this.selectedHandle.x = newPosition.x - segment.point.x
    this.selectedHandle.y = newPosition.y - segment.point.y
  }
  moveSegment(cursor, delta) {
    this.selectedSegment.point.x += delta.x
    this.selectedSegment.point.y += delta.y

    let globalPos = this.path.localToGlobal(this.selectedSegment.point)
    let newPosition = grid.snapPointToGrid({
      currentPosition: globalPos,
      cursor: cursor
    })

    this.selectedSegment.point.x = newPosition.x
    this.selectedSegment.point.y = newPosition.y
  }

  showSegments() {
    this.path.fullySelected = true
    this.path.segments.forEach(segment => {
      segment.handleIn.selected = true
      segment.handleOut.selected = true
    })
  }
  hideSegments() {
    this.path.fullySelected = false
    this.path.segments.forEach(segment => {
      segment.handleIn.selected = false
      segment.handleOut.selected = false
    })
  }
}

export const createPath = new CreatePath()
