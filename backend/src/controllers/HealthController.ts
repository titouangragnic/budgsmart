import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';

export class HealthController {
  async getHealth(req: Request, res: Response) {
    try {
      const startTime = Date.now();
      
      // Check database connection
      let dbStatus = 'disconnected';
      let dbResponseTime = 0;
      
      try {
        const dbStartTime = Date.now();
        await AppDataSource.query('SELECT 1');
        dbResponseTime = Date.now() - dbStartTime;
        dbStatus = 'connected';
      } catch (error) {
        dbStatus = 'error';
      }

      const responseTime = Date.now() - startTime;
      const uptime = process.uptime();
      const memoryUsage = process.memoryUsage();

      const healthData = {
        status: dbStatus === 'connected' ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        uptime: `${Math.floor(uptime / 60)}m ${Math.floor(uptime % 60)}s`,
        responseTime: `${responseTime}ms`,
        database: {
          status: dbStatus,
          responseTime: `${dbResponseTime}ms`
        },
        memory: {
          rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
          heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
          external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`
        },
        environment: process.env.NODE_ENV || 'development',
        version: process.env.npm_package_version || '1.0.0'
      };

      const statusCode = dbStatus === 'connected' ? 200 : 503;
      res.status(statusCode).json(healthData);
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Health check failed',
        timestamp: new Date().toISOString()
      });
    }
  }

  async getReadiness(req: Request, res: Response) {
    try {
      // Check if database is ready
      await AppDataSource.query('SELECT 1');
      
      res.status(200).json({
        status: 'ready',
        message: 'Service is ready to handle requests',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(503).json({
        status: 'not ready',
        message: 'Service is not ready',
        timestamp: new Date().toISOString()
      });
    }
  }

  async getLiveness(req: Request, res: Response) {
    res.status(200).json({
      status: 'alive',
      message: 'Service is alive',
      timestamp: new Date().toISOString()
    });
  }
}
