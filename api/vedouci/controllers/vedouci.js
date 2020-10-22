"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { parseMultipartData, sanitizeEntity } = require("strapi-utils");

const sgMail = require("@sendgrid/mail");
require('dotenv').config()


module.exports = {
  async create(ctx) {
    let entity;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.vedouci.create(data, { files });
    } else {
      entity = await strapi.services.vedouci.create(ctx.request.body);
    }
    try {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        console.log(ctx.request.body);
        const msg = {
            // to: "jasekdominik@seznam.cz",
            // from: "jasekdominik@seznam.cz",
            to: "jasekdominik@seznam.cz",
            from: "2.skaut.od@gmail.com",
            subject: "test more",
            text: `${ctx.request.body}`,
            html: `Nejnovější vedoucí se jmenuje <strong>${ctx.request.body.jmeno}</strong> a jeho funkce je <strong>${ctx.request.body.funkce}</strong>`,
        }
        sgMail.send(msg).then(() => {
            console.log('Message sent to ', msg.to)
            console.log(ctx.request.body);
        }).catch((error) => {
            console.log(error.response.body)
        })
    } catch (err) {
      console.log(err.message);
      return err;
    }

    return sanitizeEntity(entity, { model: strapi.models.vedouci });
  },
};
