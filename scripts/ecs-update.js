// scripts/ecs-update.js
const { ECSClient, UpdateServiceCommand } = require("@aws-sdk/client-ecs");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

async function updateECSService(serviceName) {
  const client = new ECSClient({ region: process.env.AWS_REGION });
  const params = {
    cluster: process.env.ECS_CLUSTER,
    service: serviceName,
    forceNewDeployment: true,
  };
  try {
    const command = new UpdateServiceCommand(params);
    const response = await client.send(command);
    console.log(`Service "${serviceName}" updated successfully.`);
  } catch (error) {
    console.error(`Error updating service "${serviceName}":`, error);
    process.exit(1);
  }
}

const argv = yargs(hideBin(process.argv)).argv;
if (!argv.service) {
  console.error("Usage: node ecs-update.js --service <SERVICE_NAME>");
  process.exit(1);
}

updateECSService(argv.service);
