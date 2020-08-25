import {
  bottomRight,
  right,
  bottom,
  topRight,
  bottomLeft,
  body,
  top,
  left,
  topLeft
} from 'skald/utils/xymargin';
import { module, test } from 'qunit';

module('Unit | Utility | xymargin', function() {
  module('#bottomRight', function() {
    test('it returns the min/max of x/y', function(assert) {
      let result = bottomRight({width: 30, height: 30, margin: 5});
      assert.equal(result[0][0], 25);
      assert.equal(result[0][1], 25);
      assert.equal(result[1][0], 29);
      assert.equal(result[1][1], 29);
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

  module('#right', function() {
    module('when height is less than or equal to margin', function() {
      test('it returns null', function(assert) {
        let result = right({width: 30, height: 5, margin: 5});
        assert.equal(result, null);
      })
    })

    module('when height is less than two margins', function() {
      test('it returns the min/max of x/y with regards to bottomRight and without regards to topRight', function(assert) {
        let result = right({width: 30, height: 9, margin: 5});
        assert.equal(result[0][0], 25);
        assert.equal(result[0][1], 0);
        assert.equal(result[1][0], 29);
        assert.equal(result[1][1], 3);
      })
    })

    test('it returns the min/max of x/y with regards to bottomRight and topRight', function(assert) {
      let result = right({width: 30, height: 30, margin: 5});
      assert.equal(result[0][0], 25);
      assert.equal(result[0][1], 5);
      assert.equal(result[1][0], 29);
      assert.equal(result[1][1], 24);
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

  module('#bottom', function() {
    module('when width is less than or equal to margin', function() {
      test('it returns null', function(assert) {
        let result = bottom({width: 5, height: 30, margin: 5});
        assert.equal(result, null);
      })
    })

    module('when width is less than two margins', function() {
      test('it returns the min/max of x/y with regards to bottomRight and without regards to bottomLeft', function(assert) {
        let result = bottom({width: 9, height: 30, margin: 5});
        assert.equal(result[0][0], 0);
        assert.equal(result[0][1], 25);
        assert.equal(result[1][0], 3);
        assert.equal(result[1][1], 29);
      })
    })

    test('it returns the min/max of x/y with regards to bottomRight and topRight', function(assert) {
      let result = bottom({width: 30, height: 30, margin: 5});
      assert.equal(result[0][0], 5);
      assert.equal(result[0][1], 25);
      assert.equal(result[1][0], 24);
      assert.equal(result[1][1], 29);
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

  module('#topRight', function() {
    module('when height is less double the margin', function() {
      test('it returns null', function(assert) {
        let result = topRight({width: 30, height: 10, margin: 5});
        assert.equal(result, null);
      })
    })

    test('it returns the min/max of x/y', function(assert) {
      let result = topRight({width: 30, height: 30, margin: 5});
      assert.equal(result[0][0], 25);
      assert.equal(result[0][1], 0);
      assert.equal(result[1][0], 29);
      assert.equal(result[1][1], 4);
    })

    test('it raises an error if height, width, or margin are not present', function(assert) {
      assert.throws(
        (() => topRight({width: 30, height: 30})),
        /requires/
      )
    });

    test('it raises an error if height or width are less than the margin', function(assert) {
      assert.throws(
        (() => topRight({width: 30, height: 30, margin: 31})),
        /less than/
      )
    });
  });

  module('#bottomLeft', function() {
    module('when width is less double the margin', function() {
      test('it returns null', function(assert) {
        let result = bottomLeft({width: 10, height: 30, margin: 5});
        assert.equal(result, null);
      })
    })

    test('it returns the min/max of x/y', function(assert) {
      let result = bottomLeft({width: 30, height: 30, margin: 5});
      assert.equal(result[0][0], 0);
      assert.equal(result[0][1], 25);
      assert.equal(result[1][0], 4);
      assert.equal(result[1][1], 29);
    })

    test('it raises an error if height, width, or margin are not present', function(assert) {
      assert.throws(
        (() => bottomLeft({width: 30, height: 30})),
        /requires/
      )
    });

    test('it raises an error if height or width are less than the margin', function(assert) {
      assert.throws(
        (() => bottomLeft({width: 30, height: 30, margin: 31})),
        /less than/
      )
    });
  });

  module('#body', function() {
    module('when height or width is less than or equal to the margin', function() {
      test('it returns null', function(assert) {
        let result = body({width: 5, height: 30, margin: 5});
        assert.equal(result, null);
      })
    })

    module('when height or width is less than or equal to the double margin', function() {
      test('it returns the min/max of x/y without regards to top, left, and topLeft', function(assert) {
        let result = body({width: 10, height: 30, margin: 5});
        assert.equal(result[0][0], 0);
        assert.equal(result[0][1], 0);
        assert.equal(result[1][0], 4);
        assert.equal(result[1][1], 24);
      })
    })

    test('it returns the min/max of x/y with regards to top, left, and topLeft', function(assert) {
      let result = body({width: 30, height: 30, margin: 5});
      assert.equal(result[0][0], 5);
      assert.equal(result[0][1], 5);
      assert.equal(result[1][0], 24);
      assert.equal(result[1][1], 24);
    })

    test('it raises an error if height, width, or margin are not present', function(assert) {
      assert.throws(
        (() => body({width: 30, height: 30})),
        /requires/
      )
    });

    test('it raises an error if height or width are less than the margin', function(assert) {
      assert.throws(
        (() => body({width: 30, height: 30, margin: 31})),
        /less than/
      )
    });
  });

  module('#top', function() {
    module('when height or width is less than or equal to double the margin', function() {
      test('it returns null', function(assert) {
        let result = top({width: 10, height: 30, margin: 5});
        assert.equal(result, null);
      })
    })

    test('it returns the min/max of x/y', function(assert) {
      let result = top({width: 30, height: 30, margin: 5});
      assert.equal(result[0][0], 5);
      assert.equal(result[0][1], 0);
      assert.equal(result[1][0], 24);
      assert.equal(result[1][1], 4);
    })

    test('it raises an error if height, width, or margin are not present', function(assert) {
      assert.throws(
        (() => top({width: 30, height: 30})),
        /requires/
      )
    });

    test('it raises an error if height or width are less than the margin', function(assert) {
      assert.throws(
        (() => top({width: 30, height: 30, margin: 31})),
        /less than/
      )
    });
  });

  module('#left', function() {
    module('when height or width is less than or equal to double the margin', function() {
      test('it returns null', function(assert) {
        let result = left({width: 10, height: 30, margin: 5});
        assert.equal(result, null);
      })
    })

    test('it returns the min/max of x/y', function(assert) {
      let result = left({width: 30, height: 30, margin: 5});
      assert.equal(result[0][0], 0);
      assert.equal(result[0][1], 5);
      assert.equal(result[1][0], 4);
      assert.equal(result[1][1], 24);
    })
  
    test('it raises an error if height, width, or margin are not present', function(assert) {
      assert.throws(
        (() => left({width: 30, height: 30})),
        /requires/
      )
    });

    test('it raises an error if height or width are less than the margin', function(assert) {
      assert.throws(
        (() => left({width: 30, height: 30, margin: 31})),
        /less than/
      )
    });
  });

  module('#topLeft', function() {
    module('when height or width is less than or equal to double the margin', function() {
      test('it returns null', function(assert) {
        let result = topLeft({width: 10, height: 30, margin: 5});
        assert.equal(result, null);
      })
    })

    test('it returns the min/max of x/y', function(assert) {
      let result = topLeft({width: 30, height: 30, margin: 5});
      assert.equal(result[0][0], 0);
      assert.equal(result[0][1], 0);
      assert.equal(result[1][0], 4);
      assert.equal(result[1][1], 4);
    })

    test('it raises an error if height, width, or margin are not present', function(assert) {
      assert.throws(
        (() => topLeft({width: 30, height: 30})),
        /requires/
      )
    });

    test('it raises an error if height or width are less than the margin', function(assert) {
      assert.throws(
        (() => topLeft({width: 30, height: 30, margin: 31})),
        /less than/
      )
    });
  });
});
