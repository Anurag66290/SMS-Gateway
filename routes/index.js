import express from 'express'
var router = express.Router();


/* Import Controllers. */
import {
    send_sms,
    smsStatistics,
    systemStatus,
    simulateSmsProviderThroughput,
    simulateSmsProviderFailure,
    storeAndForwardSms
} from '../controller/usercontroller.js'

/* POST send_sms */
router.route("/sendsms").post(send_sms)

/* GET SMS Statistics */
router.route("/smsStatistics/:provider").get(smsStatistics)

/* GET System Status */
router.route("/systemStatus").get(systemStatus)

/* POST Simulate SMS Provider Throughput*/
router.route("/simulateSmsProviderThroughput").post(simulateSmsProviderThroughput)

/* POST Simulate SMS Provider Failure*/
router.route("/simulateSmsProviderFailure").post(simulateSmsProviderFailure)

/* POST Store And Forward SMS */
router.route("/storeAndForwardSms").post(storeAndForwardSms)

export default router
