'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  // GET /hello
  async find(ctx) {
    console.log("triggered endpoint")
    return 'Hello World!';
  },

};
