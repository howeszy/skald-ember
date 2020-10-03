import Component from '@glimmer/component';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import M from 'materialize-css';

export default class FormSelectComponent extends Component {
  inputId = "form-input-" + guidFor(this);
  element;

  @action
  setup(element) {
    this.element = element;
    const value = this.args.value;
    const selecteds = Array.from(element.getElementsByTagName('option'))
                           .filter((e) => e.hasAttribute('selected'));

    if (value) { //set selection to value
      const valueIndex = Array.from(element.getElementsByTagName('option'))
                              .findIndex((e) => e.value == value);

      if(valueIndex) {
        selecteds.forEach((e) => e.removeAttribute('selected'));
  
        element.getElementsByTagName('option')[valueIndex]
               .setAttribute('selected', '');
  
        element.selectedIndex = valueIndex;
      }
    } else if (this.args.placeholder) {  //unset placeholder selected if needed
      if (selecteds.length > 1) {
        selecteds[0].removeAttribute('selected');
      }
    }

    M.FormSelect.init(element);
  }

  @action
  teardown(element) {
    M.FormSelect.getInstance(element).destroy();
  }

  @action
  change({ target }) {
    if (this.args.onChange) {
      const value = target.options[target.selectedIndex].value
      this.args.onChange(value);
    }
  }
}
