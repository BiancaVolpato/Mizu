// Mechanical extraction only: preserves the approved artwork and alpha transparency.
// Development helper: requires sharp; not used by the mobile application.
const sharp = require('sharp');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const source = path.join(root, 'assets/cats/approved-sheet.png');
const destination = path.join(root, 'assets/cats/approved');
const coats = ['white', 'black', 'gray', 'orange', 'siamese'];
const moods = ['sleeping', 'stretching', 'playing', 'happy', 'celebrating'];
const columns = [[119, 337], [348, 578], [580, 809], [815, 1011], [1018, 1225]];
const rows = [[129, 351], [353, 571], [573, 789], [791, 1011], [1013, 1234]];
async function main() {
  fs.mkdirSync(destination, { recursive: true });
  for (let r = 0; r < coats.length; r++) {
    for (let c = 0; c < moods.length; c++) {
      const [left, right] = columns[c];
      const [top, bottom] = rows[r];
      await sharp(source).extract({ left, top, width: right - left, height: bottom - top })
        .png().toFile(path.join(destination, `${coats[r]}-${moods[c]}.png`));
    }
  }
  console.log('Extracted 25 approved illustrations without redrawing.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
