import db from "../models"; // your Sequelize connection
const { County } = db;

const irishCounties = [
  "Carlow","Cavan","Clare","Cork","Donegal","Dublin","Galway","Kerry",
  "Kildare","Kilkenny","Laois","Leitrim","Limerick","Longford","Louth",
  "Mayo","Meath","Monaghan","Offaly","Roscommon","Sligo","Tipperary",
  "Waterford","Westmeath","Wexford","Wicklow"
];

async function seedCounties() {
  try {
    for (const name of irishCounties) {
      await County.findOrCreate({ where: { countyName: name } });
    }
    console.log("Irish counties seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding counties:", err);
    process.exit(1);
  }
}

seedCounties();