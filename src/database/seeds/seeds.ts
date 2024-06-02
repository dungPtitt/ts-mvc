import { createUser } from './users';
import createDefaultPermission from './permissions';
import { createPost } from './post';
import createDefaultMenu from './menu';
// ts-node src/database/seeds/seeds.ts
// Chạy hàm createRandomUser
export const runSeed = async () => {
  await createDefaultPermission();
  // Seed admin user
  await createUser('admin');
  // // Seed editor user
  await createUser('editor');
  // await createPost();
  await createDefaultMenu()

}