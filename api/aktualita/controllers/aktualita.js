'use strict';

const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

const sgMail = require('@sendgrid/mail');
const { getMaxListeners } = require('strapi-utils/lib/logger');
require('dotenv').config();

module.exports = {
	getEmailForEmailID(emailID) {
		return new Promise((resolve) => {
			strapi.query('email').find({ id: String(emailID) }).then((email) => {
				// console.log('resolving email', email[0].address);
				resolve(email[0].address);
			});
		});
	},

	async getEmailsForClen(clen) {
		// console.log('getting emails for clen', clen);
		let emailsClen = [];
		for (const emailID of clen.emails) {
			const email = await this.getEmailForEmailID(emailID);
			console.log('pushing email', email);
			emailsClen.push(email);
		}
		// console.log('returning emails for clen', emailsClen);
		return emailsClen;
	},

	getEmailsForOddil(oddilID) {
		console.log('searching all members subscribing to oddil with id ', oddilID);
		return new Promise(async (resolve) => {
			let emailsOddil = [];
			const clens = await strapi.query('clen').model.find({ oddil: oddilID });
			if (clens.length) {
				for await (const clen of clens) {
					// console.log('dealing with clen', clen);
					const emailsClen = await this.getEmailsForClen(clen);
					// console.log('Emails for clen', clen.jmeno, ' are ', emailsClen);
					emailsClen.forEach((email) => {
						emailsOddil.push({ email: email, oddilID: oddilID });
					});
					// emailsOddil.push(...emailsClen);
				}
			}
			resolve(emailsOddil);
		});
	},

	removeDuplicates(emails) {
		console.log('before filter', emails);
		let filteredEmails = emails.filter((email, index, self) => index === self.findIndex((t) => t.email === email.email));
		// const filteredEmails = [...new Set(emails)];
		console.log('after filter', filteredEmails);
		return filteredEmails;
	},

	getRecepientEmails(oddils) {
		// return new Promise((resolve) => {
		return new Promise((resolve) => {
			let emailsOddils = [];
			let oddilsProcessed = 0;
			oddils.forEach((oddilID) => {
				this.getEmailsForOddil(oddilID).then((res) => {
					// console.log('pushing res', res);
					emailsOddils.push(...res);
					oddilsProcessed++;
					if (oddilsProcessed === oddils.length) {
						// emails = this.stringifyEmails(emails);
						emailsOddils = this.removeDuplicates(emailsOddils);
						// console.log('getAllEmails resolving', emails);
						resolve(emailsOddils);
					}
				});
			});
		});
		// })
	},

	getFromEmails() {
		let contacts = [];
		return new Promise((resolve) => {
			strapi.query('oddil').find().then((oddily) => {
				oddily.forEach((oddil) => {
					contacts.push({
						oddilID: oddil.id,
						sendinblue_templateID: oddil.sendinblue_templateID,
					});
				});
				resolve(contacts);
			});
		});
	},

	sendNotification(postResponse, fromContact, toMail) {
		console.log('trying to send email to', toMail.email, 'from template id', fromContact.sendinblue_templateID);
		
		// SendInBlue
		var SibApiV3Sdk = require('sib-api-v3-sdk');
		var defaultClient = SibApiV3Sdk.ApiClient.instance;

		// Configure API key authorization: api-key
		var apiKey = defaultClient.authentications['api-key'];
		apiKey.apiKey = process.env.SEND_IN_BLUE_API_KEY;

		var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

		var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email
		sendSmtpEmail.to = [{email:toMail.email}],
		sendSmtpEmail.subject = postResponse.nadpis;
		sendSmtpEmail.templateId = fromContact.sendinblue_templateID,
		sendSmtpEmail.params = {
			nadpis:postResponse.nadpis,
			text:postResponse.text,
			url: 'https://skauttrebic.cz/aktuality/post/' + postResponse.slug,
		}
		// sendSmtpEmail.textContent = outputText;

		apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
			console.log('API called successfully. Returned data: ' + data);
		}, function(error) {
			console.error(error);
		});
	},

	async create(ctx) {
		let entity;
		if (ctx.is('multipart')) {
			const { data, files } = parseMultipartData(ctx);
			entity = await strapi.services.aktualita.create(data, { files });
		} else {
			entity = await strapi.services.aktualita.create(ctx.request.body);
		}
		try {
			// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
			const p_fromEmails = this.getFromEmails();
			const p_toEmails = this.getRecepientEmails(ctx.request.body.oddils);
			Promise.all([p_fromEmails, p_toEmails]).then((values) => {
				let fromEmails = values[0];
				let toEmails = values[1];
				// console.log('_____Kontakty na vedouci jsou', fromEmails);
				// console.log('_____All emails without duplicates ready to be sent are', toEmails);

				toEmails.forEach((toItem) => {
					// let fromContact = {
					// 	name: '',
					// 	email: ""
					// }
					let fromContact = fromEmails.find((fromItem) => {
						return toItem.oddilID == fromItem.oddilID;
					});
					// console.log('fromContact for ', toItem, ' is ', fromContact);
					this.sendNotification(entity, fromContact, toItem);
				});
			});
		} catch (err) {
			console.log(err.message);
			return err;
		}

		return sanitizeEntity(entity, { model: strapi.models.aktualita });
	}
};
