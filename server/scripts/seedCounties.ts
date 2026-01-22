// ----------------------------------------------
// County Seed Script
// ----------------------------------------------
//
// This script populates the database with a fixed
// list of Irish counties.
//
// Intended use cases:
// - Initial project setup
// - Fresh database reset
// - CI / development environment bootstrapping
//
// Safe to run multiple times thanks to `findOrCreate`.

import db from "../models"; // Sequelize models entry point
const { County } = db;

// ----------------------------------------------
// Static reference data
// ----------------------------------------------
// List of all Irish counties
// ----------------------------------------------

const irishCounties = [
  "Carlow",
  "Cavan",
  "Clare",
  "Cork",
  "Donegal",
  "Dublin",
  "Galway",
  "Kerry",
  "Kildare",
  "Kilkenny",
  "Laois",
  "Leitrim",
  "Limerick",
  "Longford",
  "Louth",
  "Mayo",
  "Meath",
  "Monaghan",
  "Offaly",
  "Roscommon",
  "Sligo",
  "Tipperary",
  "Waterford",
  "Westmeath",
  "Wexford",
  "Wicklow",
];

// ----------------------------------------------
// Seed function
// ----------------------------------------------
// Iterates through the county list and ensures each
// county exists in the database.
//
// `findOrCreate` prevents duplicates and makes the
// script idempotent (safe to re-run).
// ----------------------------------------------

async function seedCounties() {
  try {
    for (const name of irishCounties) {
      await County.findOrCreate({ where: { countyName: name } });
    }
    console.log("Irish counties seeded successfully!");
    process.exit(0); // Exit cleanly
  } catch (err) {
    console.error("Error seeding counties:", err);
    process.exit(1); // Exit with failure code
  }
}

// ----------------------------------------------
// Script execution
// ----------------------------------------------
// Immediately invoke the seed function when this
// file is run via Node.
// ----------------------------------------------

seedCounties();
