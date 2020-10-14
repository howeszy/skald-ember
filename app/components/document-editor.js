import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action, get } from '@ember/object';

export default class DocumentEditorComponent extends Component {
  @tracked view = 'fit';
  @tracked signers = [];
  @tracked isAdding = false;
  
  get focused() {
    return this.args
               .document
               .fields
               .toArray()
               .find((f) => f.focused);
  }

  constructor(owner, args) {
    super(owner, args);
    get(this.args.document, 'signers').then((signers) => {
      this.signers = signers.toArray();
    })
  }

  @action
  setView(value) {
    this.view = value
  }

  @action
  toggleIsAdding() {
    if (this.isAdding) {
      this.cleanFields();
      this.isAdding = false;
    } else {
      this.addField();
      this.isAdding = true;
    }
  }
}
