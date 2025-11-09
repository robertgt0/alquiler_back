import axios from "axios";

export const sendWhatsApp = async (telefono: string, mensaje: string) => {
  try {
    
    const API_URL = "https://api.ultramsg.com/instanceXXXX/messages/chat";
    const TOKEN = "tu_token_de_prueba";

    const response = await axios.post(API_URL, {
      token: TOKEN,
      to: `591${telefono}`, 
      body: mensaje,
    });

    return response.data;
  } catch (error) {
    console.error("Error enviando WhatsApp:", error);
    throw error;
  }
};
