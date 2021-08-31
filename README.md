# Support for secrets in Cloudformation
As you may know, there are AWS resources with direct support for secrets from SecretsManager. That was a great advantage to directly reference secrets without writing them in the control versions.

Nevertheless, what happens when you want to maintain your secrets on your version controlled repository? For example, your legacy Mysql password that will be used by your brand new ECS service. Maybe an option is to encrypt it with KMS to prevent secrets leaking but how would you inject them in SecretsManager securely?

Your first challenge will be to design and implement a system that given a KMS encrypted string, decrypt and write it as a secret in SecretsManager to allow any AWS service to use it.  

We expect:
* PoC explanation
* A working example

We will value positively:
* Cost optimization

---

## Flow
Let's suppose we already have generated a symetric master key in our KMS and we already have encrypted our secret. Also we have generate and IAM User* with only permissions for using KMS and storing secrets in AWS Secret Manager then We have stored this credentials in our repository. This is done only by administrators. The KMS service should track the requests and responses in order to be audited.
*We can add an extra layer of security (but loosing automation) creating an IAM role instead and generating temporary security credentials which expires after a short period of time. So we have to generate one and put it in our repository before add the new credentials.

1. We add the new encrypted secret in our repository and push new changes.
2. The pipeline runs and execute a script.
3. The script detects new or modified secrets in our repository. Call the KMS Service to get the Sends those secrets to the KMS in order to be decrypted. The KMS service responses with the decrypted secrets in plain text. The script sends this secrets to the AWS Secret Manager service in order to be stored and used by other services. The script NOT MUST log the secret in plain text.
