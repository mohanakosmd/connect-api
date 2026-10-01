//console.log('config.js:- Start.');
//include env file and its configuration
require('dotenv').config();
const path = require('path');
const env = process.env.NODE_ENV; // 'dev' or 'test'
console.log('Environment:- ' + env);
//Start-Production Environment Config--put default value for all--later
const prod = {
  app: {
    port: parseInt(process.env.PROD_APP_PORT),
    serverUrl: process.env.PROD_APP_SERVER_URL,
    smsFrom: process.env.PROD_APP_SMS_FROM,
    mailSender: process.env.PROD_MAIL_SENDER
  },
  db: {
    host: process.env.PROD_DB_HOST,
    port: parseInt(process.env.PROD_DB_PORT),
    name: process.env.PROD_DB_NAME,
    user: process.env.PROD_DB_USER_NAME,
    password: process.env.PROD_DB_PASSWORD
  },
  plivo: {
    sipUri: process.env.PROD_PLIVO_SIP_URI,
    sipUsername: process.env.PROD_PLIVO_SIP_USERNAME,
    sipPassword: process.env.PROD_PLIVO_SIP_PASSWORD,
    authId: process.env.PROD_PLIVO_AUTH_ID,
    authToken: process.env.PROD_PLIVO_SIP_AUTH_TOKEN,
    sendCallFrom: process.env.PROD_PLIVO_SEND_CALL_FROM,
    sendCallTo: process.env.PROD_PLIVO_SEND_CALL_TO,
    notifyalias: process.env.PROD_NOTIFY_BY_CALL_ALIAS
  },
  nexmo: {
    sipUsername: process.env.PROD_NEXMO_USERNAME,
    sipPassword: process.env.PROD_NEXMO_PASSWORD,
  },
  opentok: {
    opentokApiKey: process.env.PROD_OPENTOK_API_KEY,
    opentokApiSecret: process.env.PROD_OPENTOK_API_SECRET,
  },
  advinow: {
    advinowAPIKey: process.env.PROD_ADVINOW_API_KEY,
    advinowSecretKey: process.env.PROD_ADVINOW_SECRET_KEY,
    advinowPublicKey: process.env.PROD_ADVINOW_PUBLIC_KEY,
    advinowUrl: process.env.PROD_ADVINOW_URL,
    advinowTarget: process.env.PROD_ADVINOW_TARGET,
    patientSSOURL: process.env.PROD_ADVINOW_PATIENTSSO_URL,
    patientSSOTarget: process.env.PROD_ADVINOW_PATIENT_TARGET,
    patientBusiness: process.env.PROD_ADVINOW_PATIENT_BUSINESS,
    advinowBusiness: process.env.PROD_ADVINOW_BUSINESS,
    advinowSAMLKey: path.join(__dirname, 'advinow', 'prod_pub_SAML_key.pem'),
    patientSSOURL: process.env.PROD_ADVINOW_PATIENTSSO_URL,
    patientSSOTarget: process.env.PROD_ADVINOW_PATIENT_TARGET
  },
  braintree: {
    braintreeEnvironment: process.env.PROD_BRAINTREE_ENVIRONMENT,
    braintreeMerchantId: process.env.PROD_BRAINTREE_MERCHANT_ID,
    braintreePublicKey: process.env.PROD_ADVINOW_PUBLIC_KEY,
    braintreePrivateKey: process.env.PROD_PRIVATE_KEY
  },
  pokitdok: {
    pokitdokClientId: process.env.PROD_POKITDOK_CLIENT_ID,
    pokitdokClientSecret: process.env.PROD_POKITDOK_CLIENT_SECRET,
    pokitdokProviderFirstName: process.env.PROD_POKITDOK_PROVIDER_FIRST_NAME,
    pokitdokProviderLastName: process.env.PROD_POKITDOK_PROVIDER_LAST_NAME,
    pokitdokProviderNpi: process.env.PROD_POKITDOK_PROVIDER_NPI,
    pokitdokServiceTypes: process.env.PROD_POKITDOK_SERVICE_TYPES
  },
  sendgrid: {
    sendgridApiKey: process.env.PROD_SENDGRID_API_KEY
  },
  twilio: {
    accountId: process.env.PROD_TWILIO_ACCOUNTID,
    authToken: process.env.PROD_TWILIO_AUTHTOKEN,
    restrictotptime: process.env.PROD_RESTRICTOTPTIME,
    phonePref:process.env.PROD_TWILIO_PREF
  },
  jwt: {
    jwtApiSecret: process.env.PROD_JWT_AUTHKEY
  },
  restapi: {
    baseurl: process.env.PROD_RESTAPIBASEURL,
    user: process.env.PROD_RESTAPI_BASIC_AUTH_USER,
    password: process.env.PROD_RESTAPI_BASIC_AUTH_PASS
  },
  newapi: {
    baseurl: process.env.PROD_NEWAPIBASEURL
  },
  payumoney: {
    baseurl: process.env.PROD_PAYUMONEY,
    clientKey: process.env.PROD_PAYUMONEY_KEY,
    clientSalt: process.env.PROD_PAYUMONEY_SALT,
    auth:process.env.PROD_PAYUMONEY_AUTH,
    amount: process.env.PROD_PAYUMONEY_AMOUNT,
    merchant: process.env.PROD_PAYUMONEY_MERCHANT
  },
  waiting_list_duration: process.env.PROD_WAITING_LIST_DURATION,
  account_disabled_msg: process.env.PROD_ACCOUNT_DISABLED,
  socket_io_url: process.env.PROD_SOCKET_IO_URL
};
//End-Production Environment Config

//Start-Development Environment Config
const dev = {
  app: {
    port: parseInt(process.env.DEV_APP_PORT),
    serverUrl: process.env.DEV_APP_SERVER_URL,
    smsFrom: process.env.DEV_APP_SMS_FROM,
    mailSender: process.env.DEV_MAIL_SENDER
  },
  db: {
    host: process.env.DEV_DB_HOST,
    port: parseInt(process.env.DEV_DB_PORT),
    name: process.env.DEV_DB_NAME,
    user: process.env.DEV_DB_USER_NAME,
    password: process.env.DEV_DB_PASSWORD
  },
  plivo: {
    sipUri: process.env.DEV_PLIVO_SIP_URI,
    sipUsername: process.env.DEV_PLIVO_SIP_USERNAME,
    sipPassword: process.env.DEV_PLIVO_SIP_PASSWORD,
    authId: process.env.DEV_PLIVO_AUTH_ID,
    authToken: process.env.DEV_PLIVO_SIP_AUTH_TOKEN,
    sendCallFrom: process.env.DEV_PLIVO_SEND_CALL_FROM,
    sendCallTo: process.env.DEV_PLIVO_SEND_CALL_TO,
    notifyalias: process.env.DEV_NOTIFY_BY_CALL_ALIAS
  },
  nexmo: {
    sipUsername: process.env.DEV_NEXMO_USERNAME,
    sipPassword: process.env.DEV_NEXMO_PASSWORD,
  },
  opentok: {
    opentokApiKey: process.env.DEV_OPENTOK_API_KEY,
    opentokApiSecret: process.env.DEV_OPENTOK_API_SECRET,
  },
  advinow: {
    advinowAPIKey: process.env.DEV_ADVINOW_API_KEY,
    advinowPublicKey: process.env.DEV_ADVINOW_PUBLIC_KEY,
    advinowSecretKey: process.env.DEV_ADVINOW_SECRET_KEY,
    advinowUrl: process.env.DEV_ADVINOW_URL,
    advinowTarget: process.env.DEV_ADVINOW_TARGET,
    patientSSOURL: process.env.DEV_ADVINOW_PATIENTSSO_URL,
    patientSSOTarget: process.env.DEV_ADVINOW_PATIENT_TARGET,
    patientBusiness: process.env.DEV_ADVINOW_PATIENT_BUSINESS,
    advinowBusiness: process.env.DEV_ADVINOW_BUSINESS,
    advinowSAMLKey: path.join(__dirname, 'advinow', 'pilot_pub_SAML_key.pem'),
    patientSSOURL: process.env.DEV_ADVINOW_PATIENTSSO_URL,
    patientSSOTarget: process.env.DEV_ADVINOW_PATIENT_TARGET
  },
  braintree: {
    braintreeEnvironment: process.env.DEV_BRAINTREE_ENVIRONMENT,
    braintreeMerchantId: process.env.DEV_BRAINTREE_MERCHANT_ID,
    braintreePublicKey: process.env.DEV_ADVINOW_PUBLIC_KEY,
    braintreePrivateKey: process.env.DEV_PRIVATE_KEY
  },
  pokitdok: {
    pokitdokClientId: process.env.DEV_POKITDOK_CLIENT_ID,
    pokitdokClientSecret: process.env.DEV_POKITDOK_CLIENT_SECRET,
    pokitdokProviderFirstName: process.env.DEV_POKITDOK_PROVIDER_FIRST_NAME,
    pokitdokProviderLastName: process.env.DEV_POKITDOK_PROVIDER_LAST_NAME,
    pokitdokProviderNpi: process.env.DEV_POKITDOK_PROVIDER_NPI,
    pokitdokServiceTypes: process.env.DEV_POKITDOK_SERVICE_TYPES
  },
  sendgrid: {
    sendgridApiKey: process.env.DEV_SENDGRID_API_KEY
  },
  twilio: {
    accountId: process.env.DEV_TWILIO_ACCOUNTID,
    authToken: process.env.DEV_TWILIO_AUTHTOKEN,
    restrictotptime: process.env.DEV_RESTRICTOTPTIME,
    phonePref:process.env.DEV_TWILIO_PREF
  },
  jwt: {
    jwtApiSecret: process.env.DEV_JWT_AUTHKEY
  },
  restapi: {
    baseurl: process.env.DEV_RESTAPIBASEURL,
    user: process.env.DEV_RESTAPI_BASIC_AUTH_USER,
    password: process.env.DEV_RESTAPI_BASIC_AUTH_PASS
  },
  newapi: {
    baseurl: process.env.DEV_NEWAPIBASEURL
  },
  payumoney: {
    baseUrl: process.env.DEV_PAYUMONEY,
    clientKey: process.env.DEV_PAYUMONEY_KEY,
    clientSalt: process.env.DEV_PAYUMONEY_SALT,
    auth: process.env.DEV_PAYUMONEY_AUTH,  
    amount: process.env.DEV_PAYUMONEY_AMOUNT,
    merchant: process.env.DEV_PAYUMONEY_MERCHANT
  },
  waiting_list_duration: process.env.DEV_WAITING_LIST_DURATION,

  account_disabled_msg: process.env.DEV_ACCOUNT_DISABLED,
  socket_io_url: process.env.DEV_SOCKET_IO_URL
};
//End-Development Environment Config
const config = {
  dev,
  prod
};
module.exports = config[env];
console.log('config.js:- End.');
