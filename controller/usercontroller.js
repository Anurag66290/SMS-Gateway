import Sms from '../model/Sms.js';

/*
|----------------------------------------------------------------------------------------------------------------
|   Send_sms 
|----------------------------------------------------------------------------------------------------------------
*/
export const send_sms = async (req, res) => {
    const sms = new Sms({phoneNumber: req.body.phoneNumber, text: req.body.text, provider: req.body.provider});

    try {
        const savedSms = await sms.save();
        res.json(savedSms);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    }
}

/*
|----------------------------------------------------------------------------------------------------------------
|   SmsStatistics 
|----------------------------------------------------------------------------------------------------------------
*/
export const smsStatistics = async (req, res) => {
    try {

        const provider = req.params.provider;
        const smsCount = await Sms.countDocuments({provider});
        const throughput = smsCount / ((Date.now() - 604800000) / 1000 / 60); // calculate throughput for the last week

        res.json({provider, smsCount, throughput});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Internal server error'});
    }
}

/*
|----------------------------------------------------------------------------------------------------------------
|   SystemStatus 
|----------------------------------------------------------------------------------------------------------------
*/
export const systemStatus = async (req, res) => {
    try {
        const airtelCount = await Sms.countDocuments({provider: 'Airtel'});
        const jioCount = await Sms.countDocuments({provider: 'JIO'});
        const viCount = await Sms.countDocuments({provider: 'VI'});

        const smsCount = airtelCount + jioCount + viCount;
        const throughput = smsCount / ((Date.now() - 604800000) / 1000 / 60); // calculate system throughput for the last week

        res.json({
            systemStatus: {
                Airtel: airtelCount,
                JIO: jioCount,
                VI: viCount,
                throughput
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Internal server error'});
    }
}

/*
|----------------------------------------------------------------------------------------------------------------
|  SsimulateSmsProviderThroughput 
|----------------------------------------------------------------------------------------------------------------
*/
export const simulateSmsProviderThroughput = async (req, res) => {
    try {
        const {provider, throughput} = req.body;
        const smsCount = Math.round(throughput / 60); // calculate the number of SMS messages to send per second
        const interval = 1000 / smsCount;
        // calculate the interval between each SMS message

        // Simulate sending SMS messages
        setInterval(() => {
            const phoneNumber = `+91${
                Math.floor(Math.random() * 10000000000)
            }`; // generate a random Indian phone number
            const text = `This is a test message from ${provider}.`;
            const sentAt = new Date();

            const sms = new Sms({phoneNumber, text, provider, sentAt});
            sms.save();
        }, interval);

        res.json({message: `Successfully started simulating ${provider} provider with ${throughput} SMS per minute.`});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Internal server error'});
    }
};

/*
|----------------------------------------------------------------------------------------------------------------
|   SimulateSmsProviderFailure 
|----------------------------------------------------------------------------------------------------------------
*/
export const simulateSmsProviderFailure = async (req, res) => {
    try { // The current load balancing percentages for each provider
        const loadBalancing = {
            Airtel: 33.33,
            JIO: 33.33,
            VI: 33.33
        };
        const {provider} = req.body;

        // Validate provider input
        if (!['Airtel', 'JIO', 'VI'].includes(provider)) {
            return res.status(400).json({error: 'Invalid provider'});
        }

        // Fail the specified provider
        loadBalancing[provider] = 0;

        // Calculate the new load balancing percentages
        const remainingProviders = Object.keys(loadBalancing).filter(p => p !== provider);
        const remainingLoad = remainingProviders.reduce((acc, curr) => acc + loadBalancing[curr], 0);
        const remainingProvidersCount = remainingProviders.length;
        const newLoadBalancing = {};
        remainingProviders.forEach(p => {
            newLoadBalancing[p] = remainingLoad / remainingProvidersCount;
        });

        // Update the load balancing percentages
        Object.assign(loadBalancing, newLoadBalancing);

        res.json({message: `Successfully failed ${provider} provider.`});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Internal server error'});
    }
};

/*
|----------------------------------------------------------------------------------------------------------------
|   StoreAndForwardSms 
|----------------------------------------------------------------------------------------------------------------
*/
export const storeAndForwardSms = async (req, res) => {
    try {
        const smsList = req.body;

        // Validate request body
        if (!Array.isArray(smsList) || smsList.length === 0) {
            return res.status(400).json({error: 'Invalid request body'});
        }

        // Save SMS messages to database
        const savedSmsList = await Sms.create(smsList);

        res.json({message: 'SMS messages saved successfully', data: savedSmsList});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Internal server error'});
    }
};
