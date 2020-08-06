import Component from '@glimmer/component';
import { bind, run } from '@ember/runloop';
import { get } from '@ember/object';

export default class BasicFieldComponent extends Component {
  get field() {
    return this.args.field;
  }

  get viewport() {
    return this.args.viewport;
  }

  get signerClass() {
    return `signer-${get(this.args.field, 'signer.order')}`;
  }

  get onSetup() {
    return this.args.onSetup || (() => { true });
  }

  setup(component, viewport, element) {
    run(bind(viewport, component.onSetup, component.field.id, element));
  }
}
