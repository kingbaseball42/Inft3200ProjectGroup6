// scripts/ecr-login.js
const { ECRClient, GetAuthorizationTokenCommand } = require("@aws-sdk/client-ecr");
const { execSync } = require("child_process");

async function loginToECR() {
  const client = new ECRClient({ region: process.env.AWS_REGION });
  const command = new GetAuthorizationTokenCommand({});
  try {
    const response = await client.send(command);
    const authData = response.authorizationData[0];
    const token = Buffer.from(authData.authorizationToken, "base64").toString("ascii");
    const [username, password] = token.split(":");
    const registry = authData.proxyEndpoint.replace("https://", "");
    console.log(`Logging in to ECR registry: ${registry}`);
    execSync(`docker login --username ${username} --password ${password} ${registry}`, { stdio: "inherit" });
  } catch (error) {
    console.error("Error during ECR login:", error);
    process.exit(1);
  }
}

loginToECR();
