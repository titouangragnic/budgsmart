import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { config } from '../config/environment';

// Google OAuth client
const googleClient = new OAuth2Client(config.GOOGLE_CLIENT_ID);

interface AuthenticatedRequest extends Request {
  userId?: string;
  user?: User;
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    console.log('Auth header:', authHeader);


    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Access token required' });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      // First try to verify as JWT token (for our app tokens)
      const decoded = jwt.verify(token, config.JWT_SECRET) as { userId: string };
      
      // Verify user still exists
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { id: decoded.userId } });

      if (!user || !user.isActive) {
        res.status(401).json({ message: 'Invalid token or user not found' });
        return;
      }

      // Attach user info to request
      req.userId = decoded.userId;
      req.user = user;
      
      next();
    } catch (jwtError) {
      // If JWT verification fails, try Google token verification
      try {
        // First try as Google ID token
        let googleId: string;
        let email: string;
        
        try {
          const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: config.GOOGLE_CLIENT_ID,
          });
          
          const payload = ticket.getPayload();
          if (!payload || !payload.email) {
            throw new Error('Invalid Google ID token');
          }
          googleId = payload.sub;
          email = payload.email;
        } catch (idTokenError) {
          // If ID token verification fails, try as access token
          const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${token}`);
          if (!response.ok) {
            throw new Error('Invalid Google access token');
          }
          
          const userInfo: any = await response.json();
          if (!userInfo.email) {
            throw new Error('Email not provided by Google');
          }
          
          googleId = userInfo.id;
          email = userInfo.email;
        }

        // Find user by email (user should already exist if using Google auth through /auth/google endpoint)
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { email } });

        if (!user || !user.isActive) {
          res.status(401).json({ message: 'User not found. Please sign in through the proper Google auth flow.' });
          return;
        }

        // Attach user info to request
        req.userId = user.id;
        req.user = user;
        
        next();
      } catch (googleError) {
        console.error('Token verification error:', googleError);
        res.status(401).json({ message: 'Invalid or expired token' });
        return;
      }
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Server error during authentication' });
    return;
  }
};
