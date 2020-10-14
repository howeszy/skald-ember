import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class DocumentViewportComponent extends Component {
  @tracked width;
  @tracked height;
  @tracked element;

  get zoom() {
    const { width } = this;
    const { view, document } = this.args;

    if (isNaN(view)) {
      return (width / document.width);
    } else {
      return (view/100);
    }
  }

  @action
  setup(element) {
      this.element = element;
      this.resize();
  }

  @action
  resize() {
    this.width = this.element.clientWidth;
    this.height = this.element.clientHeight;
  }
}
