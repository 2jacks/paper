import paper from 'paper'

import { grid } from './Grid'

export class Move {
  constructor() {
    this.tool = new paper.Tool()
    this.tool.name = 'move'
    this.tool.onMouseMove = this.onMouseMove
    this.tool.onMouseDrag = this.onMouseDrag
    this.tool.onMouseDown = this.onMouseDown
    this.tool.onMouseUp = this.onMouseUp

    this.selectedItems = []
    this.selectionRect = null
  }

  setCallbacks(callbacks) {
    Object.entries(callbacks).forEach(([name, cb]) => {
      this[name] = cb
    })
  }

  activate() {
    this.tool.activate()
  }
  onMouseMove = e => {
    //console.log(e)
    // this.selectedItem = e.item
    // this.selectedItem.selected = true
  }
  onMouseDrag = e => {
    if (this.selectedItems) {
      this.selectedItems.forEach(item => {
        item.position.x += e.delta.x
        item.position.y += e.delta.y
      })
    }
    if (this.selectionRect) {
      this.selectionRect.remove()

      this.selectionRect = new paper.Path.Rectangle(
        new paper.Rectangle(
          new paper.Point(e.downPoint.x, e.downPoint.y),
          new paper.Point(e.lastPoint.x, e.lastPoint.y)
        )
      )
      this.selectionRect.fillColor = 'rgba(0,0,0,0.2)'

      // let items = paper.project.activeLayer.getItems()
      // items.forEach(item => {
      //   if (
      //     item.intersects(this.selectionRect) ||
      //     item.isInside(this.selectionRect.bounds)
      //   ) {
      //     item.selected = true
      //     this.selectedItems.push(item)
      //   } else {
      //     item.selected = false
      //   }
      // })
    }

    // if (e.item) {
    //   this.selectedItems.forEach(item => {
    //     item.position.x += e.delta.x
    //     item.position.y += e.delta.y
    //   })
    // }
  }
  onMouseDown = e => {
    if (e.item) {
      e.item.selected = true
      if (e.event.ctrlKey) {
        this.selectedItems.push(e.item)
      } else {
        this.selectedItems.forEach(item => {
          item.selected = false
        })
        e.item.selected = true
        this.selectedItems = [e.item]
      }
    } else {
      this.selectedItems.forEach(item => {
        item.selected = false
      })
      this.selectedItems = []

      this.selectionRect = new paper.Path.Rectangle(
        new paper.Rectangle(
          new paper.Point(e.point.x, e.point.y),
          new paper.Point(e.point.x, e.point.y)
        )
      )
    }
  }
  onMouseUp = e => {
    if (this.selectionRect) {
      let items = paper.project.activeLayer.getItems()
      items.forEach(item => {
        if (
          item.intersects(this.selectionRect) ||
          item.isInside(this.selectionRect.bounds)
        ) {
          item.selected = true
          this.selectedItems.push(item)
        } else {
          item.selected = false
        }
      })

      this.selectionRect.remove()
      this.selectionRect = null
    }
    this.onSelect(this.selectedItems)
  }
}

export const move = new Move()
