export interface DragonflySpecies {
  id: string;
  commonName: string;
  scientificName: string;
  family: string;
  confidence: number;
  image: string;
  description: string;
  identificationReasoning: string;
  heatMapFeatures: HeatMapFeature[];
  facts: string[];
  habitat: {
    description: string;
    regions: string[];
    mapPoints: { lat: number; lng: number; label: string }[];
    image: string;
  };
  conservation: string;
  wingspan: string;
  bodyLength: string;
  lifespan: string;
  diet: string;
}

export interface HeatMapFeature {
  id: string;
  label: string;
  bodyPart: string;
  description: string;
  confidence: number;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const DRAGONFLY_SPECIES: DragonflySpecies[] = [
  {
    id: "blue-dasher",
    commonName: "Blue Dasher",
    scientificName: "Pachydiplax longipennis",
    family: "Libellulidae (Skimmers)",
    confidence: 94.7,
    image:
      "https://images.unsplash.com/photo-1698429563719-eae3a1b71857?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmFnb25mbHklMjBibHVlJTIwcG9uZHxlbnwxfHx8fDE3NzMzODYwMjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description:
      "The Blue Dasher is one of the most common dragonflies in North America. Males are easily recognized by their powdery blue abdomen and striking green eyes. They are agile fliers often seen darting over ponds and marshes.",
    identificationReasoning:
      "The AI model identified this specimen as a Blue Dasher (Pachydiplax longipennis) with 94.7% confidence based on several key morphological features. The distinctive powdery blue pruinescence covering the abdomen is a hallmark of mature males of this species. The bright metallic green compound eyes, combined with the amber-tinted wing bases and the characteristic white face (frons), strongly differentiate this from similar Libellulidae species. The body proportions — a relatively short, stocky abdomen compared to wing length — are consistent with the Pachydiplax genus.",
    heatMapFeatures: [
      {
        id: "abdomen-color",
        label: "Blue Pruinescent Abdomen",
        bodyPart: "Abdomen",
        description:
          "The chalky blue coating on the abdomen is a key identifier for mature male Blue Dashers. This pruinescence develops as males age and is absent in females and juveniles.",
        confidence: 97,
        color: "#3B82F6",
        x: 50,
        y: 55,
        width: 35,
        height: 18,
      },
      {
        id: "eye-color",
        label: "Metallic Green Eyes",
        bodyPart: "Head",
        description:
          "The bright, jewel-like green compound eyes are distinctive. Unlike the Eastern Pondhawk which has similar coloring, the Blue Dasher's eyes are a brighter emerald green.",
        confidence: 92,
        color: "#10B981",
        x: 12,
        y: 35,
        width: 14,
        height: 14,
      },
      {
        id: "wing-base",
        label: "Amber Wing Bases",
        bodyPart: "Wings",
        description:
          "Small amber patches at the base of the hindwings help distinguish this species from other blue-bodied skimmers. The wing venation pattern is also characteristic.",
        confidence: 88,
        color: "#F59E0B",
        x: 28,
        y: 18,
        width: 40,
        height: 22,
      },
      {
        id: "thorax-pattern",
        label: "Striped Thorax",
        bodyPart: "Thorax",
        description:
          "The thorax shows distinctive pale lateral stripes on a darker background. This pattern helps separate Blue Dashers from Familiar Bluets and other blue dragonflies.",
        confidence: 85,
        color: "#8B5CF6",
        x: 25,
        y: 40,
        width: 16,
        height: 20,
      },
    ],
    facts: [
      "Blue Dashers can eat hundreds of mosquitoes in a single day, making them invaluable for natural pest control.",
      "They are one of the few dragonfly species where males perform a wing-threat display, raising their wings to warn rivals.",
      "Their compound eyes contain approximately 30,000 individual facets, giving them nearly 360-degree vision.",
      "Blue Dashers can fly at speeds up to 25 mph and can hover, fly backwards, and change direction instantly.",
      "The blue color on males isn't pigment — it's a waxy substance called pruinescence that develops as they mature.",
      "Females lay eggs by repeatedly dipping their abdomen into water while the male guards from above.",
    ],
    habitat: {
      description:
        "Blue Dashers thrive in still or slow-moving freshwater habitats including ponds, lakes, marshes, and slow streams. They prefer areas with emergent vegetation for perching and warm, sunny conditions.",
      regions: [
        "Eastern & Central North America",
        "Southern Canada",
        "Mexico",
        "Caribbean Islands",
      ],
      mapPoints: [
        { lat: 38.9, lng: -77.0, label: "Eastern US (Dense)" },
        { lat: 32.7, lng: -96.8, label: "Texas (Common)" },
        { lat: 43.6, lng: -79.4, label: "Southern Ontario" },
        { lat: 25.8, lng: -80.2, label: "Florida (Year-round)" },
        { lat: 19.4, lng: -99.1, label: "Central Mexico" },
      ],
      image:
        "https://images.unsplash.com/photo-1696346299837-d3d57b56a5f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZXRsYW5kJTIwbWFyc2glMjBoYWJpdGF0fGVufDF8fHx8MTc3MzM4NjAyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    conservation: "Least Concern — Population stable across range",
    wingspan: "2.5 – 3.0 inches (64 – 76 mm)",
    bodyLength: "1.0 – 1.7 inches (25 – 43 mm)",
    lifespan: "5 – 6 months as adult; up to 2 years including larval stage",
    diet: "Mosquitoes, gnats, midges, small moths, and other flying insects",
  },
  {
    id: "flame-skimmer",
    commonName: "Flame Skimmer",
    scientificName: "Libellula saturata",
    family: "Libellulidae (Skimmers)",
    confidence: 91.2,
    image:
      "https://images.unsplash.com/photo-1668685837491-2fe9ebf196bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmFnb25mbHklMjByZWQlMjBwZXJjaGVkfGVufDF8fHx8MTc3MzM4NjAyNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description:
      "The Flame Skimmer is a stunning dragonfly known for its brilliant orange-red coloration. Males are entirely fiery red-orange, including their wings, making them one of the most visually striking dragonflies in western North America.",
    identificationReasoning:
      "The AI model identified this as a Flame Skimmer (Libellula saturata) with 91.2% confidence. The uniformly bright red-orange coloration across the entire body and wings is the most distinguishing feature. Unlike the similar Neon Skimmer (L. croceipennis), the Flame Skimmer has broader orange coloring through the wing membranes extending past the nodus. The robust body shape, large size, and the characteristic perching behavior with wings held forward are all consistent with this species.",
    heatMapFeatures: [
      {
        id: "body-color",
        label: "Flame-Red Body",
        bodyPart: "Abdomen & Thorax",
        description:
          "The uniformly bright red-orange coloration across the entire body is the most distinctive trait. This saturated color gives the species its name 'saturata'.",
        confidence: 95,
        color: "#EF4444",
        x: 30,
        y: 42,
        width: 50,
        height: 20,
      },
      {
        id: "wing-color",
        label: "Orange-Tinted Wings",
        bodyPart: "Wings",
        description:
          "Unlike most dragonflies, Flame Skimmers have broad orange coloring through most of the wing membrane, not just at the base. This extends well past the nodus.",
        confidence: 93,
        color: "#F97316",
        x: 15,
        y: 12,
        width: 55,
        height: 28,
      },
      {
        id: "face",
        label: "Red Face & Eyes",
        bodyPart: "Head",
        description:
          "The reddish-brown compound eyes and red face distinguish this from the Neon Skimmer which has a paler face.",
        confidence: 86,
        color: "#DC2626",
        x: 10,
        y: 32,
        width: 12,
        height: 16,
      },
      {
        id: "leg-color",
        label: "Red-Orange Legs",
        bodyPart: "Legs",
        description:
          "Even the legs show the characteristic red-orange coloring, which is unusual among dragonflies and helps confirm this species.",
        confidence: 82,
        color: "#FB923C",
        x: 28,
        y: 62,
        width: 20,
        height: 12,
      },
    ],
    facts: [
      "Flame Skimmers are attracted to hot springs and thermal pools, tolerating water temperatures that would deter most other dragonflies.",
      "They are one of the few dragonfly species commonly found in urban environments, especially near swimming pools.",
      "Males are fiercely territorial and will chase away any intruder — even birds — from their chosen perch.",
      "Their larvae can survive in very warm water, up to 113°F (45°C), unlike most dragonfly species.",
      "The red coloration intensifies with age; young adults start out more yellowish-orange.",
      "They are important pollinators — while hunting near flowers, they inadvertently transfer pollen.",
    ],
    habitat: {
      description:
        "Flame Skimmers prefer warm, sunny areas near still or slow-moving water. They are uniquely adapted to arid environments and are commonly found near hot springs, pools, and desert oases.",
      regions: [
        "Western United States",
        "Northern Mexico",
        "Hawaiian Islands (introduced)",
      ],
      mapPoints: [
        { lat: 34.0, lng: -118.2, label: "Southern California (Dense)" },
        { lat: 33.4, lng: -112.0, label: "Arizona (Very Common)" },
        { lat: 36.1, lng: -115.2, label: "Nevada" },
        { lat: 35.1, lng: -106.6, label: "New Mexico" },
        { lat: 21.3, lng: -157.8, label: "Hawaii (Introduced)" },
      ],
      image:
        "https://images.unsplash.com/photo-1696346299837-d3d57b56a5f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZXRsYW5kJTIwbWFyc2glMjBoYWJpdGF0fGVufDF8fHx8MTc3MzM4NjAyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    conservation: "Least Concern — Adaptable to urban environments",
    wingspan: "3.0 – 3.5 inches (76 – 89 mm)",
    bodyLength: "2.0 – 2.4 inches (51 – 61 mm)",
    lifespan: "4 – 8 months as adult",
    diet: "Mosquitoes, flies, small butterflies, and other flying insects",
  },
];
