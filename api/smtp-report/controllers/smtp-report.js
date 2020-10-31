'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  // GET /hello
  async find(ctx) {
    console.log("getting SMTP report for last days = ", ctx.query.days)
    // return "this is working bro";
    var SibApiV3Sdk = require('sib-api-v3-sdk');
    var defaultClient = SibApiV3Sdk.ApiClient.instance;

    // Configure API key authorization: api-key
    var apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.SEND_IN_BLUE_API_KEY;
    
    var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    var opts = { 
      'limit': 30, // Number | Number of documents returned per page  //MAX number is 30!!!
      'offset': 0, // Number | Index of the first document on the page
      // 'startDate': "startDate_example", // String | Mandatory if endDate is used. Starting date of the report (YYYY-MM-DD)
      // 'endDate': "endDate_example", // String | Mandatory if startDate is used. Ending date of the report (YYYY-MM-DD)
      'days': ctx.query.days, // Number | Number of days in the past including today (positive integer). Not compatible with 'startDate' and 'endDate'
      // 'tag': "tag_example" // String | Tag of the emails
    };
    
    // let receivedResponse = false;
    let response = null;

    response = await apiInstance.getSmtpReport(opts)
      // .then(function(data) {
      //   console.log('API called successfully. Returned data: ' + data);
      //   response = data;
      // }, function(error) {
      //   console.error(error);
      // });   

    return response;

  },
};
