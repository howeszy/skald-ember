import Component from '@glimmer/component';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import M from 'materialize-css';

export default class FormInputComponent extends Component {
  inputId = "form-input-" + guidFor(this);
  element

  get type() {
    return this.args.type || 'text';
  }

  @action
  setup(element) {
    this.element = element;
    M.updateTextFields();
  }

  @action
  teardown() {
    //nothing for now
  }

  @action
  change() {
    if (this.args.onChange) {
      this.args.onChange(this.element.value);
    }
  }

  @action
  input() {
    if (this.args.onInput) {
      this.args.onInput(this.element.value);
    }
  }
}
