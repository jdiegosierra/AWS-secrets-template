const AWS = require('aws-sdk');

const kms = new AWS.KMS({
    region: process.env.AWS_REGION
});

(async () =>  {
    const secret = 'DUMMY_PASSWORD';

    try {
        const encrypted = await kms.encrypt({ KeyId: process.env.AWS_KMS_ID, Plaintext: secret }).promise();
        console.log(encrypted.CiphertextBlob.toString('base64'));
    }
    catch (error) {
        console.error(error);
    }
})();
