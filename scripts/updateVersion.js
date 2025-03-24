const fs = require('fs');
const semver = require('semver');
const packageJson = require('../package.json');

// 获取当前版本号
let currentVersion = packageJson.version;

// 生成新的版本号（假设你想增加次版本号）major 主 minor 次 patch 辅版本号
let newVersion = semver.inc(currentVersion, 'patch');

// 更新 package.json 中的版本号
packageJson.version = newVersion; 

// 写回到 package.json
fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));