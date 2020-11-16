import Component from '@glimmer/component';
import Cardinal from 'skald/utils/cardinal' 
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class DocumentViewportCanvasComponent extends Component {
  @service store;

  @tracked wrapper;

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

  setOrigin({ layerX, layerY }, field, element, zone) {
    this.state.origin = {
      field: field,
      element: element,
      zone: zone,
      layerX: layerX,
      layerY: layerY,
      offsetLeft: element.offsetLeft,
      offsetTop: element.offsetTop
    }
  }

  clearState() {
    this.state = {}
  }

  captureField(event, field, element, zone) {
    this.focusing = true;
    this.targeting = true;

    if (zone == Cardinal.body) {
      this.state.dragging = true
    } else if (zone != Cardinal.body) {
      this.state.resizing = true
    }

    this.setOrigin(event, field, element, zone);
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

  transformField(event, field, element, zone) {
    if (this.targeting) {
      this.focusing = false;
      if (this.state.dragging) {
        this.drag(event, field, element);
      } else if (this.state.resizing) {
        this.resize(event, field, element, zone)
      }
    }
  }

  drag({ type, movementX, movementY, layerX, layerY }, field, element, zone) {
    if (layerX < 0) {
      movementX = movementX + layerX
    } else if (layerX > element.offsetWidth) {
      movementX = movementX - (element.offsetWidth - layerX)
    }

    if (layerY < 0) {
      movementY = movementY + layerY
    } else if (layerY > element.offsetHeight) {
      movementY = movementY - (element.offsetHeight - layerY)
    }


    if((element.offsetLeft + movementX ) <= 0) {
      field.x = 0;
    } else if ((element.offsetLeft + movementX + element.offsetWidth) >= element.offsetParent.offsetWidth) {
      field.x = ((element.offsetParent.offsetWidth - element.offsetWidth) / element.offsetParent.offsetWidth) * 100
    } else {
      field.x = ((element.offsetLeft + movementX) / element.offsetParent.offsetWidth) * 100
    }

    if((element.offsetTop + movementY) <= 0) {
      field.y = 0;
    } else if ((element.offsetTop + movementY + element.offsetHeight) >= element.offsetParent.offsetHeight) {
      field.y = ((element.offsetParent.offsetHeight - element.offsetHeight) / element.offsetParent.offsetHeight) * 100
    } else {
      field.y = ((element.offsetTop + movementY) / element.offsetParent.offsetHeight) * 100
    }

    this.setOrigin(
      {
        layerX: type != 'wheel' ? layerX : this.state.origin.layerX,
        layerY: type != 'wheel' ? layerY : this.state.origin.layerY
      },
      field,
      element,
      zone
    )
  }

  resize({movementX, movementY, layerX, layerY}, field, element, zone) {
    if (zone.x >= 0) {
      if (zone.x > 0) {
        movementX = (layerX - element.offsetWidth)

        // set minimum size here
        if ((element.offsetWidth + movementX) < 5) {
          movementX = element.offsetWidth > 5 ? 5 - element.offsetWidth : 0;
        }
        
        field.width = ((element.offsetWidth + movementX) / element.offsetParent.offsetWidth) * 100;
      }

      //setup for drag event
      movementX = 0;
      layerX = 0;
    } else if (zone.x < 0) {
        movementX = layerX

        // set minimum size here
      if ((element.offsetWidth - movementX) < 5) {
        movementX = element.offsetWidth > 5 ? element.offsetWidth - 5 : 0;
      }
      field.width = ((element.offsetWidth - movementX) / element.offsetParent.offsetWidth) * 100;
    }

    if (zone.y >= 0) {
      if (zone.y > 0) {
        movementY = (layerY - element.offsetHeight)

        // set minimum size here
        if ((element.offsetHeight + movementY) < 5) {
          movementY = element.offsetHeight > 5 ? 5 - element.offsetHeight : 0;
        }
        
        field.height = ((element.offsetHeight + movementY) / element.offsetParent.offsetHeight) * 100;
      }

      //setup for drag event
      movementY = 0;
      layerY = 0;
    } else if (zone.y < 0) {
        movementY = layerY

        // set minimum size here
      if ((element.offsetHeight - movementY) < 5) {
        movementY = element.offsetHeight > 5 ? element.offsetHeight - 5 : 0;
      }
      field.height = ((element.offsetHeight - movementY) / element.offsetParent.offsetHeight) * 100;
    }
    
    this.drag(
      {
        movementX, 
        movementY, 
        layerX: 0, 
        layerY: 0 
      }, 
      field, 
      element,
      zone
    );
  }

  @action
  setup(element) {
    this.element = element;
  }

  @action
  interaction(event, field, element, zone) {
    if (this.state.origin) {
      field = this.state.origin.field
      element = this.state.origin.element
      zone = this.state.origin.zone
    }

    switch(event.type) {
      case 'mousedown':
        this.captureField(event, field, element, zone);
        break;
      case 'mouseup':
        this.releaseField(event, field);
        break;
      case 'mousemove':
      case 'wheel':
        this.transformField(event, field, element, zone);
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
