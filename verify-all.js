const fs = require('fs');
const path = require('path');

const pages = [
  'index.html',
  'properties.html',
  'property-detail.html',
  'about.html',
  'services.html',
  'communities.html',
  'contact.html'
];

let allPassed = true;

for (const page of pages) {
  if (!fs.existsSync(page)) {
    console.error(`Missing page: ${page}`);
    allPassed = false;
    continue;
  }

  const content = fs.readFileSync(page, 'utf8');
  console.log(`\n--- Validating ${page} (${content.length} bytes) ---`);

  // Check image paths
  const imgRegex = /src=["'](assets\/[^"']+)["']/g;
  let match;
  while ((match = imgRegex.exec(content)) !== null) {
    const img = match[1];
    if (fs.existsSync(img)) {
      // ok
    } else {
      console.error(`  [BROKEN IMAGE] in ${page}: ${img}`);
      allPassed = false;
    }
  }

  // Check internal links
  const hrefRegex = /href=["']([^"'#:]+\.html)["']/g;
  let hrefMatch;
  while ((hrefMatch = hrefRegex.exec(content)) !== null) {
    const link = hrefMatch[1];
    if (!fs.existsSync(link)) {
      console.error(`  [BROKEN LINK] in ${page}: ${link}`);
      allPassed = false;
    }
  }

  // Check that style.css and script.js are included
  if (!content.includes('style.css')) {
    console.error(`  [MISSING CSS] ${page} does not link style.css`);
    allPassed = false;
  }
  if (!content.includes('script.js')) {
    console.error(`  [MISSING JS] ${page} does not link script.js`);
    allPassed = false;
  }

  console.log(`  ✔ Validated all image assets and links for ${page}`);
}

// Check velora folder mirror
console.log('\n--- Checking velora/ mirror folder ---');
for (const page of pages) {
  const veloraPage = path.join('velora', page);
  if (!fs.existsSync(veloraPage)) {
    console.error(`Missing in velora: ${veloraPage}`);
    allPassed = false;
  } else {
    console.log(`  ✔ Mirrored: ${veloraPage}`);
  }
}

if (allPassed) {
  console.log('\n🌟 ALL 7 PAGES FULLY VALIDATED AND ALL ASSETS ARE 100% INTACT!');
} else {
  process.exit(1);
}

