'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  // GET /hello
  async find(ctx) {
    console.log("ctx.query = ", ctx.query)

    // ---------------- TAGS -------------------------
    // let tags = ctx.query.tags.split(',');
    // tags = tags.map(x => encodeURIComponent(x))
    // console.log("encoded tags = ", tags)

    // tags = tags.toString();
    // console.log("tags string", tags);

    // ----------------     --------------------------

    // return "this is working bro";
    var SibApiV3Sdk = require('sib-api-v3-sdk');
    var defaultClient = SibApiV3Sdk.ApiClient.instance;

    // Configure API key authorization: api-key
    var apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.SEND_IN_BLUE_API_KEY;
    
    var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    //https://github.com/sendinblue/APIv3-nodejs-library/blob/master/docs/TransactionalEmailsApi.md#getTransacEmailsList
    var opts = { 
      // 'email': "email_example", do not update, it updates under this object
      'templateId': ctx.query.templateID,
      'startDate': ctx.query.startDate,
      'endDate': ctx.query.endDate,
    };

    //add email filter attribute
    if (ctx.query.email != '')  { 
      opts.email = ctx.query.email;
    }

    console.log("opts set up", opts);
    
    // let receivedResponse = false;
    let response = null;

    console.log("making request");

    response = await apiInstance.getTransacEmailsList(opts)    
      // .then(function(data) {
      //   console.log('API event called successfully. Returned data: ' + data);
      //   response = data;
      // }, function(error) {
      //   console.error(error);
      // });   

    return response;

  },
};
