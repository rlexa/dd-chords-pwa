const Md5 = require('ts-md5').Md5;
const fs = require('fs');

const md5 = (val) => Md5.hashStr(val).toString();

process.on('SIGINT', () => process.exit());

function filePathToHash(path) {
  let hash = undefined;
  try {
    hash = md5(fs.readFileSync(path).toString());
  } catch (ex) {
    console.error(`Couldn't hash file "${path}".`, ex);
  }
  return hash;
}

function main(path) {
  console.log(`Creating chords index in "${path}"...`);
  try {
    const files = fs
      .readdirSync(path)
      .filter((filePath) => filePath.endsWith('.txt'))
      .sort()
      .map((filePath) => ({hash: filePathToHash(path + '/' + filePath), path: filePath}));
    console.log(`...hashed ${files.length} files, writing index...`);
    fs.writeFileSync(path + '/' + 'dd-chords.json', JSON.stringify({files}, null, 2));
    console.log(`...done`);
  } catch (ex) {
    console.error(`Failed to create index.`, ex);
  }
}

main('./src/assets/dd-chords');
