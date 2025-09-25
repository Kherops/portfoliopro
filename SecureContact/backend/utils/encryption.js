const crypto = require('crypto');

// Encryption configuration
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // For GCM, this is always 16
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;

/**
 * Derives a key from password using PBKDF2
 * @param {string} password - The password to derive key from
 * @param {Buffer} salt - The salt for key derivation
 * @returns {Buffer} - The derived key
 */
const deriveKey = (password, salt) => {
  return crypto.pbkdf2Sync(password, salt, 100000, KEY_LENGTH, 'sha512');
};

/**
 * Encrypts text using AES-256-GCM
 * @param {string} text - Text to encrypt
 * @param {string} password - Password for encryption
 * @returns {string} - Base64 encoded encrypted data
 */
const encrypt = (text, password) => {
  try {
    // Generate random salt and IV
    const salt = crypto.randomBytes(SALT_LENGTH);
    const iv = crypto.randomBytes(IV_LENGTH);
    
    // Derive key from password
    const key = deriveKey(password, salt);
    
    // Create cipher
    const cipher = crypto.createCipher(ALGORITHM, key);
    cipher.setAAD(salt); // Additional authenticated data
    
    // Encrypt the text
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Get the authentication tag
    const tag = cipher.getAuthTag();
    
    // Combine salt + iv + tag + encrypted data
    const combined = Buffer.concat([
      salt,
      iv,
      tag,
      Buffer.from(encrypted, 'hex')
    ]);
    
    return combined.toString('base64');
    
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Encryption failed');
  }
};

/**
 * Decrypts text using AES-256-GCM
 * @param {string} encryptedData - Base64 encoded encrypted data
 * @param {string} password - Password for decryption
 * @returns {string} - Decrypted text
 */
const decrypt = (encryptedData, password) => {
  try {
    // Parse the combined data
    const combined = Buffer.from(encryptedData, 'base64');
    
    // Extract components
    const salt = combined.slice(0, SALT_LENGTH);
    const iv = combined.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const tag = combined.slice(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
    const encrypted = combined.slice(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
    
    // Derive key from password
    const key = deriveKey(password, salt);
    
    // Create decipher
    const decipher = crypto.createDecipher(ALGORITHM, key);
    decipher.setAuthTag(tag);
    decipher.setAAD(salt);
    
    // Decrypt the data
    let decrypted = decipher.update(encrypted, null, 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
    
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Decryption failed');
  }
};

/**
 * Generates a secure random password
 * @param {number} length - Length of the password
 * @returns {string} - Random password
 */
const generateSecurePassword = (length = 32) => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, charset.length);
    password += charset[randomIndex];
  }
  
  return password;
};

/**
 * Hashes data using SHA-256
 * @param {string} data - Data to hash
 * @returns {string} - Hex encoded hash
 */
const hash = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

/**
 * Verifies data against hash
 * @param {string} data - Original data
 * @param {string} hashToVerify - Hash to verify against
 * @returns {boolean} - True if hash matches
 */
const verifyHash = (data, hashToVerify) => {
  const dataHash = hash(data);
  return crypto.timingSafeEqual(Buffer.from(dataHash), Buffer.from(hashToVerify));
};

/**
 * Encrypts message if encryption is enabled
 * @param {string} message - Message to potentially encrypt
 * @param {string} encryptionKey - Encryption key (optional)
 * @returns {Object} - Object with encrypted message and metadata
 */
const encryptMessage = (message, encryptionKey) => {
  if (!encryptionKey || !message) {
    return {
      message: message,
      encrypted: false,
      timestamp: new Date().toISOString()
    };
  }
  
  try {
    const encrypted = encrypt(message, encryptionKey);
    return {
      message: encrypted,
      encrypted: true,
      timestamp: new Date().toISOString(),
      algorithm: ALGORITHM
    };
  } catch (error) {
    console.warn('Message encryption failed, storing as plain text:', error.message);
    return {
      message: message,
      encrypted: false,
      timestamp: new Date().toISOString(),
      error: 'Encryption failed'
    };
  }
};

/**
 * Decrypts message if it was encrypted
 * @param {Object} messageData - Message data object
 * @param {string} encryptionKey - Encryption key
 * @returns {string} - Decrypted message or original if not encrypted
 */
const decryptMessage = (messageData, encryptionKey) => {
  if (!messageData.encrypted || !encryptionKey) {
    return messageData.message;
  }
  
  try {
    return decrypt(messageData.message, encryptionKey);
  } catch (error) {
    console.error('Message decryption failed:', error);
    return '[ENCRYPTED MESSAGE - DECRYPTION FAILED]';
  }
};

module.exports = {
  encrypt,
  decrypt,
  generateSecurePassword,
  hash,
  verifyHash,
  encryptMessage,
  decryptMessage
};
