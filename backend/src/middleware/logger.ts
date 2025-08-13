import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'development') {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.url;
    const userAgent = req.get('User-Agent') || 'Unknown';
    
    console.log(`[${timestamp}] ${method} ${url} - ${userAgent}`);
    
    // Log request body for POST/PUT requests (excluding password fields)
    if ((method === 'POST' || method === 'PUT') && req.body) {
      const bodyToLog = { ...req.body };
      if (bodyToLog.password) {
        bodyToLog.password = '[HIDDEN]';
      }
      console.log('Request Body:', JSON.stringify(bodyToLog, null, 2));
    }
  }
  
  next();
};

export const responseLogger = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'development') {
    const originalSend = res.send;
    
    res.send = function(body) {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] Response ${res.statusCode} for ${req.method} ${req.url}`);
      
      return originalSend.call(this, body);
    };
  }
  
  next();
};
