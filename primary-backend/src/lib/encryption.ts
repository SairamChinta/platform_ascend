import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;
const PBKDF2_ITERATIONS = 100000;

const getEncryptionKey = () => {
  const secret = process.env.ENCRYPTION_SECRET;
  if (!secret) {
    throw new Error('ENCRYPTION_SECRET is not set in .env file');
  }
  return crypto.pbkdf2Sync(secret, 'salt-for-pbkdf2', PBKDF2_ITERATIONS, KEY_LENGTH, 'sha512');
};

export const encrypt = (text: string) => {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key as Uint8Array, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return Buffer.concat([iv, tag, encrypted]).toString('hex');
};

export const decrypt = (encryptedText: string) => {
  const key = getEncryptionKey();
  const data = Buffer.from(encryptedText, 'hex');

  const iv = data.subarray(0, IV_LENGTH);
  const tag = data.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
  const encrypted = data.subarray(IV_LENGTH + TAG_LENGTH);

  const decipher = crypto.createDecipheriv(ALGORITHM, key as Uint8Array, iv);
  decipher.setAuthTag(tag);

  return decipher.update(encrypted, undefined, 'utf8') + decipher.final('utf8');
};