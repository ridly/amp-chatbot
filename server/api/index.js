import { Router } from 'express';
import facets from './facets';

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

	return api;
}
