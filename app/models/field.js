import Model, { attr, belongsTo } from '@ember-data/model';
import { tracked } from '@glimmer/tracking';
import { v4 as uuidv4 } from 'uuid';

export default class FieldModel extends Model {
  //Meta Information
  @attr('number', {defaultValue: 12}) fontSize;
  @attr('string', {defaultValue: 'times'}) fontFamily ;
  @attr('number', {defaultValue: 0}) height;
  @attr name;
  @attr('boolean', {defaultValue: false}) required;
  @attr('string', {defaultValue: 'single'}) type;
  @attr('number', {defaultValue: 0}) width;
  @attr('number', {defaultValue: 0}) x;
  @attr('number', {defaultValue: 0}) y;

  //Additional Information
  @attr value;

  //App Information
  @tracked pending;
  @tracked focused;
  guid;

  get order() {
    return this.signer.get('order');
  }

  set pending(bool) {
    this.pending = bool;
  }

  constructor(args) {
    super(args)

    this.pending = false;
    this.guid = uuidv4();
  }

  @belongsTo('document') document;
  @belongsTo('signer') signer;
}
