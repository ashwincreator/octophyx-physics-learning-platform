import { drizzle } from "drizzle-orm/mysql2";
import { physicsTopics } from "./drizzle/schema.js";
import "dotenv/config";

const db = drizzle(process.env.DATABASE_URL);

const topics = [
  // Mechanics
  { name: "Newton's Laws of Motion", category: "mechanics", description: "The three fundamental laws describing the relationship between motion and forces", keywords: JSON.stringify(["force", "acceleration", "inertia", "action-reaction"]) },
  { name: "Projectile Motion", category: "mechanics", description: "Motion of objects thrown or projected into the air", keywords: JSON.stringify(["trajectory", "parabola", "range", "velocity"]) },
  { name: "Circular Motion", category: "mechanics", description: "Motion of objects moving in circular paths", keywords: JSON.stringify(["centripetal force", "angular velocity", "radius"]) },
  { name: "Conservation of Energy", category: "mechanics", description: "Energy cannot be created or destroyed, only transformed", keywords: JSON.stringify(["kinetic energy", "potential energy", "work"]) },
  { name: "Conservation of Momentum", category: "mechanics", description: "Total momentum in a closed system remains constant", keywords: JSON.stringify(["collision", "impulse", "momentum"]) },
  
  // Waves
  { name: "Wave Interference", category: "waves", description: "Superposition of waves creating constructive and destructive patterns", keywords: JSON.stringify(["superposition", "constructive", "destructive", "amplitude"]) },
  { name: "Standing Waves", category: "waves", description: "Waves that remain stationary in space", keywords: JSON.stringify(["nodes", "antinodes", "resonance", "harmonics"]) },
  { name: "Doppler Effect", category: "waves", description: "Change in frequency due to relative motion between source and observer", keywords: JSON.stringify(["frequency shift", "redshift", "blueshift"]) },
  { name: "Wave-Particle Duality", category: "waves", description: "Matter and light exhibit both wave and particle properties", keywords: JSON.stringify(["photon", "electron", "de Broglie"]) },
  
  // Electromagnetism
  { name: "Coulomb's Law", category: "electromagnetism", description: "Force between two charged particles", keywords: JSON.stringify(["electric force", "charge", "inverse square"]) },
  { name: "Electric Fields", category: "electromagnetism", description: "Region of space where electric forces act", keywords: JSON.stringify(["field lines", "potential", "voltage"]) },
  { name: "Magnetic Fields", category: "electromagnetism", description: "Region of space where magnetic forces act", keywords: JSON.stringify(["flux", "poles", "Lorentz force"]) },
  { name: "Electromagnetic Induction", category: "electromagnetism", description: "Generation of electric current from changing magnetic fields", keywords: JSON.stringify(["Faraday's law", "Lenz's law", "induced current"]) },
  { name: "Maxwell's Equations", category: "electromagnetism", description: "Four fundamental equations describing electromagnetism", keywords: JSON.stringify(["Gauss's law", "Ampere's law", "electromagnetic waves"]) },
  
  // Quantum Mechanics
  { name: "Quantum Tunneling", category: "quantum", description: "Particles passing through energy barriers", keywords: JSON.stringify(["barrier penetration", "wavefunction", "probability"]) },
  { name: "Heisenberg Uncertainty Principle", category: "quantum", description: "Fundamental limit on precision of simultaneous measurements", keywords: JSON.stringify(["position", "momentum", "uncertainty"]) },
  { name: "Schrödinger Equation", category: "quantum", description: "Fundamental equation describing quantum systems", keywords: JSON.stringify(["wavefunction", "eigenvalue", "quantum state"]) },
  { name: "Quantum Entanglement", category: "quantum", description: "Quantum correlation between particles", keywords: JSON.stringify(["Bell's theorem", "superposition", "measurement"]) },
  
  // Thermodynamics
  { name: "Laws of Thermodynamics", category: "thermodynamics", description: "Fundamental principles governing heat and energy", keywords: JSON.stringify(["entropy", "heat", "work", "temperature"]) },
  { name: "Heat Transfer", category: "thermodynamics", description: "Movement of thermal energy between systems", keywords: JSON.stringify(["conduction", "convection", "radiation"]) },
  { name: "Carnot Cycle", category: "thermodynamics", description: "Idealized thermodynamic cycle with maximum efficiency", keywords: JSON.stringify(["heat engine", "efficiency", "reversible"]) },
  
  // Optics
  { name: "Snell's Law", category: "optics", description: "Refraction of light at interfaces", keywords: JSON.stringify(["refraction", "index of refraction", "critical angle"]) },
  { name: "Diffraction", category: "optics", description: "Bending of waves around obstacles", keywords: JSON.stringify(["single slit", "double slit", "interference pattern"]) },
  { name: "Lens Equation", category: "optics", description: "Relationship between object and image distances in lenses", keywords: JSON.stringify(["focal length", "magnification", "image formation"]) },
  
  // Relativity
  { name: "Special Relativity", category: "relativity", description: "Physics at high velocities approaching speed of light", keywords: JSON.stringify(["time dilation", "length contraction", "Lorentz transformation"]) },
  { name: "General Relativity", category: "relativity", description: "Gravity as curvature of spacetime", keywords: JSON.stringify(["spacetime", "gravitational waves", "black holes"]) },
  { name: "E=mc²", category: "relativity", description: "Mass-energy equivalence", keywords: JSON.stringify(["energy", "mass", "speed of light"]) },
];

async function seed() {
  console.log("Seeding physics topics...");
  
  for (const topic of topics) {
    await db.insert(physicsTopics).values(topic).onDuplicateKeyUpdate({ set: { id: physicsTopics.id } });
  }
  
  console.log(`Seeded ${topics.length} physics topics successfully!`);
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
