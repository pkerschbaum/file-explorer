import { createFileExplorerAgent } from '#pkg/file-explorer-agent/initialize-file-explorer-agent';

async function run() {
  const agent = await createFileExplorerAgent();
  agent.listen();
}
void run();
