Para ejecutar la prueba desde el backend y simular un evento interno sin usar Postman, deberemos trabajar en dos terminales distintas.

Una donde haremos el clásico: npm run dev

Y otra donde ejecutaremos: 
<npx ts-node src/testsNotification/exitoSimpleGmail.ts>
<npx ts-node src/testsNotification/exitoSimpleWhatsApp.ts>

Deberemos ver en ambas terminales la confirmación clásica. Además, se deberá ver que en el workflow, en la sección de "Executions" 
(Ejecuciones), se haya recorrido correctamente.

Y obvio, [comprobar] que haya llegado el correo al destino.

Pueden hacer pruebas enviando campos vacíos, ya que correos ficticios no los detecta 
y lo toma como que sí o sí lo envió (aunque la dirección no exista).