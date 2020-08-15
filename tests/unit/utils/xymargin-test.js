import {
  bottomRight,
  right,
  bottom
} from 'skald/utils/xymargin';
import { module, test } from 'qunit';

module('Unit | Utility | xymargin', function() {
  module('| bottomRight', function() {
    test('it returns an array of x values', function(assert) {
      let result = bottomRight({width: 30, height: 30, margin: 5});
      assert.equal(result.length, 5);
      assert.equal(result[0][0], 25);
    });

    test('it returns corresponding y values for each x value', function(assert) {
      let result = bottomRight({width: 30, height: 30, margin: 5});
      assert.equal(result[0][1].length, 5);
      assert.equal(result[0][1][0], 25);
    });

    test('it raises an error if height, width, or margin are not present', function(assert) {
      assert.throws(
        (() => bottomRight({width: 30, height: 30})),
        /requires/
      )
    });

    test('it raises an error if height or width are less than the margin', function(assert) {
      assert.throws(
        (() => bottomRight({width: 30, height: 30, margin: 31})),
        /less than/
      )
    });
  });

  module('| right', function() {
    test('it returns an array of x values', function(assert) {
      let result = right({width: 30, height: 30, margin: 5});
      assert.equal(result.length, 5);
      assert.equal(result[0][0], 25);
    });

    test('it returns corresponding y values for each x value', function(assert) {
      let result = right({width: 30, height: 30, margin: 5});
      assert.equal(result[0][1].length, 20);
      assert.equal(result[0][1][0], 5);
    });

    test('it returns an empty array if the height is exactly the margin', function(assert) {
      let result = right({width: 30, height: 5, margin: 5});
      assert.equal(result.length, 0)
    })

    test('it raises an error if height, width, or margin are not present', function(assert) {
      assert.throws(
        (() => right({width: 30, height: 30})),
        /requires/
      )
    });

    test('it raises an error if height or width are less than the margin', function(assert) {
      assert.throws(
        (() => right({width: 30, height: 30, margin: 31})),
        /less than/
      )
    });
  });

  module('| bottom', function() {
    test('it returns an array of x values', function(assert) {
      let result = bottom({width: 30, height: 30, margin: 5});
      assert.equal(result.length, 5);
      assert.equal(result[0][0], 25);
    });

    test('it returns corresponding y values for each x value', function(assert) {
      let result = bottom({width: 30, height: 30, margin: 5});
      assert.equal(result[0][1].length, 20);
      assert.equal(result[0][1][0], 5);
    });

    test('it returns an empty array if the height is exactly the margin', function(assert) {
      let result = bottom({width: 30, height: 5, margin: 5});
      assert.equal(result.length, 0)
    })

    test('it raises an error if height, width, or margin are not present', function(assert) {
      assert.throws(
        (() => bottom({width: 30, height: 30})),
        /requires/
      )
    });

    test('it raises an error if height or width are less than the margin', function(assert) {
      assert.throws(
        (() => bottom({width: 30, height: 30, margin: 31})),
        /less than/
      )
    });
  });
});
