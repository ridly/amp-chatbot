import { Router } from 'express';
import facets from './facets';
import request from 'request';

const token = "EAALLdY8JlO8BAIRZBQPd3YTN7YAcphz5rXVuxg1d1HcPGNg4l5m7njkcZCFC3oDWZCZAiJypY4O13ZCUSAl9vUtMYcEaDJN5JdHWYoTMNlJZAkZB1Gr1EzyaD5h1mxu4ZCB1ZAZBdhcoETyxhgIPsPYDA7WythNH92dCToyanGdNAeU2YaiuW05owr";


function sendTextMessage(sender, text) {
	let messageData = { text:text }
	
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}


export default function() {
	var api = Router();

	// mount the facets resource
	api.use('/facets', facets);

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		  if (req.query['hub.verify_token'] === "my_voice_is_my_verify_me") {
		    res.send(req.query['hub.challenge']);
		  } else {
		    res.send('Error, wrong validation token');    
		  }
	});

	api.post('/', (req, res) => {
		console.log(req.body.entry[0].messaging[0].message.text);
		let messaging_events = req.body.entry[0].messaging
		for (let i = 0; i < messaging_events.length; i++) {
			let event = req.body.entry[0].messaging[i]
			let sender = event.sender.id
			if (event.message && event.message.text) {
				let text = event.message.text
				if (text === 'Generic') {
					sendGenericMessage(sender)
					continue
				}
				sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
			}
			if (event.postback) {
				let text = JSON.stringify(event.postback)
				sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
				continue
			}
		}
		res.sendStatus(200)
	});

	return api;
}
