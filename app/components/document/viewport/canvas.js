import Component from '@glimmer/component';
import Cardinal from 'skald/utils/cardinal' 
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';

export default class DocumentViewportCanvasComponent extends Component {
  @service store;

  element;
  targeting = false;
  focusing = false;
  state = { };

  get focused() {
    return this.args
               .document
               .fields
               .toArray()
               .find((f) => f.focused);
  }

  get style() {
    const { zoom, document } = this.args;
    const { width, height, src } = document; 

    return htmlSafe(`
      width: ${width * zoom}px;
      height: ${height * zoom}px;
      font-size: ${10 * zoom}pt;
      background-image: url(${src});
    `);
  }

  setOrigin({ layerX, layerY }, field, fieldElement, zone) {
    this.state.origin = {
      field: field,
      fieldElement: fieldElement,
      zone: zone,
      layerX: layerX,
      layerY: layerY,
      offsetLeft: fieldElement.offsetLeft,
      offsetTop: fieldElement.offsetTop
    }
  }

  clearState() {
    this.state = {}
  }

  captureField(event, field, fieldElement, zone) {
    this.focusing = true;
    this.targeting = true;

    if (zone == Cardinal.body) {
      this.state.dragging = true
    } else if (zone != Cardinal.body) {
      this.state.resizing = true
    }

    this.setOrigin(event, field, fieldElement, zone);
  }

  releaseField(event, field) {
    if (this.focusing) {
      if (!this.focused) {
        field.focused = true;
      } else if (this.focused.guid == field.guid) {
        this.focused.focused = false;
      } else {
        this.focused.focused = false;
        field.focused = true;
      }
    }

    this.focusing = false;
    this.targeting = false;
    this.clearState();
  }

  transformField(event, field, fieldElement, zone) {
    if (this.targeting) {
      this.focusing = false;
      if (this.state.dragging) {
        this.drag(event, field, fieldElement);
      } else if (this.state.resizing) {
        this.resize(event, field, fieldElement, zone)
      }
    }
  }

  resolveCurrentPosition( {target, layerX, layerY}, fieldElement) {
    if (target == fieldElement) {
      return { layerX, layerY }
    } else if (target == this.element) {
      return {
        layerX: layerX - this.state.origin.offsetLeft,
        layerY: layerY - this.state.origin.offsetTop
      }
    }
  }

  drag(event, field, fieldElement, zone) {
    let { type, movementX, movementY } = event;
    let { layerX, layerY } = this.resolveCurrentPosition(event, fieldElement);

    if (layerX < 0) {
      movementX = movementX + layerX
      layerX = 0;
    } else if (layerX > fieldElement.offsetWidth) {
      movementX = movementX - (fieldElement.offsetWidth - layerX)
      layerX = fieldElement.offsetWidth;
    }

    if (layerY < 0) {
      movementY = movementY + layerY
      layerY = 0;
    } else if (layerY > fieldElement.offsetHeight) {
      movementY = movementY - (fieldElement.offsetHeight - layerY)
      layerY = fieldElement.offsetHeight;
    }


    if((fieldElement.offsetLeft + movementX ) <= 0) {
      field.x = 0;
    } else if ((fieldElement.offsetLeft + movementX + fieldElement.offsetWidth) >= fieldElement.offsetParent.offsetWidth) {
      field.x = ((fieldElement.offsetParent.offsetWidth - fieldElement.offsetWidth) / fieldElement.offsetParent.offsetWidth) * 100
    } else {
      field.x = ((fieldElement.offsetLeft + movementX) / fieldElement.offsetParent.offsetWidth) * 100
    }

    if((fieldElement.offsetTop + movementY) <= 0) {
      field.y = 0;
    } else if ((fieldElement.offsetTop + movementY + fieldElement.offsetHeight) >= fieldElement.offsetParent.offsetHeight) {
      field.y = ((fieldElement.offsetParent.offsetHeight - fieldElement.offsetHeight) / fieldElement.offsetParent.offsetHeight) * 100
    } else {
      field.y = ((fieldElement.offsetTop + movementY) / fieldElement.offsetParent.offsetHeight) * 100
    }

    this.setOrigin(
      {
        layerX: type != 'wheel' ? layerX : this.state.origin.layerX,
        layerY: type != 'wheel' ? layerY : this.state.origin.layerY
      },
      field,
      fieldElement,
      zone
    )
  }

  resize(event, field, fieldElement, zone) {
    let { type, movementX, movementY } = event;
    let { layerX, layerY } = this.resolveCurrentPosition(event, fieldElement);

    if (zone.x >= 0) {
      if (zone.x > 0) {
        movementX = (layerX - fieldElement.offsetWidth)

        // set minimum size here
        if ((fieldElement.offsetWidth + movementX) < 5) {
          movementX = fieldElement.offsetWidth > 5 ? 5 - fieldElement.offsetWidth : 0;
        }
        
        field.width = ((fieldElement.offsetWidth + movementX) / fieldElement.offsetParent.offsetWidth) * 100;
      }

      //setup for drag event
      movementX = 0;
    } else if (zone.x < 0) {
        movementX = layerX

        // set minimum size here
      if ((fieldElement.offsetWidth - movementX) < 5) {
        movementX = fieldElement.offsetWidth > 5 ? fieldElement.offsetWidth - 5 : 0;
      }
      field.width = ((fieldElement.offsetWidth - movementX) / fieldElement.offsetParent.offsetWidth) * 100;
    }

    if (zone.y >= 0) {
      if (zone.y > 0) {
        movementY = (layerY - fieldElement.offsetHeight)

        // set minimum size here
        if ((fieldElement.offsetHeight + movementY) < 5) {
          movementY = fieldElement.offsetHeight > 5 ? 5 - fieldElement.offsetHeight : 0;
        }
        
        field.height = ((fieldElement.offsetHeight + movementY) / fieldElement.offsetParent.offsetHeight) * 100;
      }

      //setup for drag event
      movementY = 0;
    } else if (zone.y < 0) {
        movementY = layerY

        // set minimum size here
      if ((fieldElement.offsetHeight - movementY) < 5) {
        movementY = fieldElement.offsetHeight > 5 ? fieldElement.offsetHeight - 5 : 0;
      }
      field.height = ((fieldElement.offsetHeight - movementY) / fieldElement.offsetParent.offsetHeight) * 100;
    }
    
    this.drag(
      {
        target: fieldElement,
        type,
        movementX, 
        movementY, 
        layerX: 0,
        layerY: 0
      }, 
      field, 
      fieldElement,
      zone
    );
  }

  @action
  setup(element) {
    this.element = element;
  }

  @action
  interaction(event, field, fieldElement, zone) {
    if (this.state.origin) {
      field = this.state.origin.field
      fieldElement = this.state.origin.fieldElement
      zone = this.state.origin.zone
    }

    switch(event.type) {
      case 'mousedown':
        this.captureField(event, field, fieldElement, zone);
        break;
      case 'mouseup':
        this.releaseField(event, field);
        break;
      case 'mousemove':
      case 'wheel':
        this.transformField(event, field, fieldElement, zone);
        break;
    }
  }

  @action
  mouseevent(event) {
    if (this.state.origin) {
      this.interaction(event);
    }
  }

  @action
  wheel(event) {
    if (this.state.origin) {
      event.stopPropagation();
    }
  }
}
