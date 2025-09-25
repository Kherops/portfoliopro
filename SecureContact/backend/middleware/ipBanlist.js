const db = require('../config/database');

// IP ban tracking
const failedAttempts = new Map();
const MAX_FAILED_ATTEMPTS = 5;
const BAN_DURATION_HOURS = 24;

// Middleware to check if IP is banned
const checkIPBan = async (req, res, next) => {
  try {
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
    
    // Check if IP is in banlist
    const banQuery = `
      SELECT id, reason, banned_at, expires_at 
      FROM ip_banlist 
      WHERE ip_address = $1 AND is_active = true 
      AND (expires_at IS NULL OR expires_at > NOW())
    `;
    
    const banResult = await db.query(banQuery, [clientIP]);
    
    if (banResult.rows.length > 0) {
      const ban = banResult.rows[0];
      console.log(`Blocked request from banned IP: ${clientIP}, Reason: ${ban.reason}`);
      
      return res.status(403).json({
        error: 'Access denied',
        message: 'Your IP address has been temporarily blocked due to suspicious activity',
        bannedAt: ban.banned_at,
        expiresAt: ban.expires_at
      });
    }
    
    next();
  } catch (error) {
    console.error('IP ban check error:', error);
    next(); // Continue on error to avoid blocking legitimate users
  }
};

// Function to record failed attempt
const recordFailedAttempt = async (req, type = 'general') => {
  try {
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
    
    // Get current failed attempts for this IP
    const currentAttempts = failedAttempts.get(clientIP) || { count: 0, firstAttempt: new Date() };
    currentAttempts.count += 1;
    currentAttempts.lastAttempt = new Date();
    currentAttempts.type = type;
    
    failedAttempts.set(clientIP, currentAttempts);
    
    console.log(`Failed attempt recorded for IP ${clientIP}: ${currentAttempts.count}/${MAX_FAILED_ATTEMPTS} (${type})`);
    
    // Check if IP should be banned
    if (currentAttempts.count >= MAX_FAILED_ATTEMPTS) {
      await banIP(clientIP, `Too many failed ${type} attempts`, BAN_DURATION_HOURS);
      failedAttempts.delete(clientIP); // Clear from memory after banning
    }
    
  } catch (error) {
    console.error('Failed to record failed attempt:', error);
  }
};

// Function to ban an IP
const banIP = async (ipAddress, reason, durationHours = 24) => {
  try {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + durationHours);
    
    const banQuery = `
      INSERT INTO ip_banlist (ip_address, reason, expires_at, is_active)
      VALUES ($1, $2, $3, true)
      ON CONFLICT (ip_address) 
      DO UPDATE SET 
        reason = $2,
        banned_at = NOW(),
        expires_at = $3,
        is_active = true
    `;
    
    await db.query(banQuery, [ipAddress, reason, expiresAt]);
    
    console.log(`IP ${ipAddress} has been banned for ${durationHours} hours. Reason: ${reason}`);
    
    // Optional: Send notification to admin
    // await sendAdminNotification(`IP ${ipAddress} banned`, reason);
    
  } catch (error) {
    console.error('Failed to ban IP:', error);
  }
};

// Function to unban an IP (for admin use)
const unbanIP = async (ipAddress) => {
  try {
    const unbanQuery = `
      UPDATE ip_banlist 
      SET is_active = false 
      WHERE ip_address = $1
    `;
    
    await db.query(unbanQuery, [ipAddress]);
    failedAttempts.delete(ipAddress); // Clear from memory
    
    console.log(`IP ${ipAddress} has been unbanned`);
    
  } catch (error) {
    console.error('Failed to unban IP:', error);
  }
};

// Function to clear successful attempts (call on successful login/contact)
const clearFailedAttempts = (req) => {
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
  failedAttempts.delete(clientIP);
};

// Cleanup expired bans (run periodically)
const cleanupExpiredBans = async () => {
  try {
    const cleanupQuery = `
      UPDATE ip_banlist 
      SET is_active = false 
      WHERE expires_at IS NOT NULL 
      AND expires_at < NOW() 
      AND is_active = true
    `;
    
    const result = await db.query(cleanupQuery);
    
    if (result.rowCount > 0) {
      console.log(`Cleaned up ${result.rowCount} expired IP bans`);
    }
    
  } catch (error) {
    console.error('Failed to cleanup expired bans:', error);
  }
};

// Run cleanup every hour
setInterval(cleanupExpiredBans, 60 * 60 * 1000);

module.exports = {
  checkIPBan,
  recordFailedAttempt,
  banIP,
  unbanIP,
  clearFailedAttempts,
  cleanupExpiredBans
};
