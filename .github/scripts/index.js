const AWS = require('aws-sdk');

const KMS = new AWS.KMS({
    region: process.env.AWS_REGION
});
const SSM = new AWS.SSM({
    region: process.env.AWS_REGION
});

const secrets = require('../../secrets.json');

(async () =>  {
    console.warn('This logs are only for testing purposes:');
    try {
        for await (const secretKey of Object.keys(secrets)) {
            console.log('1º Get encrypted secret');
            console.log({ secretKey: secretKey });
            console.log({ encryptedSecretValue: secrets[secretKey] });

            console.log('2º Decrypt secretValue');
            const decrypted = await KMS.decrypt({ KeyId: process.env.AWS_KMS_ID, CiphertextBlob: Buffer.from(secrets[secretKey], 'base64')}).promise();
            console.log({ decryptedSecretValue: decrypted.Plaintext });

            console.log('3º Store decrypted secret in SSM');
            await SSM.putParameter({ Name: secretKey, Value: decrypted.Plaintext.toString('utf8'), Type: 'String', Overwrite: true }).promise();

            console.log('4º Get secret from SSM');
            const sqlPassword = await SSM.getParameter({ Name: secretKey}).promise();
            console.log({ decryptedSecretValue: sqlPassword.Parameter.Value });
        }
    }
    catch (error) {
        console.error(error);
    }
})();
