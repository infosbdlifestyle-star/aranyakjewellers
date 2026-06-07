const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function seedData() {
  try {
    console.log('Connecting to VPS...');
    await ssh.connect({
      host: '117.252.16.132',
      username: 'root',
      password: '$9T%Lk057bzu'
    });
    console.log('Connected!');

    // 1. Register Admin User via API
    console.log('\n=== Creating Admin User ===');
    let res = await ssh.execCommand(`curl -s -X POST http://localhost:3001/api/auth/register -H "Content-Type: application/json" -d '{"name":"Aranyak Admin","email":"admin@aranyakjewellers.com","password":"Aranyak@2026"}'`);
    console.log('Register:', res.stdout);

    // 2. Upgrade user to SUPER_ADMIN in MongoDB
    console.log('\n=== Upgrading to SUPER_ADMIN ===');
    res = await ssh.execCommand(`mongosh aranyak --eval 'db.User.updateOne({email:"admin@aranyakjewellers.com"},{$set:{role:"SUPER_ADMIN"}})'`);
    console.log('Upgrade:', res.stdout);

    // 3. Login to get JWT token
    console.log('\n=== Logging in ===');
    res = await ssh.execCommand(`curl -s -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@aranyakjewellers.com","password":"Aranyak@2026"}'`);
    console.log('Login response:', res.stdout);
    
    let loginData;
    try {
      loginData = JSON.parse(res.stdout);
    } catch(e) {
      console.error('Failed to parse login response');
      process.exit(1);
    }
    const token = loginData.access_token;
    console.log('Token obtained:', token ? 'YES' : 'NO');

    if (!token) {
      console.error('No token received! Check login response above.');
      process.exit(1);
    }

    // 4. Seed Products — using images from frontend/public/ 
    // The Vercel domain will serve these. For now we use relative paths.
    // Images are identified by viewing them — categorized by jewellery type.
    
    const products = [
      // === GOLD CHAINS ===
      { name: "Royal Link Chain", slug: "royal-link-chain", description: "Exquisite 22KT gold link chain with intricate textured links, perfect for daily wear and festive occasions.", goldPurity: 22, goldWeight: 18.5, category: "Gold", subCategory: "Chains", images: ["/IMG_20260603_123905.png"] },
      { name: "Byzantine Grandeur Chain", slug: "byzantine-grandeur-chain", description: "Magnificent 22KT gold Byzantine chain with barrel clasps, a statement piece of timeless craftsmanship.", goldPurity: 22, goldWeight: 35.2, category: "Gold", subCategory: "Chains", images: ["/IMG_20260603_125336.png"] },
      
      // === GOLD NECKLACE SETS ===
      { name: "Bridal Heritage Necklace Set", slug: "bridal-heritage-necklace-set", description: "A breathtaking bridal necklace set in 22KT gold, featuring traditional motifs and matching earrings.", goldPurity: 22, goldWeight: 45.0, category: "Gold", subCategory: "Necklace Sets", images: ["/IMG_20260603_130625.png"] },
      { name: "Temple Choker Necklace Set", slug: "temple-choker-necklace-set", description: "Ornate temple-style choker set in 22KT gold with fine filigree work and traditional Bengali design.", goldPurity: 22, goldWeight: 38.5, category: "Gold", subCategory: "Necklace Sets", images: ["/IMG_20260603_130726.png"] },
      { name: "Classic Wedding Necklace", slug: "classic-wedding-necklace", description: "Elegant wedding necklace in 22KT gold with layered floral design, handcrafted by master karigars.", goldPurity: 22, goldWeight: 52.0, category: "Gold", subCategory: "Necklace Sets", images: ["/IMG_20260603_125514.png"] },

      // === GOLD BANGLES ===
      { name: "Royal Filigree Bangle Set", slug: "royal-filigree-bangle-set", description: "Stunning set of 22KT gold bangles with delicate filigree patterns, embodying Tripura's finest craftsmanship.", goldPurity: 22, goldWeight: 28.0, category: "Gold", subCategory: "Bangles", images: ["/IMG_20260603_130220.png"] },
      { name: "Contemporary Gold Bangle Pair", slug: "contemporary-gold-bangle-pair", description: "Modern 22KT gold bangle pair with geometric patterns, perfect for everyday elegance.", goldPurity: 22, goldWeight: 22.5, category: "Gold", subCategory: "Bangles", images: ["/IMG_20260603_130343.png"] },
      { name: "Traditional Shakha Bangle", slug: "traditional-shakha-bangle", description: "Exquisite 22KT gold bangle inspired by the traditional Bengali shakha design.", goldPurity: 22, goldWeight: 15.8, category: "Gold", subCategory: "Bangles", images: ["/IMG_20260603_130513.png"] },

      // === GOLD EARRINGS / EARTOPS ===
      { name: "Chandelier Drop Earrings", slug: "chandelier-drop-earrings", description: "Magnificent 22KT gold chandelier earrings with cascading tiers of handcrafted gold leaves.", goldPurity: 22, goldWeight: 12.5, category: "Gold", subCategory: "Eartops", images: ["/IMG_20260603_132136.png"] },
      { name: "Jhumka Heritage Earrings", slug: "jhumka-heritage-earrings", description: "Classic 22KT gold jhumka earrings featuring traditional dome design with delicate filigree work.", goldPurity: 22, goldWeight: 14.2, category: "Gold", subCategory: "Eartops", images: ["/IMG_20260603_132405.png"] },
      { name: "Floral Stud Eartops", slug: "floral-stud-eartops", description: "Elegant 22KT gold floral stud eartops, lightweight and perfect for daily wear.", goldPurity: 22, goldWeight: 5.5, category: "Gold", subCategory: "Eartops", images: ["/IMG_20260603_132847.png"] },

      // === GOLD RINGS — LADY'S ===
      { name: "Lotus Bloom Ladies Ring", slug: "lotus-bloom-ladies-ring", description: "Delicate 22KT gold ring featuring a blooming lotus motif, symbolizing purity and grace.", goldPurity: 22, goldWeight: 4.2, category: "Gold", subCategory: "Lady's Rings", images: ["/IMG_20260603_133127.png"] },
      { name: "Twisted Rope Ladies Ring", slug: "twisted-rope-ladies-ring", description: "Elegant 22KT gold twisted rope design ring, a modern classic for the contemporary woman.", goldPurity: 22, goldWeight: 3.8, category: "Gold", subCategory: "Lady's Rings", images: ["/IMG_20260603_133228.png"] },

      // === GOLD RINGS — GENT'S ===
      { name: "Sovereign Signet Ring", slug: "sovereign-signet-ring", description: "Bold 22KT gold signet ring for men, featuring a classic flat-top design with textured shoulders.", goldPurity: 22, goldWeight: 8.5, category: "Gold", subCategory: "Gent's Rings", images: ["/IMG_20260603_133507.png"] },

      // === GOLD PENDANT SETS ===
      { name: "Peacock Pendant Set", slug: "peacock-pendant-set", description: "Exquisite 22KT gold peacock pendant with matching chain, showcasing intricate feather detailing.", goldPurity: 22, goldWeight: 10.8, category: "Gold", subCategory: "Pendant Sets", images: ["/IMG_20260603_134643.png"] },
      { name: "Divine Lakshmi Pendant Set", slug: "divine-lakshmi-pendant-set", description: "Auspicious 22KT gold Lakshmi pendant set with fine engraving, blessed for prosperity.", goldPurity: 22, goldWeight: 12.0, category: "Gold", subCategory: "Pendant Sets", images: ["/IMG_20260603_134842.png"] },

      // === GOLD BRACELETS ===
      { name: "Heritage Gold Bracelet", slug: "heritage-gold-bracelet", description: "Stunning 22KT gold bracelet with interlocking oval links and micro-engraved detailing.", goldPurity: 22, goldWeight: 20.5, category: "Gold", subCategory: "Bracelets", images: ["/IMG_20260603_135005.png"] },
      { name: "Classic Cuban Link Bracelet", slug: "classic-cuban-link-bracelet", description: "Bold 22KT gold Cuban link bracelet for men, a timeless statement of strength and style.", goldPurity: 22, goldWeight: 25.0, category: "Gold", subCategory: "Bracelets", images: ["/IMG_20260603_135153.png"] },

      // === DIAMOND PIECES ===
      { name: "Solitaire Diamond Ring", slug: "solitaire-diamond-ring", description: "Breathtaking 18KT white gold ring featuring a brilliant-cut VS1 solitaire diamond.", goldPurity: 18, goldWeight: 3.5, category: "Diamond", subCategory: "Rings", images: ["/IMG_20260603_141002.png"] },
      { name: "Diamond Eternity Band", slug: "diamond-eternity-band", description: "Elegant 18KT gold eternity band set with channel-set diamonds, perfect for engagements.", goldPurity: 18, goldWeight: 4.0, category: "Diamond", subCategory: "Rings", images: ["/IMG_20260603_141113.png"] },
      { name: "Diamond Cluster Earrings", slug: "diamond-cluster-earrings", description: "Stunning 18KT gold earrings with a cluster of hand-selected diamonds radiating pure brilliance.", goldPurity: 18, goldWeight: 6.2, category: "Diamond", subCategory: "Earrings", images: ["/IMG_20260603_141216.png"] },
      { name: "Diamond Pear Drop Pendant", slug: "diamond-pear-drop-pendant", description: "Exquisite 18KT gold pendant featuring a pear-shaped diamond surrounded by a halo of micropavé stones.", goldPurity: 18, goldWeight: 5.8, category: "Diamond", subCategory: "Chains with Pendant", images: ["/IMG_20260603_141310.png"] },
      { name: "Diamond Tennis Bracelet", slug: "diamond-tennis-bracelet", description: "Classic 18KT gold tennis bracelet with 40 round-cut diamonds totaling 3.5 carats.", goldPurity: 18, goldWeight: 12.0, category: "Diamond", subCategory: "Chains with Pendant", images: ["/IMG_20260603_141414.png"] },

      // === GOLD NOA ===
      { name: "Traditional Bengali Noa", slug: "traditional-bengali-noa", description: "Sacred 22KT gold Noa (iron bangle with gold casing), a symbol of Bengali matrimony and tradition.", goldPurity: 22, goldWeight: 8.0, category: "Gold", subCategory: "Noa", images: ["/IMG_20260603_141759.png"] },
      { name: "Designer Bridal Noa Set", slug: "designer-bridal-noa-set", description: "Premium 22KT gold Noa pair with ornate floral carvings, essential for the Bengali bride.", goldPurity: 22, goldWeight: 12.5, category: "Gold", subCategory: "Noa", images: ["/IMG_20260603_141906.png"] },

      // === MORE GOLD NECKLACES ===
      { name: "Antique Rani Haar", slug: "antique-rani-haar", description: "Majestic 22KT gold Rani Haar (long necklace) with antique finish, inspired by royal Mughal aesthetics.", goldPurity: 22, goldWeight: 68.0, category: "Gold", subCategory: "Necklace Sets", images: ["/IMG_20260603_142317.png"] },
      { name: "Floral Garland Necklace", slug: "floral-garland-necklace", description: "Delicate 22KT gold necklace featuring interlinked floral garland motifs.", goldPurity: 22, goldWeight: 32.0, category: "Gold", subCategory: "Necklace Sets", images: ["/IMG_20260603_142357.png"] },
      { name: "Kundan Bridal Choker", slug: "kundan-bridal-choker", description: "Opulent 22KT gold Kundan choker necklace with precious stone settings for the discerning bride.", goldPurity: 22, goldWeight: 42.0, category: "Gold", subCategory: "Necklace Sets", images: ["/IMG_20260603_142431.png"] },

      // === SILVER PIECES (JPG images) ===
      { name: "Silver Filigree Necklace", slug: "silver-filigree-necklace", description: "Handcrafted sterling silver filigree necklace, showcasing the delicate artistry of Tripura's silversmiths.", goldPurity: 22, goldWeight: 45.0, category: "Silver", subCategory: "Necklaces", images: ["/IMG_20260603_142555.jpg"] },
      { name: "Silver Statement Ring", slug: "silver-statement-ring", description: "Bold sterling silver statement ring with oxidized finish and traditional motifs.", goldPurity: 22, goldWeight: 12.0, category: "Silver", subCategory: "Rings", images: ["/IMG_20260603_142625.jpg"] },
      { name: "Silver Nose Pin Collection", slug: "silver-nose-pin-collection", description: "Elegant collection of sterling silver nose pins in various traditional and contemporary designs.", goldPurity: 22, goldWeight: 1.5, category: "Silver", subCategory: "Nosepins", images: ["/IMG_20260603_142707.jpg"] },
      { name: "Silver Rakhi Special", slug: "silver-rakhi-special", description: "Pure silver Rakhi with sacred Om motif, the perfect gift to celebrate the bond of siblings.", goldPurity: 22, goldWeight: 5.0, category: "Silver", subCategory: "Rakhi", images: ["/IMG_20260603_142739.jpg"] },

      // === MORE PIECES ===
      { name: "Gold Rakhi Collection", slug: "gold-rakhi-collection", description: "Premium 22KT gold Rakhis in multiple sacred designs — Om, Swastik, and floral patterns.", goldPurity: 22, goldWeight: 3.5, category: "Gold", subCategory: "Rakhi", images: ["/IMG_20260603_143014.jpg"] },
      { name: "Diamond Nose Pin", slug: "diamond-nose-pin", description: "Delicate 18KT gold nose pin with a single brilliant-cut diamond, subtle and stunning.", goldPurity: 18, goldWeight: 0.8, category: "Diamond", subCategory: "Nosepins", images: ["/IMG_20260603_143103.jpg"] },

      // === COSTUME JEWELLERY ===
      { name: "Temple Gold-Plated Choker Set", slug: "temple-gold-plated-choker-set", description: "Magnificent gold-plated temple choker necklace set with matching jhumka earrings, perfect for festive occasions.", goldPurity: 22, goldWeight: 0, category: "Costume Jewellery", subCategory: "", images: ["/IMG_20260603_143133.jpg"] },
      { name: "Oxidized Silver Statement Set", slug: "oxidized-silver-statement-set", description: "Trending oxidized silver-finish statement necklace with tribal-inspired design elements.", goldPurity: 22, goldWeight: 0, category: "Costume Jewellery", subCategory: "", images: ["/IMG_20260603_143206.jpg"] },

      // === EVENING COLLECTION (191xxx images) ===
      { name: "Royal Maharani Necklace Set", slug: "royal-maharani-necklace-set", description: "Opulent 22KT gold bridal necklace set featuring cascading medallions and intricate temple work.", goldPurity: 22, goldWeight: 75.0, category: "Gold", subCategory: "Necklace Sets", images: ["/IMG_20260603_191429.png"] },
      { name: "Layered Cascade Necklace", slug: "layered-cascade-necklace", description: "Multi-layered 22KT gold necklace with graduating pendants, an editorial masterpiece.", goldPurity: 22, goldWeight: 48.0, category: "Gold", subCategory: "Necklace Sets", images: ["/IMG_20260603_191511.png"] },
      { name: "Grand Bridal Patta Haar", slug: "grand-bridal-patta-haar", description: "Majestic 22KT gold Patta Haar, a traditional long bridal necklace adorned with precious details.", goldPurity: 22, goldWeight: 85.0, category: "Gold", subCategory: "Necklace Sets", images: ["/IMG_20260603_191552.png"] },
      { name: "Filigree Drop Earrings", slug: "filigree-drop-earrings", description: "Handcrafted 22KT gold filigree drop earrings, a testament to Tripura's renowned goldsmith traditions.", goldPurity: 22, goldWeight: 8.5, category: "Gold", subCategory: "Eartops", images: ["/IMG_20260603_191636.png"] },
      { name: "Heritage Broad Bangle", slug: "heritage-broad-bangle", description: "Magnificent 22KT gold broad bangle with embossed paisley and lotus motifs.", goldPurity: 22, goldWeight: 35.0, category: "Gold", subCategory: "Bangles", images: ["/IMG_20260603_191719.png"] },
      { name: "Twisted Rope Gold Chain", slug: "twisted-rope-gold-chain", description: "Premium 22KT gold twisted rope chain with superior finish, ideal for men and women.", goldPurity: 22, goldWeight: 22.0, category: "Gold", subCategory: "Chains", images: ["/IMG_20260603_191831.png"] },
      { name: "Emerald Astrological Ring", slug: "emerald-astrological-ring", description: "22KT gold ring set with a certified natural Emerald (Panna), recommended for Mercury (Budh) alignment.", goldPurity: 22, goldWeight: 6.5, category: "Astrological Stones", subCategory: "Emerald", images: ["/IMG_20260603_191918.png"] },
      { name: "Ruby Astrological Pendant", slug: "ruby-astrological-pendant", description: "22KT gold pendant featuring a certified natural Ruby (Manik), recommended for Sun (Surya) alignment.", goldPurity: 22, goldWeight: 5.2, category: "Astrological Stones", subCategory: "Ruby", images: ["/IMG_20260603_192012.png"] },
    ];

    console.log(`\n=== Seeding ${products.length} Products ===`);
    
    let success = 0;
    let failed = 0;
    for (const product of products) {
      const payload = JSON.stringify(product).replace(/'/g, "'\\''");
      const cmd = `curl -s -X POST http://localhost:3001/api/products -H "Content-Type: application/json" -H "Authorization: Bearer ${token}" -d '${payload}'`;
      res = await ssh.execCommand(cmd);
      try {
        const result = JSON.parse(res.stdout);
        if (result.id || result.slug) {
          console.log(`✅ ${product.name}`);
          success++;
        } else {
          console.log(`⚠️ ${product.name}: ${res.stdout}`);
          failed++;
        }
      } catch(e) {
        console.log(`❌ ${product.name}: ${res.stdout || res.stderr}`);
        failed++;
      }
    }

    console.log(`\n=== Seeding Complete: ${success} success, ${failed} failed ===`);

    // 5. Verify
    res = await ssh.execCommand('curl -s http://localhost:3001/api/products | python3 -c "import sys,json; data=json.load(sys.stdin); print(f\\"Total products: {len(data)}\\")" 2>&1 || curl -s http://localhost:3001/api/products | head -c 200');
    console.log('\nVerification:', res.stdout || res.stderr);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

seedData();
