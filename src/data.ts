import { Product } from './types';

export const CATEGORIES = ['Tech Accessories', 'Fashion Imports', 'Home Goods'] as const;

export const PRODUCTS: Product[] = [
  {
    id: 'tech-1',
    name: 'AeroCharge MagSafe Dual Stand',
    category: 'Tech Accessories',
    price: 49.00,
    rating: 4.8,
    reviewsCount: 124,
    images: [
      'https://images.unsplash.com/photo-1622445262465-2481c4574875?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'An elegant, space-saving MagSafe wireless charging stand precision-machined from aerospace-grade aluminum. Charges your phone and earbuds simultaneously with up to 15W of rapid power. Designed with a micro-suction base for easy, one-handed detachment.',
    specs: {
      'Material': 'Anodized Aluminum, Premium Silicone',
      'Power Output': '15W Max (Phone) / 5W Max (Earbuds)',
      'Dimensions': '140mm x 90mm x 90mm',
      'Weight': '280g',
      'Origin': 'Imported (Premium Quality)'
    },
    featured: true,
    bestSeller: true,
    stock: 25,
    reviews: [
      { id: 'r1-1', name: 'Maxwell K.', rating: 5, date: '2026-06-15', comment: 'Absolutely stunning design. Weighted perfectly, and the magnetic connection is super secure. Looks incredibly premium on my desk!' },
      { id: 'r1-2', name: 'Sophia L.', rating: 4, date: '2026-05-20', comment: 'Very high quality aluminum finish. Charges my iPhone and AirPods quickly. Highly recommended.' }
    ]
  },
  {
    id: 'tech-2',
    name: 'Kallisto Retro Mechanical Keyboard',
    category: 'Tech Accessories',
    price: 129.00,
    rating: 4.9,
    reviewsCount: 86,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'A classic layout combined with modern mechanical tactile performance. Features hot-swappable brown switches, vintage double-shot keycaps, and customizable white backlighting. Connects via Bluetooth 5.1, 2.4Ghz wireless, or USB-C.',
    specs: {
      'Form Factor': '75% Layout (84 Keys)',
      'Switch Type': 'Gateron Brown (Tactile, Quiet)',
      'Connectivity': 'Bluetooth / 2.4Ghz / Wired USB-C',
      'Battery Life': 'Up to 200 hours (Backlight Off)',
      'Compatibility': 'macOS / Windows / iOS / Android'
    },
    featured: true,
    bestSeller: false,
    stock: 12,
    reviews: [
      { id: 'r2-1', name: 'David O.', rating: 5, date: '2026-06-02', comment: 'The typing feel is absolute bliss. The retro keycaps look incredible in person, and the battery life is outstanding.' },
      { id: 'r2-2', name: 'Amina B.', rating: 5, date: '2026-05-11', comment: 'Extremely robust build. Feels heavy and sturdy. Zero flex, and the tactile bump is perfectly crisp!' }
    ]
  },
  {
    id: 'tech-3',
    name: 'Nordic Felt Desk Mat (Large)',
    category: 'Tech Accessories',
    price: 35.00,
    rating: 4.6,
    reviewsCount: 210,
    images: [
      'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Elevate your workspace with a premium desk pad made of 100% genuine merino wool felt. Soft to the touch, noise-dampening, and naturally water-repellent, it provides a highly tactile surface for your keyboard, mouse, and stationery.',
    specs: {
      'Material': '100% Merino Wool Felt, Eco-leather back',
      'Dimensions': '900mm x 300mm x 4mm',
      'Care': 'Hand wash or spot clean only',
      'Feature': 'Anti-slip bottom, stitched anti-fray borders'
    },
    featured: false,
    bestSeller: true,
    stock: 40,
    reviews: [
      { id: 'r3-1', name: 'Oliver M.', rating: 5, date: '2026-07-01', comment: 'Transforms the entire look of the desk. My mouse glides beautifully and it adds a cozy premium warmth.' },
      { id: 'r3-2', name: 'Elena R.', rating: 4, date: '2026-06-18', comment: 'Soft and thick. A minor amount of shedding initially, but settled perfectly. Extremely stylish.' }
    ]
  },
  {
    id: 'tech-4',
    name: 'Vanguard Genuine Leather Laptop Sleeve',
    category: 'Tech Accessories',
    price: 75.00,
    rating: 4.7,
    reviewsCount: 64,
    images: [
      'https://images.unsplash.com/photo-1601524909162-be87252be298?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'A slim, tailored envelope sleeve constructed from vegetable-tanned Italian leather with a plush microfiber interior. Magnetic flap closure secures your device safely, while a rear utility pocket keeps documents and slim cables organized.',
    specs: {
      'Material': 'Italian Vegetable-Tanned Leather, Microfiber lining',
      'Device Compatibility': 'MacBook Pro/Air 13" - 14"',
      'Closure': 'Secure Magnetic Flap',
      'Pockets': '1 Exterior Document Pocket'
    },
    featured: false,
    bestSeller: false,
    stock: 15,
    reviews: [
      { id: 'r4-1', name: 'Christian G.', rating: 5, date: '2026-05-29', comment: 'The quality of the leather is unmatched. Smells incredible and is starting to develop a beautiful patina.' },
      { id: 'r4-2', name: 'Kylie P.', rating: 4, date: '2026-04-12', comment: 'Snug fit for my 14" laptop. Offers great scratch protection and fits inside my backpack perfectly.' }
    ]
  },
  {
    id: 'tech-5',
    name: 'Aura Pro Noise-Cancelling Earbuds',
    category: 'Tech Accessories',
    price: 159.00,
    rating: 4.8,
    reviewsCount: 142,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Immerse yourself in rich, studio-quality sound with active adaptive noise cancellation. Features high-fidelity drivers, dynamic spatial audio tracking, and a smart charging case that supports Qi wireless power. Built to stay comfortable all day.',
    specs: {
      'Driver Unit': '10mm Custom Dynamic Drivers',
      'Noise Cancellation': 'Active Hybrid ANC up to 40dB',
      'Water Resistance': 'IPX5 Sweat & Splash Proof',
      'Battery Life': '8h (Earbuds) + 24h (Charging Case)'
    },
    featured: true,
    bestSeller: true,
    stock: 18,
    reviews: [
      { id: 'r5-1', name: 'Marcus T.', rating: 5, date: '2026-07-03', comment: 'Mind-blowing base and pristine highs. The noise cancellation easily blocks out office chatter. Case feels solid.' },
      { id: 'r5-2', name: 'Isabella M.', rating: 4, date: '2026-06-21', comment: 'Very comfortable tips. I wear them for hours without any ear fatigue. Audio quality is spectacular.' }
    ]
  },
  {
    id: 'fashion-1',
    name: 'Chronos Heritage Chronograph Watch',
    category: 'Fashion Imports',
    price: 220.00,
    rating: 4.9,
    reviewsCount: 74,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'A timeless timepiece celebrating classic European watchmaking. Powered by a high-precision Japanese quartz movement housed in a surgical-grade stainless steel case. Features double-domed sapphire-coated mineral glass and a hand-stitched full-grain leather strap.',
    specs: {
      'Movement': 'Miyota Quartz Chronograph',
      'Case Diameter': '41mm',
      'Strap Width': '20mm',
      'Water Resistance': '5 ATM (50 Meters)',
      'Glass Type': 'Domed Sapphire-Coated Mineral'
    },
    featured: true,
    bestSeller: true,
    stock: 8,
    reviews: [
      { id: 'r6-1', name: 'Lucas S.', rating: 5, date: '2026-06-30', comment: 'Absolutely stunning watch. It punches far above its price tag. The strap is supple and comfortable from day one.' },
      { id: 'r6-2', name: 'Gifty A.', rating: 5, date: '2026-06-12', comment: 'Got this as a gift for my husband and he is in love. The packaging was also incredibly premium!' }
    ]
  },
  {
    id: 'fashion-2',
    name: 'Siena Polarized Vintage Sunglasses',
    category: 'Fashion Imports',
    price: 89.00,
    rating: 4.7,
    reviewsCount: 156,
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Inspired by Italian coastal architecture, the Siena features premium hand-polished cellulose acetate frames with robust double-barrel metal hinges. Fitted with Category 3 polarized lenses offering full UVA/UVB protection and exceptional clarity.',
    specs: {
      'Frame Material': 'Handcrafted Italian Cellulose Acetate',
      'Lens Type': '100% Polarized UVA/UVB Protection',
      'Fit': 'Medium/Large Unisex',
      'Includes': 'Leather Hard Case, Microfiber Cleaning Pouch'
    },
    featured: false,
    bestSeller: true,
    stock: 22,
    reviews: [
      { id: 'r7-1', name: 'Nii O.', rating: 5, date: '2026-07-02', comment: 'Outstanding polarization! Cuts down road glare perfectly. Lightweight but has a reassuring weight.' },
      { id: 'r7-2', name: 'Naomi D.', rating: 4, date: '2026-05-24', comment: 'Beautiful frames. The tortoiseshell pattern is gorgeous in direct sunlight. Fits comfortably on my nose bridge.' }
    ]
  },
  {
    id: 'fashion-3',
    name: 'Atelier Saffiano Leather Wallet',
    category: 'Fashion Imports',
    price: 65.00,
    rating: 4.8,
    reviewsCount: 98,
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1532501309852-c3ff012353f4?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'A minimalist bifold wallet engineered from cross-grain Saffiano leather, known for its extreme scratch, dirt, and water resistance. Sleek profile accommodates up to 8 cards and flat bills without adding unnecessary pocket bulk. Complete with advanced RFID-blocking shielding.',
    specs: {
      'Material': 'Genuine Saffiano Leather',
      'Capacity': '8 Card Slots, 1 Bill Section',
      'Dimensions': '110mm x 85mm x 12mm',
      'Security': 'Integrated RFID-blocking mesh'
    },
    featured: false,
    bestSeller: false,
    stock: 30,
    reviews: [
      { id: 'r8-1', name: 'Jonathan F.', rating: 5, date: '2026-06-22', comment: 'Sleek, minimalist, and tough. Saffiano leather really holds up to daily wear without a single scratch.' },
      { id: 'r8-2', name: 'Rachel Y.', rating: 4, date: '2026-06-05', comment: 'Beautiful construction. Card slots are snug but stretch to fit nicely over a few days.' }
    ]
  },
  {
    id: 'fashion-4',
    name: 'Nomad Waxed Canvas Rucksack',
    category: 'Fashion Imports',
    price: 110.00,
    rating: 4.5,
    reviewsCount: 88,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'A rugged yet refined backpack designed for daily commutes and weekend escapes alike. Crafted from heavy-duty water-resistant waxed cotton canvas, reinforced with thick full-grain leather straps and solid brass buckles. Inside, find a padded 15.6" laptop compartment and multiple utility pouches.',
    specs: {
      'Material': '20oz Waxed Cotton Canvas, Full-grain Cowhide Leather',
      'Capacity': '25 Liters',
      'Laptop Pocket': 'Padded sleeve up to 15.6" device',
      'Hardware': 'Solid Brass Buckles & Premium YKK zippers'
    },
    featured: true,
    bestSeller: false,
    stock: 9,
    reviews: [
      { id: 'r9-1', name: 'George K.', rating: 5, date: '2026-06-18', comment: 'Stunning craftsmanship. Extremely durable, handles rainfall easily. Holds a surprising amount of gear.' },
      { id: 'r9-2', name: 'Evelyn P.', rating: 4, date: '2026-05-14', comment: 'Lots of compliments on this bag. It is a bit heavy when empty, but the thick shoulder padding makes it comfortable.' }
    ]
  },
  {
    id: 'home-1',
    name: 'Aero Ultrasonic Humidifier & Diffuser',
    category: 'Home Goods',
    price: 55.00,
    rating: 4.8,
    reviewsCount: 192,
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519183071298-a2962feb14f4?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Create a calming sanctuary in your home. This minimalist ultrasonic device doubles as a fine-mist humidifier and essential oil diffuser. Features a handcrafted textured ceramic cover, a warm ambient light ring, and automatic low-water safety shut-off.',
    specs: {
      'Cover Material': 'Handcrafted Textured Ceramic',
      'Tank Capacity': '150ml (Up to 8 hours of mist)',
      'Coverage Area': 'Up to 300 sq ft',
      'Modes': 'Continuous (4h) / Intermittent (8h)',
      'Sound Level': 'Ultra-quiet (< 20dB)'
    },
    featured: true,
    bestSeller: true,
    stock: 14,
    reviews: [
      { id: 'r10-1', name: 'Clara W.', rating: 5, date: '2026-07-05', comment: 'The ceramic finish is beautiful, looks like a luxury sculpture! The light has a lovely warm candle-like glow.' },
      { id: 'r10-2', name: 'Abigail T.', rating: 4, date: '2026-06-12', comment: 'Very easy to fill and clean. Works perfectly with lavender oil for my bedtime routine.' }
    ]
  },
  {
    id: 'home-2',
    name: 'Kyoto Handcrafted Stone Ceramic Teaset',
    category: 'Home Goods',
    price: 135.00,
    rating: 4.9,
    reviewsCount: 42,
    images: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Immerse yourself in Zen dining. A traditional stoneware tea ceremony set, hand-glazed with organic earth minerals in Kyoto. Includes an insulated teapot with a sustainable bentwood handle and four matching low-profile tumblers.',
    specs: {
      'Material': 'Organic Mineral Stone Ceramic, Bentwood',
      'Set Includes': '1 Teapot (600ml), 4 Tea Tumblers (120ml)',
      'Glaze Type': 'Matte Charcoal & Specks (Unique per item)',
      'Care': 'Dishwasher safe (except wooden handle)'
    },
    featured: true,
    bestSeller: false,
    stock: 5,
    reviews: [
      { id: 'r11-1', name: 'Yuki H.', rating: 5, date: '2026-06-25', comment: 'True artisanal quality. The heat retention is exceptional, and each cup has a distinct, beautiful texture.' },
      { id: 'r11-2', name: 'Charles A.', rating: 5, date: '2026-05-30', comment: 'Incredibly aesthetic. Takes tea brewing to another level. Came secure in a beautiful wooden box.' }
    ]
  },
  {
    id: 'home-3',
    name: 'Halo Minimalist Ambient Table Lamp',
    category: 'Home Goods',
    price: 95.00,
    rating: 4.6,
    reviewsCount: 110,
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'An elegant brass and frosted glass orb lamp that glows with comfortable warmth. Touch-activated base offers three stages of dimming (Relax, Read, Task). Fully cordless with a rechargeable lithium battery, making it easy to carry anywhere.',
    specs: {
      'Material': 'Frosted Opal Glass, Brass-Finished Steel Base',
      'Battery': '4000mAh rechargeable (Up to 40h runtime)',
      'Brightness': '3 levels of warm dimming (2700K)',
      'Charging Port': 'USB-C (Cable included)'
    },
    featured: false,
    bestSeller: true,
    stock: 10,
    reviews: [
      { id: 'r12-1', name: 'Ekow A.', rating: 5, date: '2026-06-14', comment: 'Cordless aspect is a game changer. I carry it from my desk to my bedside. Beautiful high-quality glass glow.' },
      { id: 'r12-2', name: 'Mavis K.', rating: 4, date: '2026-05-20', comment: 'Very pleasant ambient lighting. Touch sensitivity is responsive. Solid steel base feels heavy and luxurious.' }
    ]
  },
  {
    id: 'home-4',
    name: 'Elysian Speckled Ceramic Coffee Mug',
    category: 'Home Goods',
    price: 24.00,
    rating: 4.7,
    reviewsCount: 312,
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'A cozy, chunky mug designed to sit perfectly in your hands. Hand-molded stoneware finished in a satin cream speckled glaze, featuring a raw sandy base for an elegant tactile contrast.',
    specs: {
      'Material': 'High-Fired Durable Stoneware',
      'Capacity': '350ml (12 oz)',
      'Finish': 'Satin Cream Speckle, Sandy Base',
      'Safety': 'Microwave and Dishwasher safe'
    },
    featured: false,
    bestSeller: false,
    stock: 45,
    reviews: [
      { id: 'r13-1', name: 'Daniel S.', rating: 5, date: '2026-07-06', comment: 'The raw bottom feel is spectacular. It holds temperature really well and makes morning brew a premium experience.' },
      { id: 'r13-2', name: 'Sarkodie F.', rating: 4, date: '2026-06-29', comment: 'Perfect handle size. Highly aesthetic speckled cream look.' }
    ]
  }
];
