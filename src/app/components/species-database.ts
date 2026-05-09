export interface SpeciesEntry {
  id: string;
  commonName: string;
  scientificName: string;
  family: string;
  type: "dragonfly" | "damselfly";
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  image: string;
  region: string;
  silhouette?: boolean;
}

export const SPECIES_DATABASE: SpeciesEntry[] = [
  { id: "blue-dasher", commonName: "Blue Dasher", scientificName: "Pachydiplax longipennis", family: "Libellulidae", type: "dragonfly", rarity: "common", image: "https://images.unsplash.com/photo-1698429563719-eae3a1b71857?w=400", region: "North America" },
  { id: "flame-skimmer", commonName: "Flame Skimmer", scientificName: "Libellula saturata", family: "Libellulidae", type: "dragonfly", rarity: "uncommon", image: "https://images.unsplash.com/photo-1668685837491-2fe9ebf196bd?w=400", region: "North America" },
  { id: "emperor-dragonfly", commonName: "Emperor Dragonfly", scientificName: "Anax imperator", family: "Aeshnidae", type: "dragonfly", rarity: "rare", image: "https://images.unsplash.com/photo-1618341925859-56aec690f3a2?w=400", region: "Europe" },
  { id: "wandering-glider", commonName: "Wandering Glider", scientificName: "Pantala flavescens", family: "Libellulidae", type: "dragonfly", rarity: "common", image: "https://images.unsplash.com/photo-1703609402747-a0eceaeba876?w=400", region: "Global" },
  { id: "golden-ringed", commonName: "Golden-ringed Dragonfly", scientificName: "Cordulegaster boltonii", family: "Cordulegastridae", type: "dragonfly", rarity: "epic", image: "", region: "Europe" },
  { id: "banded-demoiselle", commonName: "Banded Demoiselle", scientificName: "Calopteryx splendens", family: "Calopterygidae", type: "damselfly", rarity: "uncommon", image: "", region: "Europe" },
  { id: "azure-damselfly", commonName: "Azure Damselfly", scientificName: "Coenagrion puella", family: "Coenagrionidae", type: "damselfly", rarity: "common", image: "", region: "Europe" },
  { id: "common-darter", commonName: "Common Darter", scientificName: "Sympetrum striolatum", family: "Libellulidae", type: "dragonfly", rarity: "common", image: "", region: "Europe" },
  { id: "migrant-hawker", commonName: "Migrant Hawker", scientificName: "Aeshna mixta", family: "Aeshnidae", type: "dragonfly", rarity: "uncommon", image: "", region: "Europe" },
  { id: "scarlet-skimmer", commonName: "Scarlet Skimmer", scientificName: "Crocothemis erythraea", family: "Libellulidae", type: "dragonfly", rarity: "rare", image: "", region: "Africa" },
  { id: "helicopter-damsel", commonName: "Helicopter Damselfly", scientificName: "Megaloprepus caerulatus", family: "Pseudostigmatidae", type: "damselfly", rarity: "legendary", image: "", region: "Central America" },
  { id: "globe-skimmer", commonName: "Globe Skimmer", scientificName: "Pantala flavescens", family: "Libellulidae", type: "dragonfly", rarity: "common", image: "", region: "Global" },
  { id: "beautiful-demoiselle", commonName: "Beautiful Demoiselle", scientificName: "Calopteryx virgo", family: "Calopterygidae", type: "damselfly", rarity: "rare", image: "", region: "Europe" },
  { id: "green-darner", commonName: "Green Darner", scientificName: "Anax junius", family: "Aeshnidae", type: "dragonfly", rarity: "uncommon", image: "", region: "North America" },
  { id: "ebony-jewelwing", commonName: "Ebony Jewelwing", scientificName: "Calopteryx maculata", family: "Calopterygidae", type: "damselfly", rarity: "epic", image: "", region: "North America" },
  { id: "twelve-spotted", commonName: "Twelve-spotted Skimmer", scientificName: "Libellula pulchella", family: "Libellulidae", type: "dragonfly", rarity: "uncommon", image: "", region: "North America" },
];

export const RARITY_CONFIG = {
  common: { label: "Común", color: "#6b7280", bg: "bg-gray-500/20", border: "border-gray-500/30", text: "text-gray-400" },
  uncommon: { label: "Poco común", color: "#22c55e", bg: "bg-green-500/20", border: "border-green-500/30", text: "text-green-400" },
  rare: { label: "Rara", color: "#3b82f6", bg: "bg-blue-500/20", border: "border-blue-500/30", text: "text-blue-400" },
  epic: { label: "Épica", color: "#a855f7", bg: "bg-purple-500/20", border: "border-purple-500/30", text: "text-purple-400" },
  legendary: { label: "Legendaria", color: "#eab308", bg: "bg-yellow-500/20", border: "border-yellow-500/30", text: "text-yellow-400" },
};
