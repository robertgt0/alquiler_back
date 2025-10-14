import { Request, Response } from 'express';
import { OrderingService } from '../services/ordering.service';
import { handleError } from '@/errors/errorHandler';
import { ApiResponse } from '@/types';

export class OrderingController {
  private orderingService: OrderingService;

  constructor() {
    this.orderingService = new OrderingService();
  }

  /**
   * Ordena los registros de una colección según un campo (A–Z o Z–A)
   * Ejemplo: GET /api/ordering?collection=users&field=name&order=asc
   */
  public async getOrdered(req: Request, res: Response): Promise<void> {
    try {
      const { collection, field = 'nombre', order = 'asc' } = req.query;

      if (!collection) {
        res.status(400).json({
          success: false,
          message: 'El parámetro "collection" es obligatorio',
        });
        return;
      }

      const data = await this.orderingService.getOrderedData(
        collection.toString(),
        field.toString(),
        order.toString()
      );

      const response: ApiResponse<any> = {
        success: true,
        count: data.length,
        data,
        message: `Datos de ${collection} ordenados por ${field} (${order.toUpperCase()})`,
      };

      res.json(response);
    } catch (error) {
      handleError(error, res);
    }
  }
}
