var braintree = require("braintree");
var logger = require("../middlewares/logger");
const config = require('../config/config');
var db = require('../helper/database');
var moment = require('moment-timezone');
var uuidv4 = require('uuid/v4');
const brainTreeEnv = config.braintree.braintreeEnvironment == 'prod' ? 'Production' : 'Sandbox'

var gateway = new braintree.BraintreeGateway({
    //environment: braintree.Environment[brainTreeEnv],
    environment:  config.braintree.braintreeEnvironment,
    merchantId: config.braintree.braintreeMerchantId,
    publicKey: config.braintree.braintreePublicKey,
    privateKey: config.braintree.braintreePrivateKey
});

exports.clientToken = function (req, res) {
    var clientToken = '';
    gateway.clientToken.generate({}, function (err, response) {
        if (err) {
            logger.error('braintree.js clientToken -Error_Code :-',err,'  :',__line);
            return res.status(500).json({ "status_code": 500, "status_message": "Something went wrong" });
        }
        clientToken = response.clientToken;
        logger.info('braintree client token - ' ,clientToken);
        console.log('braintree client token - ' ,clientToken);
        return res.status(200).json({ "status_code": 200, "status_message": "braintree_client_token", "result": clientToken });
    });
}

exports.payAmount = (req, res) => {
    console.log(req.body);
    var transactionErrors;
    var amount = req.body.amount; // In production you should not take amounts directly from clients
    var nonce = req.body.payment_method_nonce;
    var patient_id = req.body.patient_id;
    var call_id = req.body.call_id;
    var payment_mode = req.body.payment_mode;
    var transaction_id = uuidv4();
    if (!amount || !nonce) {
        res.status(400).json({ 'status_code': 400, "status_message": "invalid parameter or value passed" });
        return false;
    }

    gateway.transaction.sale({
        amount: amount,
        paymentMethodNonce: nonce,
        options: {
            submitForSettlement: true
        }
    }, function (err, result) {
        if (result.success || result.transaction) {
            console.log('-----------after payment----------');
            console.log(result);
            var paymentData = { amount: amount, card_type: 'credit_card', card_no: '', payment_status: 'Approved', merchant: 'AKOSMD', payment_mode:payment_mode, patient_id: patient_id, call_id: call_id,created_at:moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),transaction_id: uuidv4() };
            var sql = db.query('INSERT INTO payment SET ? ', paymentData, function (err, rows, fields) {
                if (err) {
                    logger.error('braintree.js after payment -Error_Code :-',err.code,'Error_Message :-',err.sqlMessage,'  :',__line);
                    res.status(500).json({ 'status_code': 500, "status_message": "internal server error", "err": err });
                } else {
                    return res.status(200).json({ "status_code": 200, "status_message": "Payment success", "result": result.transaction.id });
                }
            })
            //return res.status(200).json({"status_code":200,"status_message":"Payment success","result":result.transaction.id});

        } else {

            transactionErrors = result.errors.deepErrors();
            var paymentData = { amount: amount, card_type: 'credit_card', card_no: '', payment_status: 'Failed', merchant: 'AKOSMD', payment_mode: payment_mode, failed_reason: transactionErrors,transaction_id: uuidv4()};
            var sql = db.query('INSERT INTO payment SET ? ', paymentData, function (err, rows, fields) {
                if (err) {
                    logger.error('braintree.js after payment -Error_Code :-',err.code,'Error_Message :-',err.sqlMessage,'  :',__line);
                    res.status(500).json({ 'status_code': 500, "status_message": "internal server error", "err": err });
                } else {
                    return res.status(200).json({ "status_code": 200, "status_message": "Payment error", "result": transactionErrors });
                    //return res.status(200).json({"status_code":200,"status_message":"Payment success","result":result.transaction.id});
                }
            })

        }
    });
}
