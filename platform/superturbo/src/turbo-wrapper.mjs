#!/usr/bin/env node
/**
 * this module is a simple wrapper for "turbo" which
 * - if no explicit "concurrency" is given, sets a default of 100% (to utilize all logical processors, see https://turbo.build/repo/docs/reference/command-line-reference/run#--concurrency)
 * - and sets some default CLI arguments (e.g. "--env-mode=strict")
 */
import { spawn } from 'node:child_process';
import { argv } from 'node:process';

const [_execPath, _jsFilePath, ...commandLineArguments] = argv;

commandLineArguments.push(
  '--no-update-notifier',
  '--env-mode=strict',
  '--framework-inference=false',
);

if (!commandLineArguments.some((arg) => arg.startsWith('--concurrency'))) {
  commandLineArguments.push('--concurrency=100%');
}

spawn('turbo', commandLineArguments, {
  cwd: process.cwd(),
  stdio: 'inherit',
  env: process.env,
  // set shell to true for windows (https://stackoverflow.com/a/54515183)
  shell: process.platform === 'win32',
}).on('exit', (code) => {
  if (code !== null) {
    process.exitCode = code;
  }
});
