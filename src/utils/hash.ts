import * as bcrypt from 'bcrypt';

export async function hashValue(value: string) {
  const saltOrRounds = 10;
  return await bcrypt.hash(value, saltOrRounds);
}

export async function compareHash(value: string, hash: string) {
  return await bcrypt.compare(value, hash);
}
