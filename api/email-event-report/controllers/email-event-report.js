'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  // GET /hello
  async find(ctx) {
    console.log("ctx.query = ", ctx.query)
    // return "this is working bro";
    var SibApiV3Sdk = require('sib-api-v3-sdk');
    var defaultClient = SibApiV3Sdk.ApiClient.instance;

    // Configure API key authorization: api-key
    var apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.SEND_IN_BLUE_API_KEY;
    
    var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    var opts = { 
      // 'limit': ctx.query.limit, // Number | Number limitation for the result returned
      // 'offset': 0, // Number | Beginning point in the list to retrieve from.
      // 'startDate': "2020-08-15", // String | Mandatory if endDate is used. Starting date of the report (YYYY-MM-DD). Must be lower than equal to endDate
      // 'endDate': "2020-10-29", // String | Mandatory if startDate is used. Ending date of the report (YYYY-MM-DD). Must be greater than equal to startDate
      'days': 30, // Number | Number of days in the past including today (positive integer). Not compatible with 'startDate' and 'endDate'
       'email': "jasekdominik34@gmail.com", // String | Filter the report for a specific email addresses
      // 'event': "event_example", // String | Filter the report for a specific event type
      // 'tags': "tags_example", // String | Filter the report for tags (serialized and urlencoded array)
      // 'messageId': "messageId_example", // String | Filter on a specific message id
      // 'templateId': 789 // Number | Filter on a specific template id
    };
    
    // let receivedResponse = false;
    let response = null;

    await apiInstance.getEmailEventReport(opts)    
      .then(function(data) {
        console.log('API called successfully. Returned data: ' + data);
        response = data;
      }, function(error) {
        console.error(error);
      });   

    return response;

  },
};
