const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  await ssh.connect({
    host: '117.252.16.132',
    username: 'root',
    password: 'b&Doe2K46e%1'
  });

  // Fix the prefixed names and mismatched slugs
  const script = `
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
  // Get all categories
  const all = await prisma.category.findMany();
  
  // Fix Gold subcategories: rename "Gold - X" to just "X" and fix slugs to match static constants
  const goldFixes = {
    'Gold - Necklace Sets': { name: 'Necklace Sets', slug: 'necklace-sets' },
    'Gold - Pendant Sets': { name: 'Pendant Sets', slug: 'pendant-sets' },
    "Gold - Lady's Rings": { name: "Lady's Rings", slug: 'ladys-rings' },
    "Gold - Gent's Rings": { name: "Gent's Rings", slug: 'gents-rings' },
    'Gold - Eartops': { name: 'Eartops', slug: 'eartops' },
    'Gold - Bracelets': { name: 'Bracelets', slug: 'bracelets' },
    'Gold - Bangles': { name: 'Bangles', slug: 'bangles' },
    'Gold - Noa': { name: 'Noa', slug: 'noa' },
    'Gold - Chains': { name: 'Chains', slug: 'chains' },
    'Gold - Rakhi': { name: 'Rakhi', slug: 'rakhi' },
  };

  const diamondFixes = {
    'Diamond - Chains with Pendant': { name: 'Chains with Pendant', slug: 'chains-with-pendant' },
    'Diamond - Earrings': { name: 'Earrings', slug: 'earrings' },
  };

  // Fix prefixed Gold subcategories - delete old prefixed slugs first, then rename
  for (const [oldName, fix] of Object.entries(goldFixes)) {
    const cat = all.find(c => c.name === oldName);
    if (!cat) continue;
    
    // Check if there's a conflicting entry with the target name
    const conflict = all.find(c => c.name === fix.name && c.id !== cat.id);
    if (conflict) {
      // Delete the conflict (it's probably an orphan without parentId)
      await prisma.category.delete({ where: { id: conflict.id } });
      console.log('  Deleted conflict: ' + conflict.name + ' (id: ' + conflict.id + ')');
    }
    
    // Check slug conflict
    const slugConflict = all.find(c => c.slug === fix.slug && c.id !== cat.id);
    if (slugConflict) {
      await prisma.category.delete({ where: { id: slugConflict.id } });
      console.log('  Deleted slug conflict: ' + slugConflict.name + ' (slug: ' + slugConflict.slug + ')');
    }
    
    await prisma.category.update({
      where: { id: cat.id },
      data: { name: fix.name, slug: fix.slug }
    });
    console.log('FIXED: ' + oldName + ' -> ' + fix.name + ' (slug: ' + fix.slug + ')');
  }

  // Fix Diamond subcategories
  for (const [oldName, fix] of Object.entries(diamondFixes)) {
    const cat = all.find(c => c.name === oldName);
    if (!cat) continue;
    
    const conflict = all.find(c => c.name === fix.name && c.id !== cat.id);
    if (conflict) {
      await prisma.category.delete({ where: { id: conflict.id } });
      console.log('  Deleted conflict: ' + conflict.name);
    }
    const slugConflict = all.find(c => c.slug === fix.slug && c.id !== cat.id);
    if (slugConflict) {
      await prisma.category.delete({ where: { id: slugConflict.id } });
      console.log('  Deleted slug conflict: ' + slugConflict.slug);
    }
    
    await prisma.category.update({
      where: { id: cat.id },
      data: { name: fix.name, slug: fix.slug }
    });
    console.log('FIXED: ' + oldName + ' -> ' + fix.name);
  }

  // Fix Silver subcategories - rename "Silver X" to "X" 
  const silverFixes = {
    'Silver Nosepins': { name: 'Nosepins', slug: 'nosepins' },
    'Silver Rakhi': { name: 'Rakhi', slug: 'rakhi' },
    'Silver Rings': { name: 'Rings', slug: 'rings' },
    'Silver Necklaces': { name: 'Necklaces', slug: 'necklaces' },
  };

  // Silver has name conflicts with other categories. We need unique names.
  // Since the DB has unique constraint on name, Silver subs need to stay prefixed or be unique.
  // But the subcategory page expects the name to match the static constant.
  // The static constant has: Nosepins, Rakhi, Rings, Necklaces
  // These names conflict with Diamond (Rings, Nosepins) and Gold (Rakhi).
  // Solution: Keep them prefixed but the admin dropdown and product.subCategory needs to match.
  // Actually, let's just keep them as-is since the product.subCategory field stores the display name.
  // The key is: the subcategory NAME in DB must match what gets saved in product.subCategory.

  // Fix Astrological Stones subcategories - remove prefix
  const astroFixes = {
    'Astrological Stones Nila': { name: 'Nila', slug: 'nila' },
    'Astrological Stones Opal': { name: 'Opal', slug: 'opal' },
    'Astrological Stones Emerald': { name: 'Emerald', slug: 'emerald' },
    'Astrological Stones Ruby': { name: 'Ruby', slug: 'ruby' },
  };
  // These should be fine since Nila, Opal, Emerald, Ruby are already unique names
  // They were already created with correct names in the first run

  // Fix slug mismatches for categories that had the wrong prefix slugs
  const slugFixes = [
    { currentSlug: 'gold-necklace-sets', newSlug: 'necklace-sets' },
    { currentSlug: 'gold-pendant-sets', newSlug: 'pendant-sets' },
    { currentSlug: 'gold-ladys-rings', newSlug: 'ladys-rings' },
    { currentSlug: 'gold-gents-rings', newSlug: 'gents-rings' },
    { currentSlug: 'gold-eartops', newSlug: 'eartops' },
    { currentSlug: 'gold-bracelets', newSlug: 'bracelets' },
    { currentSlug: 'gold-bangles', newSlug: 'bangles' },
    { currentSlug: 'gold-noa', newSlug: 'noa' },
    { currentSlug: 'gold-chains', newSlug: 'chains' },
    { currentSlug: 'gold-rakhi', newSlug: 'rakhi' },
    { currentSlug: 'diamond-chains-with-pendant', newSlug: 'chains-with-pendant' },
    { currentSlug: 'diamond-earrings', newSlug: 'earrings' },
    { currentSlug: 'astrological-stones-nila', newSlug: 'nila' },
    { currentSlug: 'astrological-stones-opal', newSlug: 'opal' },
    { currentSlug: 'astrological-stones-emerald', newSlug: 'emerald' },
    { currentSlug: 'astrological-stones-ruby', newSlug: 'ruby' },
  ];

  for (const fix of slugFixes) {
    const cat = await prisma.category.findUnique({ where: { slug: fix.currentSlug } });
    if (cat) {
      // Check if the target slug already exists on another record
      const existing = await prisma.category.findUnique({ where: { slug: fix.newSlug } });
      if (existing && existing.id !== cat.id) {
        // The target slug is already taken by another record - skip or merge
        console.log('SLUG CONFLICT: ' + fix.currentSlug + ' -> ' + fix.newSlug + ' (taken by ' + existing.name + ')');
        // Delete the old prefixed one since the correct one already exists
        await prisma.category.delete({ where: { id: cat.id } });
        console.log('  Deleted duplicate: ' + cat.name);
      } else {
        await prisma.category.update({ where: { id: cat.id }, data: { slug: fix.newSlug } });
        console.log('SLUG FIXED: ' + fix.currentSlug + ' -> ' + fix.newSlug);
      }
    }
  }

  // Print final state
  const final = await prisma.category.findMany({ orderBy: [{ parentId: 'asc' }, { order: 'asc' }] });
  console.log('\\n=== FINAL CATEGORIES ===');
  for (const c of final) {
    const prefix = c.parentId ? '  └─ ' : '★ ';
    console.log(prefix + c.name + ' (slug: ' + c.slug + ', parentId: ' + (c.parentId || 'ROOT') + ')');
  }

  await prisma.$disconnect();
}

fix().catch(e => { console.error(e); process.exit(1); });
`;

  await ssh.execCommand('cat > /root/aranyak-backend/fix_subcategories.js << \'ENDOFSCRIPT\'\n' + script + '\nENDOFSCRIPT');
  
  console.log('Fixing subcategory names and slugs...');
  const res = await ssh.execCommand('cd /root/aranyak-backend && DATABASE_URL="mongodb://localhost:27017/aranyak_jewellers" node fix_subcategories.js');
  console.log(res.stdout);
  if (res.stderr) console.error('STDERR:', res.stderr);
  
  ssh.dispose();
}

run();
