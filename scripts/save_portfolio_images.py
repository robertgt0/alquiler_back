from PIL import Image
import os

# Directorio donde se guardarán las imágenes
output_dir = r"c:\Users\USUARIO\Desktop\IS Proyecto\alquiler_front\public\images\portfolio\decoracion"

# Asegurarse de que el directorio existe
os.makedirs(output_dir, exist_ok=True)

# Lista de nombres de archivo para las imágenes
image_names = [
    "boda-elegante.jpg",
    "babyshower-oso.jpg", 
    "frozen-party.jpg",
    "rosegold-party.jpg"
]

# Procesar las imágenes del portafolio proporcionadas
for idx, image_data in enumerate(attachments):
    if idx < len(image_names):
        output_path = os.path.join(output_dir, image_names[idx])
        image_data.save(output_path)
        print(f"Saved: {output_path}")