import Component from '@glimmer/component';
import M from 'materialize-css';
import { tracked } from '@glimmer/tracking';
import { action, get } from '@ember/object';
import { inject as service } from '@ember/service';

export default class DocumentEditorComponent extends Component {
  @service store;

  @tracked view = 'fit';
  @tracked fields = [];
  @tracked signers = [];
  @tracked isAdding = false;

  constructor(owner, args) {
    super(owner, args);

    get(this.args.document, 'fields').then((fields) => {
      this.fields = fields.toArray();
    })
    get(this.args.document, 'signers').then((signers) => {
      this.signers = signers.toArray();
    })
  }

  get focused() {
    return this.fields.filter((f) => f.focused);
  }

  setupSelect(elem) {
     M.FormSelect.init(elem);
  }

  addField() {
    let fields = this.fields

    let newRecord = this.store.createRecord('field', { document: this.args.document, signer: this.signers[0]});
    newRecord.pending = true;
    fields.push(newRecord);

    this.fields = fields;
  }

  commitFields() {
    this.fields
        .filter((field) => field.pending)
        .forEach((field) => {
          field.pending = false;
          this.focus(field);
        });
  }

  cleanFields() {
    const nonPendingFields = this.fields.filter((field) => !field.pending);
    
    // Unload pending fields
    this.fields.filter((field) => field.pending)
           .forEach((field) => field.rollbackAttributes());
           
    this.fields = nonPendingFields;
  }


  @action
  commit() {
    this.commitFields();
    this.isAdding = false;
  }

  @action
  transform(field, x, y, width, height) {
    const index = this.fields.findIndex((f) => f.guid == field.guid);

    field.x = x;
    field.y = y;
    field.width = width;
    field.height = height;

    this.fields[index] = field;
  }

  @action
  focus(field) {
    this.fields.forEach((f, i) => {
      if (f.guid == field.guid) {
        f.focused = !f.focused
      } else {
        f.focused = false
      }
      this.fields[i] = f
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
