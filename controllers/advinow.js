var db = require('../helper/database');
var logger = require('../middlewares/logger');
var config = require('../config/config');

const jwt = require('jsonwebtoken');

const rp = require('request-promise');

const fs = require('fs');

const pako = require('pako');

const path = require('path');

var select = require('xml-crypto').xpath
	, dom = require('xmldom').DOMParser
	, SignedXml = require('xml-crypto').SignedXml
	, FileKeyInfo = require('xml-crypto').FileKeyInfo

/**
 * use for samlsso login on connect portal(advinow)
 */
exports.samlSsoLogin = function (req, res) {
	logger.info('advinow.js:- samlssologin method start');
	var params = { id: req.body.id };
	logger.info("id passed:", req.body.id);
	var source = req.body.source;
	var pcpProviderUUID = '';
	if (params.id == '') {
		return res.status(400).json({ "status_code": 400, "status_message": "Provider id is missing in the request" });
	}

	var tb_name = '';
	if (source == 'doctor') {
		tb_name = 'doctor';
	} else {
		tb_name = 'connect_provider';
	}
	console.log("Using Source=" + source + " and table=" + tb_name);
	var query = db.query('SELECT uuid FROM ' + tb_name + ' WHERE id=\'' + params.id + '\'', function (err, rows, fields) {

		if (err) {
			logger.error('advinow Problem while executing the database query to select UUID -Error_Code :-', err.code, 'Error_Message :-', err.sqlMessage, '  :', __line);
			return res.status(500).json({ "status_code": 500, "status_message": "There was a problem with your request. Please check and try again." });
		} else {
			if (rows.length == 1) {
				pcpProviderUUID = rows[0].uuid;
				logger.info("Provider was found with UUID=", pcpProviderUUID);
				logger.info("Creating token with api_key=", config.advinow.advinowAPIKey, " and secret key=", config.advinow.advinowSecretKey);
				var token = jwt.sign({ 'api_key': config.advinow.advinowAPIKey }, config.advinow.advinowSecretKey);//default HS256 algo
				logger.info("token created=", token);
				var options = {
					method: 'POST',
					uri: config.advinow.advinowUrl,
					body: {
						user: pcpProviderUUID,
						target: config.advinow.advinowTarget,
						business: config.advinow.advinowBusiness,
						business_key: token
					},
					json: true // Automatically stringifies the body to JSON
				};
				logger.info("Making the API call to Advinow SSO:", JSON.stringify(options));
				rp(options)
					.then(function (ssoResponse) {
						logger.info("Successfully recieved response from advinow SSO:", JSON.stringify(ssoResponse));
						res.status(200).json({ "status_code": 200, "token": ssoResponse.token });
					})
					.catch(function (err) {
						// POST failed...
						logger.info("Failed to obtain response from Advinow SSO", err);
						res.status(500).json({ "status_code": 500, "message": err });
						//res.send(err)
					});
			} else {
				res.status(404).json({ "status_code": 404, "status_message": "doctor UUID has not been registered." });
			}
		}
	})

}
/*---------------- END-samlssologin-END-------------------------*/

exports.samlSsoPatientLogin = function (req, res) {
	logger.info('advinow.js:- samlSsoPatientLogin method start');
	// var pcpProviderUUID = req.body.uuid;

	var params = { id: req.body.id };
	logger.info("patient id passed:", req.body.id);
	if (params.id == '') {
		return res.status(400).json({ "status_code": 400, "status_message": "Patient id is missing in the request" });
	}
	var patientId = params.id;
	var token = jwt.sign({ 'api_key': config.advinow.advinowAPIKey }, config.advinow.advinowSecretKey);//default HS256 algo
	logger.info("token created=", token);
	var options = {
		method: 'POST',
		uri: config.advinow.patientSSOURL,
		body: {
			user: patientId,
			target: config.advinow.patientSSOTarget,
			business: config.advinow.patientBusiness,
			business_key: token
		},
		json: true // Automatically stringifies the body to JSON
	};
	logger.info("Making the API call to Advinow SSO:", JSON.stringify(options));
	rp(options)
		.then(function (ssoResponse) {
			logger.info("Successfully recieved response from advinow SSO:", JSON.stringify(ssoResponse));
			res.status(200).json({ "status_code": 200, "token": ssoResponse.token });
		})
		.catch(function (err) {
			// POST failed...
			logger.error("Failed to obtain response from Advinow SSO", err);
			res.status(err.statusCode).json({ "status_code": err.statusCode, "message": err.message });
			//res.send(err)
		});

}

/*-----------------SAMLSSOLOGINCALLBACK-------------------------*/


/*
*
* check uuid is valid or not.
*
* if invalid--return 400 invalid request
*
* if valid--verify signed xml--valid--return 200 with user detail --otherwise 400
*
*/


exports.samlSsoLoginCallback = function (req, res) {
	logger.info("Advinow SSO login callback called:", JSON.stringify(req.body));
	var pcpDoctorUUID = req.body.user;
	var requestorKey = req.body["requestor-key"];
	//Requestor-key is XML signed with private key inflated and base64 encoded, it should be verified with x509cert given by advinow

	if (!req.body.user || req.body.user == '') {
		return res.status(400).json({ "status_code": 400, "status_message": "User information was not supplied." });
	}

	if (!requestorKey || requestorKey == '') {
		return res.status(400).json({ "status_code": 400, "status_message": "requestorKey was not supplied." });
	}

	let buff = new Buffer(requestorKey, 'base64');
	var inflatedData = pako.inflateRaw(buff, { to: 'string' });

	var pcpProviderName = '';
	var query = db.query('SELECT name FROM connect_provider WHERE uuid=\'' + pcpDoctorUUID + '\'', function (err, rows, fields) {
		if (err) {
			logger.info('We could not find the user in our database.', err);
			return res.status(500).json({ "status_code": 500, "status_message": "We could not find the user in our database." });

		} else {
			if (rows.length == 1) {
				logger.info("User was found");
				pcpProviderName = rows[0].name;
				logger.info("Validating the requester key now.");
				var xml = inflatedData

				var doc = new dom().parseFromString(xml)

				var signature = select(doc, "/*/*[local-name(.)='Signature' and namespace-uri(.)='http://www.w3.org/2000/09/xmldsig#']")[0]

				var sig = new SignedXml()

				//sig.keyInfoProvider = new FileKeyInfo(path.join(__dirname, 'config', 'prod_pub_SAML_key.pem'))
				sig.keyInfoProvider = new FileKeyInfo(config.advinow.advinowSAMLKey)
				sig.loadSignature(signature)
				var res1 = sig.checkSignature(xml)

				if (!res1) {
					logger.info("Signature mismatch:", sig.validationErrors);
					res.status(401).json({ "status_code": 401, "status_message": "Signature mismatch." });
				} else {
					logger.info("A valid requestor key was found, hence returning successful response.");
					res.status(200).json({ "name": pcpProviderName, "licenses": '' });
				}

			} else {
				logger.info("Invalid UUID was supplied:", pcpDoctorUUID);
				res.status(400).json({ "status_code": 400, "status_message": "Invalid uuid. Please check and submit again." });
			}
		}
	})


}

/*--------------END-SAMLSSOLOGINCALLBACK-END-----------------*/
