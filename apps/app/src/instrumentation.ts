import { db } from "./server/db";

export async function register() {
  await initializeMockOccEvent();
}

export async function initializeMockOccEvent() {
  const id = 99_999;
  const name = "Demo OCC Event";

  await db.occTemplate.upsert({
    where: {
      id,
    },
    create: {
      id,
      name,
    },
    update: {},
  });

  console.log(`🌲 ${name} applied`);
}
