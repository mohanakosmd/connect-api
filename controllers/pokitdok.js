var PokitDok = require('pokitdok-nodejs');
const config = require('../config/config');
const POKITDOK_CLIENT_ID = config.pokitdok.pokitdokClientId;
const POKITDOK_CLIENT_SECRET = config.pokitdok.pokitdokClientSecret;

var pokitdok = new PokitDok(POKITDOK_CLIENT_ID, POKITDOK_CLIENT_SECRET);

let copayAmount = 0;

exports.pokitdok = function(req,res){
	var patientId = req.body.patientId;
	var dateOfBirth = req.body.dateOfBirth;
	var fullName = req.body.fullName;
	var memberId = req.body.memberId;
	var tradingPartnerId = req.body.tradingPartnerId;

	if(!patientId || !dateOfBirth || !fullName || !memberId || !tradingPartnerId){
		res.status(400).json({'status_code':400,"status_message":"invalid parameter or value passed"});
		return false;
	}
	name = fullName.split(' ');
	firstName = name[0];
	lastName  =  name[1];
	pokitdok.eligibility({
	    member: {
	        birth_date: dateOfBirth,
	        first_name: firstName,
	        last_name: lastName,
	        id: memberId
	    },
	    provider: {
	        first_name: config.pokitdok.PROD_POKITDOK_PROVIDER_FIRST_NAME,
	        last_name: config.pokitdok.PROD_POKITDOK_PROVIDER_LAST_NAME,
	        npi: config.pokitdok.PROD_POKITDOK_PROVIDER_NPI
	    },
	    service_types: [config.pokitdok.pokitdokServiceTypes],
	    trading_partner_id: tradingPartnerId
	}, function (err, result) {
	    if (err) {
	    	console.log(err); 

	    	return res.status(500).json({"status_code":500,"status_message":"Something went wrong"})
	    	
	    }
	    result.data.coverage.copay.forEach(function(single){
	    	if(single.in_plan_network == 'yes'){
	    		copayAmount = single.copayment.amount;
	    	}
	    });
	    return res.status(200).json({copayAmount:copayAmount});
	});
}
