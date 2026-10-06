const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  await ssh.connect({
    host: '117.252.16.132',
    username: 'root',
    password: 'b&Doe2K46e%1'
  });

  // Run a Node script on the VPS to seed subcategories
  const script = `
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  // Define all subcategories grouped by parent name
  const hierarchy = {
    'Gold': [
      { name: 'Necklace Sets', slug: 'necklace-sets', order: 1 },
      { name: 'Pendant Sets', slug: 'pendant-sets', order: 2 },
      { name: "Lady's Rings", slug: 'ladys-rings', order: 3 },
      { name: "Gent's Rings", slug: 'gents-rings', order: 4 },
      { name: 'Eartops', slug: 'eartops', order: 5 },
      { name: 'Bracelets', slug: 'bracelets', order: 6 },
      { name: 'Bangles', slug: 'bangles', order: 7 },
      { name: 'Noa', slug: 'noa', order: 8 },
      { name: 'Chains', slug: 'chains', order: 9 },
      { name: 'Rakhi', slug: 'rakhi', order: 10 },
    ],
    'Diamond': [
      { name: 'Chains with Pendant', slug: 'chains-with-pendant', order: 1 },
      { name: 'Rings', slug: 'diamond-rings', order: 2 },
      { name: 'Earrings', slug: 'earrings', order: 3 },
      { name: 'Nosepins', slug: 'diamond-nosepins', order: 4 },
    ],
    'Silver': [
      { name: 'Nosepins', slug: 'silver-nosepins', order: 1 },
      { name: 'Rakhi', slug: 'silver-rakhi', order: 2 },
      { name: 'Rings', slug: 'silver-rings', order: 3 },
      { name: 'Necklaces', slug: 'silver-necklaces', order: 4 },
    ],
    'Astrological Stones': [
      { name: 'Nila', slug: 'nila', order: 1 },
      { name: 'Opal', slug: 'opal', order: 2 },
      { name: 'Emerald', slug: 'emerald', order: 3 },
      { name: 'Ruby', slug: 'ruby', order: 4 },
    ],
  };

  for (const [parentName, subs] of Object.entries(hierarchy)) {
    // Find the parent category
    const parent = await prisma.category.findUnique({ where: { name: parentName } });
    if (!parent) {
      console.log('SKIP: Parent "' + parentName + '" not found in DB');
      continue;
    }
    console.log('Parent: ' + parentName + ' (id: ' + parent.id + ')');

    for (const sub of subs) {
      try {
        const existing = await prisma.category.findUnique({ where: { slug: sub.slug } });
        if (existing) {
          // Update parentId if missing
          if (!existing.parentId) {
            await prisma.category.update({
              where: { id: existing.id },
              data: { parentId: parent.id, order: sub.order }
            });
            console.log('  UPDATED: ' + sub.name + ' -> parentId set');
          } else {
            console.log('  EXISTS: ' + sub.name);
          }
        } else {
          await prisma.category.create({
            data: {
              name: sub.name,
              slug: sub.slug,
              parentId: parent.id,
              order: sub.order,
              isActive: true,
            }
          });
          console.log('  CREATED: ' + sub.name);
        }
      } catch (err) {
        // Handle unique constraint on name - try with parent prefix
        try {
          const prefixedName = parentName + ' - ' + sub.name;
          await prisma.category.create({
            data: {
              name: prefixedName,
              slug: sub.slug,
              parentId: parent.id,
              order: sub.order,
              isActive: true,
            }
          });
          console.log('  CREATED (prefixed): ' + prefixedName);
        } catch (err2) {
          console.log('  ERROR: ' + sub.name + ' - ' + err2.message);
        }
      }
    }
  }

  // Print final state
  const all = await prisma.category.findMany({ orderBy: { order: 'asc' } });
  console.log('\\n=== ALL CATEGORIES ===');
  for (const c of all) {
    const prefix = c.parentId ? '  └─ ' : '';
    console.log(prefix + c.name + ' (slug: ' + c.slug + ', parentId: ' + (c.parentId || 'null') + ')');
  }

  await prisma.$disconnect();
}

seed().catch(e => { console.error(e); process.exit(1); });
`;

  // Write script to VPS and run it
  await ssh.execCommand('cat > /root/aranyak-backend/seed_subcategories.js << \'ENDOFSCRIPT\'\n' + script + '\nENDOFSCRIPT');
  
  console.log('Running subcategory seeder on VPS...');
  const res = await ssh.execCommand('cd /root/aranyak-backend && DATABASE_URL="mongodb://localhost:27017/aranyak_jewellers" node seed_subcategories.js');
  console.log(res.stdout);
  if (res.stderr) console.error('STDERR:', res.stderr);
  
  ssh.dispose();
}

run();
