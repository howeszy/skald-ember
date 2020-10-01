'use strict';

module.exports = {
  extends: 'octane',

  rules: {
    "no-invalid-interactive": 
      {
        additionalInteractiveTags: ["dialog"]
      }
  }
};
