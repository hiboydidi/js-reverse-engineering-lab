import { spawnSync } from 'node:child_process';

const major = Number(process.versions.node.split('.')[0]);
console.log('Node.js:', process.version);
console.log('Platform:', process.platform, process.arch);

if (major !== 24) {
  console.error('本项目要求 Node.js 24.x。请在仓库根目录执行 nvm install && nvm use。');
  process.exitCode = 1;
} else {
  console.log('Node.js 主版本检查通过。');
}

const npm = spawnSync('npm', ['--version'], { encoding: 'utf8' });
if (npm.status === 0) {
  console.log('npm:', npm.stdout.trim());
} else {
  console.error('未检测到 npm。');
  process.exitCode = 1;
}
