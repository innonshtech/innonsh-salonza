import xss from "xss";

/**
 * Strips MongoDB operators (keys starting with $) from an object to prevent NoSQL injection.
 */
export function sanitizeNoSql(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((v) => sanitizeNoSql(v));
  }
  
  if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc: any, key: string) => {
      // Reject any keys that start with '$' or contain '.' (which can be used for deep injection)
      if (key.startsWith("$") || key.includes(".")) {
        // Skip this key
        return acc;
      }
      acc[key] = sanitizeNoSql(obj[key]);
      return acc;
    }, {});
  }
  
  return obj;
}

/**
 * Prevents HTML/XSS injection by sanitizing string inputs.
 */
export function sanitizeXss(obj: any): any {
  if (typeof obj === "string") {
    return xss(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map((v) => sanitizeXss(v));
  }
  
  if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc: any, key: string) => {
      acc[key] = sanitizeXss(obj[key]);
      return acc;
    }, {});
  }
  
  return obj;
}

/**
 * Master sanitization utility that runs both NoSQL and XSS sanitization.
 */
export function sanitizePayload(payload: any) {
  const noSqlSafe = sanitizeNoSql(payload);
  return sanitizeXss(noSqlSafe);
}
