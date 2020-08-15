import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Component | document/interactive-field', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let component = this.owner.factoryFor('component:document/interactive-field').create();
    assert.ok(component);
  });
});
