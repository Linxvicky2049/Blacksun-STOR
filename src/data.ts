import { Product } from './types';

export const products: Product[] = [
  {
    id: 'prod-042',
    entryNumber: 'Entry #042',
    title: 'Vortex Utility Vest',
    category: 'TECHNICAL UTILITY',
    price: 240,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTJRx6Gp9HpPykxjp_irlDp2aoz6CfWdwc4-2ugH1OZ2AHvlHmvw9r63ITIu-r8DG41swtpf2VGMakw0WGZG7f6ha_XnMCry0pVCSOttA7VSCHSuA4HlUmzt4KxZoy216dGH8fTERHYmrHGI5j-J1muQMs_5uKYGxQDGvZyE0q1LuiMPAGurJ3CrUMzhI2RArAZdRp0Yn1ZVlixtunfubhftiOZ1Nes_XEf9dMjT232DKKWxFMTq3qNqjTLxZHvY1mI8ccx2JWH_E',
    limited: true,
    soldOut: false,
    tag: 'LIMITED',
    description: 'High-end structural vest crafted with heavy-duty weather-resistant technical canvas, tactical modular hardware, and liquid chromatic piping.',
    details: [
      'Fabric weight: 420 GSM waterproof nylon-cotton blend',
      'Modular dynamic zip-off utility pockets',
      'Dual adjustable webbing compression harness straps',
      'Gold-plated architectural metal rivets with custom branding',
      'Internal magnetic mesh ventilation system'
    ],
    volumetricSizing: [
      { size: 'XS', shoulder: '42cm', chest: '102cm', length: '54cm' },
      { size: 'S', shoulder: '44cm', chest: '106cm', length: '56cm' },
      { size: 'M', shoulder: '46cm', chest: '110cm', length: '58cm' },
      { size: 'L', shoulder: '48cm', chest: '116cm', length: '60cm' },
      { size: 'XL', shoulder: '50cm', chest: '122cm', length: '62cm' }
    ]
  },
  {
    id: 'prod-043',
    entryNumber: 'Entry #043',
    title: 'Obsidian Hood',
    category: 'HEAVYWEIGHT DRAPE',
    price: 185,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbterMBAd6FiJ9_EqelbdYeUF013qm_QP-Mgjmv-iAeFDu9rkhkHxKe8mb50Xe9UulyGrr9IyYrNhYgM73PkGAPPcgr-2QY1Ycbjs5vGGs4DdkCvpTGXfB7Fgp0T-juBI8D7qdf-Loy4oTmSCJ_9xxQJComAOv31oZyQv70faDtKrit0G6UbZVZvaOo8VtaXIA02qbOI0d2w4KEvZ9Y2OS6-wh1Lug8OEJSgV89vvDRncTxcG9PRs-rNbdBUob1tmSDC-uMoEpPFM',
    limited: false,
    soldOut: false,
    tag: 'NEW DROP',
    description: 'Super-heavyweight loopback cotton hoodie focusing on an architectural slouch, oversized architectural hood coverage, and deep obsidian finish.',
    details: [
      'Fabric weight: 520 GSM ultra-heavy organic loopback cotton',
      'Oversized structural double-layered hood (no drawcords)',
      'Dropped shoulder design with volumetric sleeve tapering',
      'Minimalist invisible side-seam pockets',
      'Ribbed cuffs and dynamic hem bind'
    ],
    volumetricSizing: [
      { size: 'XS', shoulder: '58cm', chest: '124cm', length: '66cm' },
      { size: 'S', shoulder: '60cm', chest: '128cm', length: '68cm' },
      { size: 'M', shoulder: '62cm', chest: '132cm', length: '70cm' },
      { size: 'L', shoulder: '64cm', chest: '138cm', length: '72cm' },
      { size: 'XL', shoulder: '66cm', chest: '144cm', length: '74cm' }
    ]
  },
  {
    id: 'prod-044',
    entryNumber: 'Entry #044',
    title: 'Shadow Cargo P01',
    category: 'MODULAR FOOTWEAR-ACCENT',
    price: 310,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0ANIy54-rYcQllYgB4wNq7RYle18AuVjr9NM6lK_8s-OT12Bi4LZP153T2R9FDqGpHWqZYouifM1SQGj5oI-o7N_31zlP5GD8cqrhdk9ADQ8YjAQm4u2n2VdlYdyY_ra4jiFE0agmdonfL2J1rT7hmhRIjAKF5JQ9wTYbxUyv3XZdBbhw_0de6KA2jjO802Spgn9JeqPhcxJ2qCfkqEZV7kGpg0LyAWVP1DgJeb_Drc5-9n7Rtd8FLJb6R8YHHzHMSpGtNeOZNlg',
    limited: true,
    soldOut: false,
    tag: 'LIMITED',
    description: 'Ergonomic cargo pants featuring geometric articulative paneling, internal adjustable leg length toggle straps, and metallic gold thread accents.',
    details: [
      'Fabric weight: 320 GSM structural matte tech nylon ripstop',
      'Fully articulated knees for extreme volumetric movement',
      'Six-pocket layout with hidden key loops and internal compartmentalization',
      'Obsidian-coated custom zipper closures',
      'Elastic adjustable ankle drawcords for customized drape'
    ],
    volumetricSizing: [
      { size: 'XS', shoulder: 'N/A', chest: 'Waist: 70cm', length: 'Inseam: 76cm' },
      { size: 'S', shoulder: 'N/A', chest: 'Waist: 74cm', length: 'Inseam: 78cm' },
      { size: 'M', shoulder: 'N/A', chest: 'Waist: 78cm', length: 'Inseam: 80cm' },
      { size: 'L', shoulder: 'N/A', chest: 'Waist: 84cm', length: 'Inseam: 82cm' },
      { size: 'XL', shoulder: 'N/A', chest: 'Waist: 90cm', length: 'Inseam: 84cm' }
    ]
  },
  {
    id: 'prod-045',
    entryNumber: 'Entry #045',
    title: 'Liquid Fusion Anorak',
    category: 'LIGHTWEIGHT LAYER',
    price: 275,
    originalPrice: 320,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4bL-n4TpZQw5N_Fuyyv3CPj2SLRCZynJnano66_LuJZQMKvwChZjEp14PRG8vQX0UvK4P9UsaKAAOx4Udm06HwnaRbwGkUgkgko-5LYLf91YoIT7gTevbFVw_ohFm0ucPQVCWOyeEmVtaLoQy5kf6-6vOvjY9f1QzB-XCjAI4rSEnPjee-otYJwItm_jdeyqdEdwCM7HdSmp15PxCTGcLUIMtA4ImlCyP50UegAeZERI01KrUf3LEVkGXP3hNOI_K-HMWABiqIkY',
    limited: false,
    soldOut: true,
    tag: 'SOLD OUT',
    description: 'Sleek black technical jacket with metallic hardware and minimalist branding, high-key dramatic lighting on a dark background.',
    details: [
      'Fabric weight: 180 GSM highly-breathable windbreaker membrane',
      'Waterproof seam-sealed construction with 15k rating',
      'Prismatic multi-chromatic reflective back screenprint',
      'Custom liquid-feel polished gold dynamic toggles',
      'Full package self-packable into front structural pouch'
    ],
    volumetricSizing: [
      { size: 'XS', shoulder: '45cm', chest: '108cm', length: '68cm' },
      { size: 'S', shoulder: '47cm', chest: '112cm', length: '70cm' },
      { size: 'M', shoulder: '49cm', chest: '116cm', length: '72cm' },
      { size: 'L', shoulder: '51cm', chest: '122cm', length: '74cm' },
      { size: 'XL', shoulder: '53cm', chest: '128cm', length: '76cm' }
    ]
  },
  {
    id: 'prod-046',
    entryNumber: 'Entry #046',
    title: 'Visionary Portrait Hoodie',
    category: 'GRAPHIC DRAPE',
    price: 220,
    image: '/images/visionary_hoodie_1783344588623.jpg',
    limited: false,
    soldOut: false,
    tag: 'NEW DROP',
    description: 'Heavyweight loopback cotton hoodie printed with an ultra-high definition editorial portrait on a dark obsidian cotton canvas, emphasizing golden hour shadows.',
    details: [
      'Fabric weight: 500 GSM loopback cotton canvas',
      'High-definition digital screenprint with matte curing',
      'Oversized slouchy drape with dropped shoulder line',
      'Ribbed heavy hem and cuffs',
      'Signature BLACK SUN structural hardware detailing'
    ],
    volumetricSizing: [
      { size: 'XS', shoulder: '58cm', chest: '124cm', length: '66cm' },
      { size: 'S', shoulder: '60cm', chest: '128cm', length: '68cm' },
      { size: 'M', shoulder: '62cm', chest: '132cm', length: '70cm' },
      { size: 'L', shoulder: '64cm', chest: '138cm', length: '72cm' },
      { size: 'XL', shoulder: '66cm', chest: '144cm', length: '74cm' }
    ]
  },
  {
    id: 'prod-047',
    entryNumber: 'Entry #047',
    title: 'Prismatic Eclipse Hoodie',
    category: 'HEAVYWEIGHT CHROMATIC',
    price: 215,
    image: '/images/prismatic_hoodie_1783344604990.jpg',
    limited: false,
    soldOut: false,
    tag: 'NEW DROP',
    description: 'Premium loopback cotton hoodie boasting an all-over liquid chromatic swirl print with a deep void center, embodying the Obsidian Nebula theme.',
    details: [
      'Fabric weight: 520 GSM ultra-heavy organic cotton',
      'All-over high-fidelity liquid eclipse sublimation print',
      'Double-layered extra deep hood with structured shape',
      'Hidden side pockets built into seams',
      'Flexible, breathable, wind-resistant weave'
    ],
    volumetricSizing: [
      { size: 'XS', shoulder: '58cm', chest: '124cm', length: '66cm' },
      { size: 'S', shoulder: '60cm', chest: '128cm', length: '68cm' },
      { size: 'M', shoulder: '62cm', chest: '132cm', length: '70cm' },
      { size: 'L', shoulder: '64cm', chest: '138cm', length: '72cm' },
      { size: 'XL', shoulder: '66cm', chest: '144cm', length: '74cm' }
    ]
  },
  {
    id: 'prod-048',
    entryNumber: 'Entry #048',
    title: 'Sentinel Mascot Hoodie',
    category: 'GRAPHIC CHROMATIC',
    price: 210,
    image: '/images/sentinel_hoodie_1783344617640.jpg',
    limited: true,
    soldOut: false,
    tag: 'LIMITED',
    description: 'Super-heavyweight loopback cotton hoodie printed with the gold-chain Sentinel graphic, showcasing glowing high-contrast eyes and a bold BLACKSUN front emblem.',
    details: [
      'Fabric weight: 480 GSM heavy organic loopback fleece',
      'High-definition puff print elements for tactile relief',
      'Gold metallic foil chain detailing',
      'Minimalist kangaroo pouch front structure',
      'Ribbed cuffs with reinforced performance stitching'
    ],
    volumetricSizing: [
      { size: 'XS', shoulder: '58cm', chest: '124cm', length: '66cm' },
      { size: 'S', shoulder: '60cm', chest: '128cm', length: '68cm' },
      { size: 'M', shoulder: '62cm', chest: '132cm', length: '70cm' },
      { size: 'L', shoulder: '64cm', chest: '138cm', length: '72cm' },
      { size: 'XL', shoulder: '66cm', chest: '144cm', length: '74cm' }
    ]
  },
  {
    id: 'prod-049',
    entryNumber: 'Entry #049',
    title: 'Vortex Chromatic Joggers',
    category: 'VOLUMETRIC BOTTOMS',
    price: 195,
    image: '/images/vortex_joggers_1783344630255.jpg',
    limited: false,
    soldOut: false,
    tag: 'NEW DROP',
    description: 'Heavyweight organic cotton sweatpants featuring an ergonomic tapered drape, side invisible zip compartments, and a high-fidelity liquid fusion print across the leg.',
    details: [
      'Fabric weight: 450 GSM ultra-dense loopback fleece',
      'Symmetrical multi-chromatic eclipse side panel prints',
      'Elasticated waistband with high-tensile technical drawcords',
      'Waterproof concealed side zipper pockets',
      'Tapered ribbed cuffs for optimal sneaker drape'
    ],
    volumetricSizing: [
      { size: 'XS', shoulder: 'N/A', chest: 'Waist: 70cm', length: 'Inseam: 76cm' },
      { size: 'S', shoulder: 'N/A', chest: 'Waist: 74cm', length: 'Inseam: 78cm' },
      { size: 'M', shoulder: 'N/A', chest: 'Waist: 78cm', length: 'Inseam: 80cm' },
      { size: 'L', shoulder: 'N/A', chest: 'Waist: 84cm', length: 'Inseam: 82cm' },
      { size: 'XL', shoulder: 'N/A', chest: 'Waist: 90cm', length: 'Inseam: 84cm' }
    ]
  },
  {
    id: 'prod-050',
    entryNumber: 'Entry #050',
    title: 'Runic Cybernetic Hoodie',
    category: 'TECHNICAL UTILITY',
    price: 235,
    image: '/images/runic_hoodie_1783344642945.jpg',
    limited: true,
    soldOut: false,
    tag: 'LIMITED',
    description: 'An ergonomic technical fleece hoodie featuring glowing neon-green geometric runic matrices and a structural face-shield hood extension.',
    details: [
      'Fabric weight: 400 GSM technical polar-fleece composite',
      'Glow-in-the-dark high-contrast runic screenprint panels',
      'Integrated mesh face-shield and high collar',
      'Thumbhole performance cuffs for extreme utility',
      'Bungee-cord adjustable structural drawcords at hem'
    ],
    volumetricSizing: [
      { size: 'XS', shoulder: '58cm', chest: '124cm', length: '66cm' },
      { size: 'S', shoulder: '60cm', chest: '128cm', length: '68cm' },
      { size: 'M', shoulder: '62cm', chest: '132cm', length: '70cm' },
      { size: 'L', shoulder: '64cm', chest: '138cm', length: '72cm' },
      { size: 'XL', shoulder: '66cm', chest: '144cm', length: '74cm' }
    ]
  },
  {
    id: 'prod-051',
    entryNumber: 'Entry #051',
    title: 'Vortex Celestial Mug',
    category: 'CELESTIAL ACCESSORIES',
    price: 45,
    image: '/images/celestial_mug_1783344653923.jpg',
    limited: false,
    soldOut: false,
    tag: 'NEW DROP',
    description: 'An insulated matte-black ceramic vessel featuring a high-definition thermal-bonded liquid fusion print and custom wooden coaster alignment.',
    details: [
      'Material: Premium high-density double-walled ceramic',
      'Capacity: 450ml / 15oz volumetric space',
      'Thermal-reactive sub-surface prismatic print',
      'Includes branded dark-walnut alignment coaster',
      'Matte-obsidian textured exterior finish'
    ],
    volumetricSizing: [
      { size: 'O/S', shoulder: 'N/A', chest: 'Base: 8.5cm', length: 'Height: 10.5cm' }
    ]
  }
];
