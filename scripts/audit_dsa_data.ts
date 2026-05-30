import fs from 'fs';
import path from 'path';

const V3_DIR = path.join(process.cwd(), 'data', 'interviews_v2');
const DSA_PATH = path.join(V3_DIR, 'dsa_roadmap.json');

if (!fs.existsSync(DSA_PATH)) {
  console.error("❌ ERROR: dsa_roadmap.json not found!");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(DSA_PATH, 'utf-8'));

console.log("==================================================");
console.log("             DSA DATA INTEGRITY AUDIT             ");
console.log("==================================================\n");

let errorsFound = 0;

data.tracks.forEach((track: any) => {
  console.log(`Analyzing Track: [${track.title}]`);
  
  track.weeks.forEach((week: any) => {
    let weekErrors = [];

    if (!week.questions || week.questions.length === 0) {
      weekErrors.push("- MISSING: Practice Questions (0 questions found)");
    }
    
    if (!week.projects || week.projects.length === 0) {
      weekErrors.push("- MISSING: Applied Projects (0 projects found)");
    } else {
      week.projects.forEach((p: any) => {
        if (!p.viva || !p.viva.questions) {
          weekErrors.push(`- MISSING VIVA: Project '${p.name}' is missing Viva questions.`);
        }
      });
    }

    if (!week.mockQuiz || !week.mockQuiz.questions) {
      weekErrors.push("- MISSING: Mock Quiz Assessment");
    }

    if (weekErrors.length > 0) {
      console.log(`\n❌ Week ${week.week} (${week.title}) FAILED AUDIT:`);
      weekErrors.forEach(err => console.log(`   ${err}`));
      errorsFound++;
    } else {
      console.log(`✅ Week ${week.week} passes audit. (${week.questions.length} questions, ${week.projects.length} projects, quiz linked)`);
    }
  });
  console.log("--------------------------------------------------");
});

console.log("\n==================================================");
if (errorsFound === 0) {
  console.log("✅ SUCCESS: All weeks contain required datasets!");
} else {
  console.error(`❌ FAILED: Found ${errorsFound} weeks with missing data.`);
  process.exit(1);
}
console.log("==================================================\n");
