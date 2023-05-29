require("dotenv").config()
const express = require('express');
const mysql = require('mysql2/promise');

// Crear una instancia de la aplicación de Express
const app = express();

// Establecer el puerto en el que escuchará nuestra aplicación
const PORT = process.env.PORT || 3009;

// Iniciar la aplicación de Express
app.listen(PORT, async () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);

  // Configurar la conexión a la base de datos MySQL
  /*const MYSQL_DB_HOST = '154.12.232.98'
  const MYSQL_DB_USER = 'bot1app'
  const MYSQL_DB_PASSWORD = 'j5=TgH4m35DlbS'
  const MYSQL_DB_NAME = 'bot1app_record'
  const MYSQL_DB_PORT = '36378'*/


  const connection = await mysql.createConnection({
    /*host: '154.12.232.98',
    user: 'bot1app',
    password: 'j5=TgH4m35DlbS',
    database: 'bot1app_control',
    port: '36378'*/
    host: process.env.MYSQL_DB_HOST,
    user: process.env.MYSQL_DB_USER,
    password: process.env.MYSQL_DB_PASSWORD,
    database: process.env.MYSQL_DB_NAME,
    port: process.env.MYSQL_DB_PORT
  });

  // Manejar errores de conexión a la base de datos
  try {
    await connection.connect();
    console.log('Conexión exitosa a la base de datos MySQL.');

    // Ruta para obtener todos los servicios y precios

    app.get('/servicios', async (req, res) => {
      try {
        const loquellega = req;
        console.log('loque llega ' + loquellega.query.servicios)
        //const servicios = req.query.servicios.trim().split(','); // Obtener valores de la URL
        const servicios = req.query.servicios.split(',').map(servicio => servicio.trim());
        const placeholders = servicios.map(() => '?').join(','); // Crear placeholders para los valores
        const [rows, fields] = await connection.query
          (`select pp.customer_id , phone , full_name , pp.amount , filename 
          from bot1app_control.view_pending_pays pp, bot1app_control.customer_qrcodes cq 
          where pp.customer_id = cq.customer_id and pp.amount = cq.amount and pp.phone= (${placeholders})`, servicios); // Construir y ejecutar la consulta SQL
        //const [rows, fields] = await connection.query(`SELECT * FROM servicios WHERE servicio IN (${placeholders})`, servicios); 

        console.log(servicios);
        //console.log(`SELECT * FROM servicios WHERE phone = (${placeholders})`)
        console.log(rows[0].full_name + ' este es el nombre que busco')
        console.log(rows[0].amount + ' este es el precio que busco')
        console.log(rows[0].filename + ' este es el dir del qr que busco')
        res.status(200).json(rows);
      } catch (error) {
        console.error('Error al obtener servicios:', error);
        res.status(500).send('Error al obtener servicios');
      }
    });

    app.get('/llamar_procedimiento/:parametro1/:parametro2', async (req, res) => {
      try {
        const parametro1 = req.params.parametro1;
        const parametro2 = req.params.parametro2;
        //call send_qr(1,45,@a, @b)
        //http://localhost:3000/llamar_procedimiento/valor1/valor2
        //http://154.12.232.98:3009/llamar_procedimiento/1/45

        // Llamar al procedimiento almacenado con los parámetros y obtener los resultados
        const [results] = await connection.query(
          'CALL send_qr(?, ?, @a, @b)',
          [parametro1, parametro2]
        );

        // Obtener los resultados devueltos por el procedimiento almacenado
        const [rows] = await connection.query('SELECT @a AS resultado1, @b AS resultado2');

        const resultado1 = rows[0].resultado1;
        const resultado2 = rows[0].resultado2;

        console.log('Resultado 1:', resultado1);
        console.log('Resultado 2:', resultado2);

        res.status(200).json({ resultado1, resultado2 });
      } catch (error) {
        console.error('Error al llamar al procedimiento:', error);
        res.status(500).send('Error al llamar al procedimiento');
      }
    });
    app.get('/llamar_get_paid/:parametro1/:parametro2/:parametro3/:parametro4', async (req, res) => {
      try {
        const parametro1 = req.params.parametro1;
        const parametro2 = req.params.parametro2;
        const parametro3 = req.params.parametro3;
        const parametro4 = req.params.parametro4;
        const parametro4AsBool = parametro4 === 'true' ? true : false;
        //
        //call bot1app_control.get_paid(1,45,null,@a,@b);
        //http://localhost:3000/llamar_get_paid/valor1/valor2/valor3/valor4
        //http://154.12.232.98:3009/llamar_get_paid/1/45/null/true

        console.log("esto llega en el parametro 3 " + parametro3);
        console.log("esto llega en el parametro 4 " + parametro4);

        // Llamar al procedimiento almacenado con los parámetros y obtener los resultados
        const [results] = await connection.query(
          'CALL bot1app_control.get_paid(?, ?, ?,?, @a, @b)',
          [parametro1, parametro2, parametro3, parametro4AsBool]
        );

        // Obtener los resultados devueltos por el procedimiento almacenado
        const [rows] = await connection.query('SELECT @a AS resultado1, @b AS resultado2');

        const resultado1 = rows[0].resultado1;
        const resultado2 = rows[0].resultado2;

        console.log('Resultado 1:', resultado1);
        console.log('Resultado 2:', resultado2);

        res.status(200).json({ resultado1, resultado2 });
      } catch (error) {
        console.error('Error al llamar al procedimiento:', error);
        res.status(500).send('Error al llamar al procedimiento');
      }
    });

    app.get('/llamar_get_debt/:parametro1/', async (req, res) => {
      try {
        const parametro1 = req.params.parametro1;


        //call bot1app_control.get_debt('70710131', @a, @b,@c)
        //http://localhost:3000/llamar_get_debt/valor1
        //http://154.12.232.98:3009/llamar_get_debt/70710131



        // Llamar al procedimiento almacenado con los parámetros y obtener los resultados
        const [results] = await connection.query(
          'CALL bot1app_control.get_debt(?, @a, @b,@c)',
          [parametro1]
        );

        // Obtener los resultados devueltos por el procedimiento almacenado
        const [rows] = await connection.query('SELECT @a AS resultado1, @b AS resultado2, @c AS resultado3');

        const resultado1 = rows[0].resultado1;
        const resultado2 = rows[0].resultado2;
        const resultado3 = rows[0].resultado3;

        console.log('Resultado 1:', resultado1);
        console.log('Resultado 2:', resultado2);
        console.log('Resultado 3:', resultado3);

        res.status(200).json({ resultado1, resultado2, resultado3 });
      } catch (error) {
        console.error('Error al llamar al procedimiento:', error);
        res.status(500).send('Error al llamar al procedimiento');
      }
    });
    app.get('/llamar_insert_history_log/:parametro1/:parametro2/:parametro3/:parametro4', async (req, res) => {
      try {
        const parametro1 = req.params.parametro1;
        const parametro2 = req.params.parametro2;
        const parametro3 = req.params.parametro3;
        const parametro4 = req.params.parametro4;
        //
        //CALL insert_history_log('70729149', 'probanado', 'phase prueba2', 'positive') ;
        //http://localhost:3000/llamar_insert_history_log/valor1/valor2/valor3/valor4
        //http://154.12.232.98:3009/llamar_insert_history_log/70729149/probanado/phase prueba2/positive

        // Llamar al procedimiento almacenado con los parámetros y obtener los resultados
        const [results] = await connection.query(
          'CALL bot1app_record.insert_history_log(?, ?, ?, ?)',
          [parametro1, parametro2, parametro3, parametro4]
        );
        res.status(200).send('Procedimiento llamado exitosamente');
        console.log('Se inserto correctamente');
      } catch (error) {
        console.error('Error al llamar al procedimiento:', error);
        res.status(500).send('Error al llamar al procedimiento');
      }
    });








  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    process.exit(1);
  }
});

