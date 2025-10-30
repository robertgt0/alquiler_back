import { Request, Response, NextFunction } from 'express';

export const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`\n[${timestamp}] Petición recibida:`);
  console.log(`📍 URL: ${req.method} ${req.url}`);
  console.log(`🌐 BaseURL: ${req.baseUrl}`);
  console.log(`🛣️  Path: ${req.path}`);
  console.log(`📨 Headers:`, req.headers);
  console.log(`📝 Query:`, req.query);
  
  // Capturar la respuesta
  const oldSend = res.send;
  res.send = function (data: any) {
    console.log(`\n[${timestamp}] Respuesta enviada:`);
    console.log(`📊 Status: ${res.statusCode}`);
    console.log(`📤 Headers:`, res.getHeaders());
    console.log(`📦 Body:`, typeof data === 'string' ? data.substring(0, 200) + '...' : data);
    return oldSend.call(this, data);
  };

  next();
};