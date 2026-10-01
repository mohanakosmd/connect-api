var db = require('../helper/database');
var logger = require('../middlewares/logger');
var config = require('../config/config');
var uuidv4 = require('uuid/v4');
var moment = require('moment-timezone');
const { body, validationResult } = require('express-validator');
// const jwt = require('jsonwebtoken');
// const rp = require('request-promise');

var jsSHA = require("jssha");


/**
 * Request Validation
 */
exports.validate = (method) => {
    logger.info('PayUmoney validate Request ' + method);
    switch (method) {
        case 'requestPayment' : {
            return [
                body('amount', 'Amount is required field').exists(),
                body('firstname', 'Firstname is required field').exists(),
                body('productinfo', 'Productinfo is required field').exists(),
                body('email', 'Customer Email is required field').exists(),
                body('phone', 'Customer phone is required field').exists(),
                body('surl', 'Success Url (surl) is required field').exists(),
                body('furl', 'Failure Url (furl) is required field').exists(),
            ]
        }
    }
  
}

exports.requestPayment = (req,res) => {

    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }

    logger.info('PayUmoney request Payment method start');
    var txnid = uuidv4();
    var hashString = config.payumoney.clientKey +'|'+ txnid +'|'+req.body.amount+'|'+req.body.productinfo+'|'+req.body.firstname+'|'+req.body.email+'|||||||||||'+config.payumoney.clientSalt;

    var sha = new jsSHA('SHA-512', "TEXT");
         sha.update(hashString)
         var hash = sha.getHash("HEX");
    
    var response = {
        txnid,
        hash,
        key:config.payumoney.clientKey,
        service_provider: "payu_paisa"
    }
    return res.status(200).json({ "status_code": 200, "status_message": "Payment hash Generated", "result": response });
}


exports.saveResponse = (req, res) => {
    
    var data = {
        patient_id: req.body.patientId,
        call_id: (typeof req.body.callId  == "undefined") ? 0: req.body.callId,
        transaction_id: req.body.txnId,
        invoice_id: req.body.invoiceId,
        card_type: req.body.cardType,
        card_no: req.body.cardNo,
        card_holder_name: req.body.cardHolderName,
        amount: req.body.amount,
        payment_status: req.body.paymentStatus,
        failed_reason: (typeof req.body.failedReason == "undefined") ? "": req.body.failedReason,
        merchant: config.payumoney.merchant,
        ip_address: getClientIp(req),
        call_duration: (typeof req.body.callDuration == "undefined") ? 0: req.body.callDuration,
        payment_mode: req.body.paymentMode,
        created_at: moment().utc().format("YYYY-MM-DD HH:mm:ss")
    }

    var sql = db.query('INSERT INTO payment SET ?', data, 
        function (err, results) {
            if (err) {
                logger.error(
                    'api save Payumoney payment -Error_Code :-',
                    err.code,
                    'Error_Message :-',
                    err.sqlMessage,
                    '  :',
                    __line
                );
                return res.status(500).json({
                    status_code: 500,
                    status_message: 'internal server error',
                });
            } 
            return res.status(200).json({ "status_code": 200, "status_message": "PayUMoney response saved", "result": results });
      });
    
}


const getClientIp = (req) => {
    return req.headers["X-Forwarded-For"] || req.connection.remoteAddress;
}

