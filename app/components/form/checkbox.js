import Component from '@glimmer/component';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';

export default class FormCheckboxComponent extends Component {
  inputId = "form-input-" + guidFor(this);
  element;

  @action
  setup(element) {
    this.element = element;

    if (this.args.value == true) {
      element.checked = true;
    }
  }

  @action
  teardown() {
    //nothing for now
  }

  @action
  change() {
    if (this.args.onChange) {
      this.args.onChange(this.element.checked);
    }
  }  
}
