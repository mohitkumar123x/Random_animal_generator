const fs = require('fs');

const content = {
  en: {
    badge: "Wildlife Knowledge Hub",
    title: "Random Animal Generator Blog",
    description: "Explore wildlife through infographics, data tables, and educational guides. Learn about conservation, animal classification, and the incredible diversity of life on Earth.",
    tocTitle: "Table of Contents",
    tocItems: [
      { text: "1. Complete Guide to Animal Conservation Status", anchor: "conservation-guide" },
      { text: "2. Animal Kingdom Classification Chart", anchor: "classification-chart" },
      { text: "3. Animal Categories Breakdown with Data", anchor: "category-breakdown" },
      { text: "4. Global Animal Habitat Distribution", anchor: "habitat-map" },
      { text: "5. Endangered Species Decision Flowchart", anchor: "endangered-flowchart" },
      { text: "6. Animal Record Holders Table", anchor: "record-holders" },
      { text: "7. How the Random Animal Generator Works", anchor: "generator-workflow" },
      { text: "8. Mind-Blowing Animal Facts Grid", anchor: "fun-facts-grid" },
      { text: "9. Using Random Animal Generators in Education", anchor: "education-guide" },
      { text: "10. Extinct Animals Timeline", anchor: "extinction-timeline" }
    ],
    conservationGuide: {
      title: "Complete Guide to Animal Conservation Status",
      desc: "The International Union for Conservation of Nature (IUCN) Red List is the world's most comprehensive inventory of species' conservation status. Our random animal generator includes animals across all IUCN categories, helping users learn about wildlife preservation while discovering new species.",
      headers: ["Status Code", "Full Name", "Definition", "Animals in DB"],
      statuses: [
        { code: "LC", name: "Least Concern", desc: "Widespread and abundant species with stable populations", color: "conservation-lc" },
        { code: "NT", name: "Near Threatened", desc: "Species likely to become threatened in the near future", color: "conservation-nt" },
        { code: "VU", name: "Vulnerable", desc: "Species facing a high risk of extinction in the wild", color: "conservation-vu" },
        { code: "EN", name: "Endangered", desc: "Species facing a very high risk of extinction in the wild", color: "conservation-en" },
        { code: "CR", name: "Critically Endangered", desc: "Species facing an extremely high risk of extinction", color: "conservation-cr" },
        { code: "EW", name: "Extinct in the Wild", desc: "Known only to survive in captivity or cultivation", color: "gray-400" },
        { code: "EX", name: "Extinct", desc: "No reasonable doubt that the last individual has died", color: "gray-500" }
      ],
      chartTitle: "Conservation Status Distribution"
    },
    classification: {
      title: "Animal Kingdom Classification Chart",
      desc: "The biological classification system organizes all living organisms into a hierarchical structure. Our random animal generator uses this taxonomy to categorize species, providing class, order, and family information for each animal in the database.",
      chartTitle: "Taxonomic Classification of Animals",
      levels: [
        { type: "node", label: "Kingdom", value: "Animalia", color: "link" },
        { type: "node", label: "Phylum", value: "Chordata, Arthropoda, Mollusca, etc.", color: "violet" },
        { type: "row", label: "Class", items: [
          { emoji: "🦁", name: "Mammalia", desc: "Mammals" },
          { emoji: "🦅", name: "Aves", desc: "Birds" },
          { emoji: "🐊", name: "Reptilia", desc: "Reptiles" },
          { emoji: "🐸", name: "Amphibia", desc: "Amphibians" },
          { emoji: "🐟", name: "Actinopterygii", desc: "Bony Fish" },
          { emoji: "🦈", name: "Chondrichthyes", desc: "Cartilaginous Fish" },
          { emoji: "🐙", name: "Insecta", desc: "Insects" },
          { emoji: "🐋", name: "Mammalia", desc: "Cetaceans" }
        ]},
        { type: "node", label: "Order", value: "Carnivora, Primates, Rodentia, etc.", color: "pink" },
        { type: "node", label: "Family", value: "Felidae, Canidae, Ursidae, etc.", color: "conservation-lc" },
        { type: "node", label: "Genus", value: "Panthera, Canis, etc.", color: "conservation-nt" },
        { type: "node", label: "Species", value: "P. leo, C. lupus, etc.", color: "conservation-vu" }
      ]
    },
    categories: {
      title: "Animal Categories Breakdown",
      desc: "Our random animal generator covers {totalAnimals}+ animals across {categoriesCount} major categories. Each category represents a distinct group of animals with unique characteristics, habitats, and adaptations. Here is a detailed breakdown of our database.",
      label: "animals",
      items: [
        { key: "Mammal", label: "Mammal", icon: "🦁", desc: "Warm-blooded, hair/fur, milk-producing" },
        { key: "Bird", label: "Bird", icon: "🦅", desc: "Feathered, warm-blooded, egg-laying" },
        { key: "Fish", label: "Fish", icon: "🐟", desc: "Aquatic, gills, cold-blooded" },
        { key: "Reptile", label: "Reptile", icon: "🐊", desc: "Scaled, cold-blooded, egg-laying" },
        { key: "Amphibian", label: "Amphibian", icon: "🐸", desc: "Moist skin, dual life, cold-blooded" },
        { key: "Insect", label: "Insect", icon: "🦋", desc: "Exoskeleton, six legs, wings" },
        { key: "Marine", label: "Marine", icon: "🐙", desc: "Ocean-dwelling, diverse species" },
        { key: "Extinct", label: "Extinct", icon: "🦤", desc: "No longer living, historical records" }
      ]
    },
    habitatDistribution: {
      title: "Global Animal Habitat Distribution",
      desc: "Animals have adapted to virtually every environment on Earth. Our random animal generator database includes species from diverse habitats, each presenting unique challenges and evolutionary adaptations.",
      headers: ["Habitat Type", "Climate", "Key Adaptations", "Example Species"],
      rows: [
        { emoji: "🌲", type: "Tropical Forest", climate: "Hot, humid, rainy", adaptations: "Camouflage, canopy climbing, bright colors", species: "Toucan, Jaguar, Poison Dart Frog" },
        { emoji: "🏔️", type: "Mountain", climate: "Cold, low oxygen", adaptations: "Thick fur, large lungs, strong claws", species: "Snow Leopard, Mountain Goat, Golden Eagle" },
        { emoji: "🌊", type: "Ocean", climate: "Saltwater, deep pressure", adaptations: "Streamlined body, sonar, bioluminescence", species: "Blue Whale, Octopus, Great White Shark" },
        { emoji: "🏜️", type: "Desert", climate: "Extreme heat, arid", adaptations: "Water conservation, burrowing, nocturnal", species: "Camel, Fennec Fox, Thorny Devil" },
        { emoji: "🧊", type: "Arctic", climate: "Freezing, seasonal darkness", adaptations: "Blubber, white camouflage, hibernation", species: "Polar Bear, Arctic Fox, Snowy Owl" },
        { emoji: "🌿", type: "Grassland", climate: "Moderate rain, open plains", adaptations: "Speed, herding, camouflage", species: "Zebra, Cheetah, African Elephant" },
        { emoji: "🌿", type: "Freshwater", climate: "Lakes, rivers, ponds", adaptations: "Gills, fins, camouflage", species: "Nile Crocodile, Piranha, Axolotl" }
      ]
    },
    endangeredFlowchart: {
      title: "Endangered Species Decision Flowchart",
      desc: "Understanding how species become endangered involves a complex interplay of factors. This flowchart illustrates the main threats that push species toward extinction and the conservation actions that can help reverse their decline.",
      chartTitle: "Threats to Wildlife & Conservation Actions",
      rootCause: "Human Activity",
      threats: [
        { emoji: "🏗️", title: "Habitat Loss", desc: "Deforestation, urbanization" },
        { emoji: "🎯", title: "Overexploitation", desc: "Hunting, poaching, fishing" },
        { emoji: "🌡️", title: "Climate Change", desc: "Temperature shifts, sea level" },
        { emoji: "🦠", title: "Pollution & Disease", desc: "Pesticides, invasive species" }
      ],
      impact: { title: "Population Decline", desc: "Reduced numbers, genetic diversity loss" },
      assessment: { title: "IUCN Red List Assessment", desc: "Scientists evaluate extinction risk" },
      actions: [
        { emoji: "🏞️", title: "Protected Areas", desc: "National parks, reserves" },
        { emoji: "🔬", title: "Research & Monitoring", desc: "Tracking, population studies" },
        { emoji: "📜", title: "Legal Protection", desc: "Hunting bans, trade laws" },
        { emoji: "🌱", title: "Habitat Restoration", desc: "Reforestation, cleanup" }
      ],
      outcome: { title: "Species Recovery", desc: "Population stabilization & growth" }
    },
    recordHolders: {
      title: "Animal Record Holders",
      desc: "The animal kingdom is full of extremes. From the fastest land animal to the largest creature ever to live, these record holders showcase the incredible diversity of life on Earth.",
      headers: ["Record", "Animal", "Measurement", "Fun Fact"],
      records: [
        { emoji: "🏃", record: "Fastest Land Animal", animal: "Cheetah", measurement: "112 km/h (70 mph)", fact: "Can accelerate from 0 to 100 km/h in 3 seconds" },
        { emoji: "🐋", record: "Largest Animal Ever", animal: "Blue Whale", measurement: "30 m (98 ft) length", fact: "Heart is the size of a small car" },
        { emoji: "🦅", record: "Fastest Bird (Dive)", animal: "Peregrine Falcon", measurement: "389 km/h (242 mph)", fact: "Folds wings to achieve maximum speed" },
        { emoji: "🐢", record: "Longest Living", animal: "Galápagos Tortoise", measurement: "175+ years", fact: "Jonathan, a Seychelles tortoise, lived to 190" },
        { emoji: "🐧", record: "Deepest Diver", animal: "Emperor Penguin", measurement: "565 m (1,854 ft)", fact: "Holds breath for over 20 minutes" },
        { emoji: "🐘", record: "Largest Land Animal", animal: "African Elephant", measurement: "6,000 kg (13,200 lbs)", fact: "Can detect water sources 12 miles away" },
        { emoji: "🧠", record: "Smallest Mammal", animal: "Bumblebee Bat", measurement: "2 g (0.07 oz)", fact: "Fits on a human thumbnail" }
      ]
    },
    workflow: {
      title: "How the Random Animal Generator Works",
      desc: "Our random animal generator uses a sophisticated algorithm to provide fair, unbiased selections from our database of {totalAnimals} animals. Here is the step-by-step workflow behind each generation.",
      chartTitle: "Generation Process Flowchart",
      steps: [
        { label: "Step 1", title: "User Clicks Generate", desc: "Button press, Spacebar, or mobile FAB", color: "link" },
        { label: "Step 2", title: "Apply Filters", desc: "Category + Conservation status filters", color: "violet" },
        { label: "Step 3", title: "No Repeat Check", desc: "Remove previously shown animals if enabled", color: "pink" },
        { label: "Step 4", title: "Random Selection", desc: "Math.random() picks from filtered pool", color: "conservation-lc" },
        { label: "Step 5", title: "Animation & Display", desc: "Emoji shuffle, progress bar, card reveal", color: "conservation-nt" },
        { label: "Step 6", title: "Animal Card Rendered", desc: "Full details with emoji, stats, facts", color: "conservation-vu" }
      ]
    },
    funFacts: {
      title: "Mind-Blowing Animal Facts",
      desc: "Our random animal generator is packed with fascinating facts about every species. Here are some of the most surprising facts from our database of {totalAnimals} animals.",
      items: [
        { emoji: "🐙", title: "Three Hearts", text: "Octopuses have three hearts. Two pump blood to the gills, while the third pumps it to the rest of the body." },
        { emoji: "🐘", title: "Cant Jump", text: "Elephants are the only mammals that cannot jump. Their legs are designed for weight support, not jumping." },
        { emoji: "🦩", title: "Flamboyance", text: 'A group of flamingos is called a "flamboyance." They get their pink color from eating shrimp and algae.' },
        { emoji: "🦈", title: "Older Than Trees", text: "Sharks have existed for over 400 million years — that is 200 million years before trees appeared on Earth." },
        { emoji: "🐊", title: "Tears", text: "Crocodiles appear to cry while eating, but these are actually lubricating tears produced by glands near their eyes." },
        { emoji: "🐳", title: "Blue Heart", text: "A blue whale's heart weighs about 400 pounds (180 kg) and beats roughly once every 10 seconds." },
        { emoji: "🦔", title: "Immune to Venom", text: "Hedgehogs are immune to many venoms, including adder venom. They can even eat poisonous snakes." },
        { emoji: "🐦", title: "No Teeth", text: "Birds have no teeth. Instead, they swallow stones that grind food in their gizzard, acting as a replacement." },
        { emoji: "🐢", title: "Breathing", text: "Turtles can breathe through their rear end. This adaptation helps them survive during long hibernations underwater." }
      ]
    },
    education: {
      title: "Using Random Animal Generators in Education",
      desc: "Random animal generators have become powerful educational tools for teachers, parents, and students. They make learning about wildlife interactive and engaging while covering key biology concepts.",
      headers: ["Activity", "Subject", "Age Group", "Learning Outcome"],
      rows: [
        { activity: "Daily Animal Card", subject: "Biology, Geography", age: "6-12 years", outcome: "Animal identification, habitat awareness" },
        { activity: "Drawing Challenge", subject: "Art, Biology", age: "8-16 years", outcome: "Observation skills, anatomy understanding" },
        { activity: "Conservation Debate", subject: "Environmental Science", age: "12-18 years", outcome: "Critical thinking, environmental awareness" },
        { activity: "Creative Writing", subject: "Language Arts", age: "All ages", outcome: "Storytelling, vocabulary building" },
        { activity: "Animal Quiz Game", subject: "Biology, General Knowledge", age: "All ages", outcome: "Memory, recall, fun learning" }
      ]
    },
    timeline: {
      title: "Extinct Animals Timeline",
      desc: "Extinction is a natural part of evolution, but human activity has accelerated the process dramatically. Our random animal generator includes {extinctCount} extinct species to help educate users about the importance of conservation.",
      items: [
        { year: "1681", animal: "🦤 Dodo", event: "Last dodo killed on Mauritius due to hunting and invasive species" },
        { year: "1768", animal: "🐦 Steller's Sea Cow", event: "Hunted to extinction within 27 years of its discovery" },
        { year: "1883", animal: "🦓 Quagga", event: "Last quagga died in Amsterdam Zoo; only 1,000 bones remain" },
        { year: "1914", animal: "🕊️ Passenger Pigeon", event: "Martha, the last passenger pigeon, died at Cincinnati Zoo" },
        { year: "1936", animal: "🐯 Tasmanian Tiger", event: "Last thylacine died at Hobart Zoo; now extinct for nearly a century" },
        { year: "2011", animal: "🦏 Western Black Rhino", event: "Declared extinct; last seen in Cameroon in 2006" }
      ]
    },
    cta: {
      title: "Start Discovering Animals",
      desc: "Generate random animals with pictures, fun facts, and conservation status. Free and instant.",
      btn: "🎲 Try the Random Animal Generator"
    },
    stats: {
      animals: "Animals",
      categories: "Categories",
      conservationLevels: "Conservation Levels",
      free: "Free"
    }
  }
};

fs.writeFileSync("src/data/blog-content.json", JSON.stringify(content, null, 2), "utf8");
console.log("Written successfully");
const j = JSON.parse(fs.readFileSync("src/data/blog-content.json", "utf8"));
console.log("Keys:", Object.keys(j));
console.log("Valid JSON: yes");
