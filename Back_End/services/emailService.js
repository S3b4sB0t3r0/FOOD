import nodemailer from 'nodemailer';

// Configura el transporter con tu contraseña de aplicación de Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'elvandalogrillcolombia@gmail.com', // reemplaza con tu correo
    pass: 'rpdi cmrm lanw ealv'  // contraseña de aplicación
  }
});

/**
 * Enviar correo de bienvenida
 */
export const enviarCorreoRegistro = async (correoDestino, nombre) => {
  const mailOptions = {
    from: '"El Vándalo Grill 🍔🔥" <elvandalogrillcolombia@gmail.com>',
    to: correoDestino,
    subject: '¡Bienvenido a El Vándalo Grill!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #fff3e0; border-radius: 10px; border: 1px solid #ffc107;">
        <h2 style="color: #d32f2f; text-align: center;">¡Hola ${nombre}!</h2>
        <p style="font-size: 16px; color: #333;">Gracias por registrarte en <strong>El Vándalo Grill</strong>, la mejor experiencia de comida rápida en Colombia 🇨🇴.</p>
        <p style="font-size: 15px; color: #555;">Tu correo <strong>${correoDestino}</strong> ha sido usado para crear una cuenta en nuestra plataforma.</p>
        <hr style="margin: 20px 0;" />
        <p style="font-size: 14px; color: #777;">¿No fuiste tú? Por favor, ignora este mensaje o contáctanos.</p>
        <p style="font-size: 14px; color: #777;">¡Esperamos verte pronto!</p>
        <p style="text-align: center; margin-top: 30px;">
          <strong style="color: #d32f2f;">El Vándalo Grill</strong><br/>
          <span style="font-size: 12px;">Rápido, sabroso y brutal. 😎🔥</span>
        </p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

export const enviarCorreoContacto = async (correoDestino, nombre, asunto, mensajeOriginal) => {
    const mailOptions = {
      from: '"El Vándalo Grill 🍔🔥" <elvandalogrillcolombia@gmail.com>',
      to: correoDestino,
      subject: 'Hemos recibido tu mensaje - El Vándalo Grill',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #fffde7; border-radius: 10px; border: 1px solid #ffeb3b;">
          <h2 style="color: #d84315;">¡Gracias por contactarnos, ${nombre}!</h2>
          <p style="font-size: 16px; color: #333;">Hemos recibido tu mensaje con el siguiente asunto:</p>
          <p style="font-size: 15px; color: #444;"><strong>“${asunto}”</strong></p>
          <p style="font-size: 15px; color: #555;">Mensaje:</p>
          <blockquote style="background: #fff3e0; padding: 15px; border-left: 5px solid #ff9800; color: #555;">
            ${mensajeOriginal}
          </blockquote>
          <p style="font-size: 14px; color: #666;">Uno de nuestros colaboradores te responderá muy pronto.</p>
          <p style="text-align: center; margin-top: 30px;">
            <strong style="color: #d32f2f;">El Vándalo Grill</strong><br/>
            <span style="font-size: 12px;">¡Sabroso, rápido y brutal como siempre! 😎🔥</span>
          </p>
        </div>
      `
    };
  
    await transporter.sendMail(mailOptions);
  };
  
  export const enviarCorreoRecuperacion = async (correoDestino, nombre, token) => {
    const link = `http://localhost:3000/recuperar/${token}`; // cambia por tu URL real
  
    const mailOptions = {
      from: '"El Vándalo Grill 🍔🔥" <elvandalogrillcolombia@gmail.com>',
      to: correoDestino,
      subject: 'Recupera tu contraseña - El Vándalo Grill',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #fff3e0; border-radius: 10px; border: 1px solid #ffc107;">
          <h2 style="color: #d84315;">¡Hola ${nombre}!</h2>
          <p style="font-size: 16px; color: #333;">Recibimos una solicitud para restablecer tu contraseña.</p>
          <p style="font-size: 16px;">Haz clic en el siguiente botón para continuar:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${link}" style="background-color: #ffca28; color: black; padding: 12px 20px; text-decoration: none; font-weight: bold; border-radius: 8px;">
              Restablecer Contraseña
            </a>
          </div>
          <p style="font-size: 14px; color: #777;">Este enlace expirará en 24 horas. Si no fuiste tú, puedes ignorar este mensaje.</p>
          <p style="margin-top: 40px; text-align: center;">
            <strong style="color: #d32f2f;">El Vándalo Grill</strong><br/>
            <span style="font-size: 12px;">Rápido, sabroso y brutal. 😎🔥</span>
          </p>
        </div>
      `
    };
  
    await transporter.sendMail(mailOptions);
  };
  