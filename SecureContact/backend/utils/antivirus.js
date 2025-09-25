const crypto = require('crypto');

// Simple content analysis patterns for suspicious content
const SUSPICIOUS_PATTERNS = [
  // Script injection attempts
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /vbscript:/gi,
  /onload\s*=/gi,
  /onerror\s*=/gi,
  /onclick\s*=/gi,
  
  // SQL injection patterns
  /union\s+select/gi,
  /drop\s+table/gi,
  /delete\s+from/gi,
  /insert\s+into/gi,
  /update\s+set/gi,
  
  // Command injection
  /\|\s*nc\s/gi,
  /\|\s*netcat/gi,
  /\|\s*wget/gi,
  /\|\s*curl/gi,
  /\|\s*bash/gi,
  /\|\s*sh/gi,
  
  // File system access
  /\.\.\/\.\.\//gi,
  /\/etc\/passwd/gi,
  /\/etc\/shadow/gi,
  /\/proc\/self/gi,
  
  // Suspicious URLs
  /bit\.ly/gi,
  /tinyurl/gi,
  /t\.co/gi,
  
  // Malicious file extensions in text
  /\.(exe|bat|cmd|scr|pif|com|vbs|js|jar|zip|rar)$/gi,
  
  // Base64 encoded suspicious content
  /data:text\/html;base64,/gi,
  /data:application\/javascript;base64,/gi,
];

// Suspicious keywords that might indicate malicious intent
const SUSPICIOUS_KEYWORDS = [
  'exploit', 'payload', 'shellcode', 'backdoor', 'rootkit',
  'keylogger', 'trojan', 'virus', 'malware', 'ransomware',
  'phishing', 'scam', 'fraud', 'hack', 'crack',
  'bypass', 'injection', 'xss', 'csrf', 'rce',
  'eval(', 'exec(', 'system(', 'shell_exec',
  'passthru', 'proc_open', 'popen', 'file_get_contents',
];

/**
 * Analyzes content for suspicious patterns
 * @param {string} content - Content to analyze
 * @returns {Object} - Analysis result
 */
const analyzeContent = (content) => {
  const analysis = {
    isSuspicious: false,
    riskLevel: 'low', // low, medium, high, critical
    threats: [],
    score: 0,
    details: []
  };

  if (!content || typeof content !== 'string') {
    return analysis;
  }

  const contentLower = content.toLowerCase();
  
  // Check for suspicious patterns
  SUSPICIOUS_PATTERNS.forEach((pattern, index) => {
    const matches = content.match(pattern);
    if (matches) {
      analysis.threats.push({
        type: 'pattern',
        pattern: pattern.toString(),
        matches: matches.length,
        severity: 'high'
      });
      analysis.score += matches.length * 10;
      analysis.details.push(`Suspicious pattern detected: ${pattern.toString().slice(0, 50)}...`);
    }
  });

  // Check for suspicious keywords
  let keywordMatches = 0;
  SUSPICIOUS_KEYWORDS.forEach(keyword => {
    if (contentLower.includes(keyword.toLowerCase())) {
      keywordMatches++;
      analysis.threats.push({
        type: 'keyword',
        keyword: keyword,
        severity: 'medium'
      });
      analysis.score += 5;
    }
  });

  if (keywordMatches > 0) {
    analysis.details.push(`${keywordMatches} suspicious keywords found`);
  }

  // Check content length (extremely long content might be suspicious)
  if (content.length > 10000) {
    analysis.score += 3;
    analysis.details.push('Unusually long content detected');
  }

  // Check for excessive special characters
  const specialCharCount = (content.match(/[<>{}[\]()&|;$`'"\\]/g) || []).length;
  const specialCharRatio = specialCharCount / content.length;
  
  if (specialCharRatio > 0.1) {
    analysis.score += Math.floor(specialCharRatio * 20);
    analysis.details.push(`High special character ratio: ${(specialCharRatio * 100).toFixed(1)}%`);
  }

  // Check for repeated suspicious sequences
  const suspiciousSequences = ['..//', '&&', '||', ';;', '$$'];
  suspiciousSequences.forEach(seq => {
    const count = (content.match(new RegExp(seq.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    if (count > 2) {
      analysis.score += count * 2;
      analysis.details.push(`Repeated suspicious sequence: ${seq} (${count} times)`);
    }
  });

  // Determine risk level based on score
  if (analysis.score >= 50) {
    analysis.riskLevel = 'critical';
    analysis.isSuspicious = true;
  } else if (analysis.score >= 25) {
    analysis.riskLevel = 'high';
    analysis.isSuspicious = true;
  } else if (analysis.score >= 10) {
    analysis.riskLevel = 'medium';
    analysis.isSuspicious = true;
  } else if (analysis.score >= 5) {
    analysis.riskLevel = 'low';
  }

  return analysis;
};

/**
 * Scans a message for malicious content
 * @param {Object} messageData - Message data to scan
 * @returns {Object} - Scan result
 */
const scanMessage = async (messageData) => {
  const scanResult = {
    timestamp: new Date().toISOString(),
    messageId: messageData.id || 'unknown',
    clean: true,
    threats: [],
    analysis: {},
    action: 'allow' // allow, quarantine, block
  };

  try {
    // Analyze name field
    const nameAnalysis = analyzeContent(messageData.name);
    if (nameAnalysis.isSuspicious) {
      scanResult.threats.push({
        field: 'name',
        ...nameAnalysis
      });
    }

    // Analyze email field
    const emailAnalysis = analyzeContent(messageData.email);
    if (emailAnalysis.isSuspicious) {
      scanResult.threats.push({
        field: 'email',
        ...emailAnalysis
      });
    }

    // Analyze message field
    const messageAnalysis = analyzeContent(messageData.message);
    if (messageAnalysis.isSuspicious) {
      scanResult.threats.push({
        field: 'message',
        ...messageAnalysis
      });
    }

    // Calculate overall risk
    const totalScore = nameAnalysis.score + emailAnalysis.score + messageAnalysis.score;
    const highestRisk = [nameAnalysis.riskLevel, emailAnalysis.riskLevel, messageAnalysis.riskLevel]
      .sort((a, b) => {
        const levels = { low: 1, medium: 2, high: 3, critical: 4 };
        return levels[b] - levels[a];
      })[0];

    scanResult.analysis = {
      totalScore,
      riskLevel: highestRisk,
      fieldsScanned: 3,
      threatsFound: scanResult.threats.length
    };

    // Determine action based on risk level
    if (highestRisk === 'critical' || totalScore >= 75) {
      scanResult.clean = false;
      scanResult.action = 'block';
    } else if (highestRisk === 'high' || totalScore >= 40) {
      scanResult.clean = false;
      scanResult.action = 'quarantine';
    } else if (totalScore >= 15) {
      scanResult.clean = false;
      scanResult.action = 'allow'; // Allow but flag for review
    }

    // Log suspicious activity
    if (!scanResult.clean) {
      console.log(`🦠 Antivirus scan detected threats:`, {
        messageId: scanResult.messageId,
        riskLevel: highestRisk,
        totalScore,
        action: scanResult.action,
        threatsCount: scanResult.threats.length
      });
    }

    return scanResult;

  } catch (error) {
    console.error('Antivirus scan error:', error);
    return {
      ...scanResult,
      error: error.message,
      clean: true, // Fail open to avoid blocking legitimate messages
      action: 'allow'
    };
  }
};

/**
 * Generates a hash of content for threat signature matching
 * @param {string} content - Content to hash
 * @returns {string} - SHA-256 hash
 */
const generateThreatSignature = (content) => {
  return crypto.createHash('sha256').update(content.toLowerCase().trim()).digest('hex');
};

/**
 * Checks if content matches known threat signatures
 * @param {string} content - Content to check
 * @param {Array} knownThreats - Array of known threat signatures
 * @returns {boolean} - True if matches known threat
 */
const checkThreatSignatures = (content, knownThreats = []) => {
  const signature = generateThreatSignature(content);
  return knownThreats.includes(signature);
};

/**
 * Middleware to scan messages before processing
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const antivirusMiddleware = async (req, res, next) => {
  try {
    // Only scan contact form submissions
    if (req.path === '/api/contact' && req.method === 'POST') {
      const scanResult = await scanMessage(req.body);
      
      // Attach scan result to request for logging
      req.antivirusScan = scanResult;
      
      // Block critical threats
      if (scanResult.action === 'block') {
        console.log(`🚫 Blocked malicious message from IP: ${req.ip}`);
        return res.status(400).json({
          error: 'Message blocked by security scan',
          reason: 'Potentially malicious content detected'
        });
      }
      
      // Quarantine suspicious messages (allow but flag)
      if (scanResult.action === 'quarantine') {
        console.log(`⚠️ Quarantined suspicious message from IP: ${req.ip}`);
        req.body._quarantined = true;
        req.body._scanResult = scanResult;
      }
    }
    
    next();
  } catch (error) {
    console.error('Antivirus middleware error:', error);
    next(); // Continue on error to avoid blocking legitimate requests
  }
};

module.exports = {
  analyzeContent,
  scanMessage,
  generateThreatSignature,
  checkThreatSignatures,
  antivirusMiddleware
};
