console.log('router.js:- Start.');
var express = require('express');
var app = express.Router();
var api = require('../controllers/api');
var healthCheck = require('../controllers/healthCheck');
var pokitdok = require('../controllers/pokitdok'); //for eligibility --co pay amount
var braintree = require('../controllers/braintree'); //paypal new payment gateway
var advinow = require('../controllers/advinow'); //saml integration
var payumoney = require('../controllers/payumoney'); //payumoney integration
const expressValidator = require('express-validator');

/* Health check api */
//app.get('/healthcheck', healthCheck.status);
/*api call start*/
app.post('/api/pcp/doctorLogin', api.doctorLogin); /* doctor login api */
app.post('/api/pcp/preDoctorLogin', api.preDoctorLogin); /* doctor prelogin api */
//app.post('/api/pcp/updateDocRoomAlias', api.updateDocRoomAlias);   /* update alias room for doc */
//app.post('/api/pcp/getWaitingUserList', api.getWaitingUserList);   /* get user waiting list for doc */
//app.post('/api/pcp/getWaitingUserListFromUserId', api.getWaitingUserListFromUserId);   /* get user waiting list from user id for doc */
//app.post('/api/pcp/getUserCallDetails', api.getUserCallDetails);   /* get user call details for doc */
//app.post('/api/pcp/doctorLogout', api.doctorLogout); /* doctor logout api */
//app.post('/api/pcp/patientexists', api.patientexists); /* check user exists api */
//app.post('/api/pcp/saveUserMeeting', api.saveUserMeeting); /* save user meeting details api */
//app.post('/api/pcp/saveUserMeetingEmail', api.saveUserMeetingEmail); /* save user meeting details by email only--(070718) api */
//app.post('/api/pcp/updatehgPatientId', api.updatehgPatientId);/*update hg_patient_id*/
app.post('/api/pcp/getSavedUserId', api.getSavedUserId); /* get user id api */
//app.post('/api/pcp/getDocFromAlias', api.getDocFromAlias); /* get doc details from alias api */
app.post('/api/pcp/addUserToWaiting', api.addUserToWaiting); /* get doc details from alias api */
app.post('/api/pcp/getOpentokRoomKeys', api.getOpentokRoomKeys); //get opentok keys
//app.post('/api/pcp/invite', api.invite);//save session, token to invite table doc api
//app.post('/api/pcp/getSessionFromInviteId', api.getSessionFromInviteId);//get session, token from invite table other user api
app.post('/sessionDisconnect', api.sessionDisconnect);//disconnect from session
//** previously */ app.post('/api/pcp/smsWaitingRoomLink', api.SMSlRoomLink); // sms room link to patient from doc
//app.post('/api/pcp/SMSlRoomLink', api.SMSlRoomLink); // sms room link to patient from doc
//app.post('/api/pcp/emailRoomLink', api.emailRoomLink); // email room link to patient from doc
// app.post('/api/pcp/emailWaitingRoomLink', api.emailRoomLink); // email room link to patient from doc
//new api's
//app.get('/api/pcp/doctorAppConfig', api.doctorAppConfig); // doctor app config 
//app.get('/api/pcp/pagesConfig/:alias', api.getEmployerConfig); // doctor app config 
//app.get('/api/pcp/subscribePlan/:id', api.getPatientSubscribePlanConfig); // patient subscribe plan
//app.put('/pcp/addNotes/:callid', api.addNotes);//add Notes
//app.post('/pcp/pcp_patientRecords', api.makeCallRecord); // insert patient call record after call end -- doc api
//app.get('/pcp/pcp_patientRecords/:doctor_id', api.getDocCallLogData);//get doctor call log doc api
//app.put('/pcp/pcp_patientRecords/:call_id', api.lockCallEncounter);//lock doctor call log encounter doc api
//app.post('/pcp/verification_code', api.sendOTP);//send otp patient api
//app.get('/pcp/verification_code/:otp/:verifyValue', api.verifyOTP);//verify otp patient api
//app.get('/connect/providersettings/:room', api.getProviderSetting);// get provider
//app.get('/connect/providersettingsbyproviderid/:id', api.getProviderSettingByProviderId);// get provider
//app.get('/connect/providerGroup/:groupId', api.getProviderGroup);// get provider group
//app.get('/connect/connectProvider/:token', api.getconnectProviderFromToken);// get provider data from token
//app.post('/connect/validClientUrl', api.validClientUrl);// check if client url valid or not api
//app.post('/api/pcp/getLocationDetailByTransactionId', api.getLocationDetailByTransactionId);//check and get location_name by transaction Id
//app.get('/connect/getArchiveId/:sessionId/:uuid', api.getArchiveId);// get archive id from session
//app.post('/connect/stopDoctorArchive', api.stopDoctorArchive);// stopDoctorArchive api 
//app.post('/connect/stopDoctorCallRecording', api.stopDoctorCallRecording);// stop recording by doctor api

//app.get('/connect/sessiontokenapikey', api.sessiontokenapikey);// get random opentok sesison and token common api

//app.get('/connect/verifyThirdPartyDoc/:phoneNo/:call_id?', api.verifyThirdPartyDoc);// get verify third party doctor phone no api
//app.post('/connect/updateThirdPartyDoc', api.updateThirdPartyDoc);// update third party doctor after call end api

//app.get('/connect/doctorAvailableUnavailable', api.doctorAvailableUnavailable);// get all available available doctors api

//app.post('/connect/sendWCStaffNotification', api.sendWCStaffNotification);// sendWCStaffNotification api

//insurance
//app.get('/insurances/:name', api.getInsurancesList); //getInsurancesList
//app.post('/insurances', api.insuranceInfo); //create insurance info record


//pokitdok
//app.post('/pokitdok/eligibility', pokitdok.pokitdok);


//braintree payment gateway
//app.post('/braintree/client_token', braintree.clientToken);
//app.post('/braintree/checkout', braintree.payAmount);

//plivo
//app.post('/plivo/notify-join', api.plivoNotifyJoin);

//opentok
//app.get('/opentok/archive/:archiveId', api.getArchiveInfo);

//advinow(saml)
//app.post('/advinow/SAML/sso_login', advinow.samlSsoLogin);
//app.post('/advinow/SAML/sso_patient_login', advinow.samlSsoPatientLogin);//
//app.post('/advinow/SAML/sso_login_callback', advinow.samlSsoLoginCallback);

//app.post('/plivo/make-new-call', api.plivoMakeNewCall);

//app.post('/plivo/make-close-call', api.plivoCloseCall);

//app.get('/plivo/forward', api.plivoForwardEndpoint);

//app.get('/plivo/hang-up', api.plivoHangup);

//app.get('/plivo/fallBack', api.fallbackUrl);

//connect--get dynamic check in field here

// app.get('/patient/checkin/form/:roomAlias', api.getCheckInFormFieldByRoom);

//app.post('/plivo/add-plivo-call',api.makePlivoCall);

 app.post('/api/pcp/generateCallIdByPatientId', api.generateCallIdByPatientId); /*generate call id by patient id(07102018) */

app.post('/api/pcp/updatedataBycallId', api.updatedataBycallId); /*update data by call id(07102018) */
/*api calll end */
// app.post('/api/pcp/getLocationByRoomName', api.getLocationByRoomName);
// app.post('/api/pcp/updateDoctorIdBycallId', api.updateDoctorIdBycallId); //update patient table by call id (130718)
// app.post('/api/pcp/patientexistsemailphone', api.patientexistsemailphone); /* check user exists api */
// app.post('/api/pcp/uploadfileonbucket', api.uploadfileonbucket);  /* upload file for location (08182018)*/
// app.post('/api/pcp/uploadfileonbucketfors1medical', api.uploadfileonbucketfors1medical);  /* upload file for location (08182018)*/
// app.post('/api/pcp/updatestatusBycallId', api.updatestatusBycallId); /*update status by call id(08022018) */
 app.post('/api/pcp/checkConnectCallBycallId', api.checkConnectCallBycallId); /*update checkConnectCallBycallId by call id(08142018) */
 app.post('/api/pcp/checkstatusinwatingroom', api.checkstatusinwatingroom); /*update status (08302018) */
 app.post('/api/pcp/updatedoctorid', api.updatedoctorid); /*update doctor_id (09142018) */
// app.post('/api/pcp/getUserEmails', api.getUserEmails); /*(09182018) */
// app.post('/api/pcp/forgotsendOTP', api.forgotsendOTP); /*(09182018) */
// app.post('/api/pcp/setPassword', api.setPassword); /*(09182018) */
// app.post('/api/pcp/updatetransactionid', api.updatetransactionid); /*update transaction_id (09142018) */
 app.post('/api/pcp/updatetcalldisconnectreason', api.updatetcalldisconnectreason); /*update calldisconnectreason (09142018) */
 app.post('/api/pcp/updatestatusByPatientId', api.updatestatusByPatientId); /*update updatestatusByPatientId (10122018) */
 app.post('/api/pcp/getPatientImageUrl', api.getPatientImageUrl); /* get Patient ImageUrl api */
 app.post('/api/pcp/callendbypatient', api.callendbypatient); /*call end  by patient (10052018) */
 app.post('/api/pcp/appCallReconnect', api.appCallReconnect); /*call reconnect by patient in app(12052018) */
// app.post('/api/pcp/updatereferralsfors1medical', api.updatereferralsfors1medical);  /* update file for wc_referrals (08182018)*/
// app.get('/api/pcp/getdoctorDetailsbyid/:id', api.getdoctordetailbyid);  /* get doctor details by doctor id*/
// app.get('/api/pcp/getPatientDetailById/:id', api.getPatientDetailById);  /* get doctor details by doctor id*/
// app.get('/api/pcp/getPatientCallLog/:id', api.getPatientCallLog);  /* get patient details by patient id*/

// app.post('/api/pcp/thirdpartycalldisconnect', api.thirdpartycalldisconnect); /*update call disconnect time for thirdparty (09112019) */
// app.post('/api/pcp/sendCustomLink', api.sendCustomLink); /*update call disconnect time for thirdparty (09112019) */
// app.post('/connect/getPatientDetails', api.getPatientDetails); // for verify akoslive patient and get all details 
// app.get('/interpreter/languages', api.getInterpreterLanguage);
// app.post('/api/pcp/getEndCallOptionsByRoom', api.getEndCallOptionsByRoom);
// app.get('/api/pcp/logoCssSettings/:room',api.getLogoCssSettings);// get provider
//PayUmoney Integration
// app.post('/api/payumoney/saveResponse',  payumoney.saveResponse);
// app.post('/api/payumoney/requestPayment', payumoney.validate('requestPayment'), payumoney.requestPayment);
module.exports = app;
console.log('router.js:- End.');
