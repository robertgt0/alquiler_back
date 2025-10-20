import { Request, Response } from "express";

const LIBELULA_API = "https://api.libelula.bo/rest/deuda/registrar";

export const registrarDeudaController = async (req: Request, res: Response) => {
  try {
    const { email_cliente, identificador_deuda, descripcion, nombre_cliente, apellido_cliente,ci,nit,descripcion_envio, concepto, Costo_Unitario} = req.body;

    const response = await fetch(LIBELULA_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        appkey: "11bb10ce-68ba-4af1-8eb7-4e6624fed729",
        email_cliente,
        identificador_deuda,
        fecha_vencimiento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        descripcion,
        callback_url: "http://localhost:3000",
        nombre_cliente,
        apellido_cliente,
        ci,
        razon_social: "Servineos",
        nit,
        emite_factura: true,
        valor_envio: 0,
        descripcion_envio,
        moneda: "BOB",
        lineas_detalle_deuda: [
          {
            concepto,
            cantidad: 1,
            Costo_Unitario,
          },
        ],
      }),
    });

    const data = await response.json();

    console.log("Respuesta:", data);
    res.status(response.status).json(data);

  } catch (err: any) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
};

