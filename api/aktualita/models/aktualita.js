'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/models.html#life-cycle-callbacks)
 * to customize this model
 */

const slugify = require('slugify');

module.exports = {
  lifecycles: {
    beforeCreate: async (data) => {
      if (data.nadpis) {
        data.slug = slugify(data.nadpis);
      }
    },
    beforeUpdate: async (params, data) => {
      data.slug = slugify(data.nadpis);
    },
  },
};