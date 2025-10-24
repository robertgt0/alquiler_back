import "express";

declare global {
  namespace Express {
    interface Request {
      file?: any;   // lo usas como .file?.buffer
      files?: any;
    }
  }
}
export {};
