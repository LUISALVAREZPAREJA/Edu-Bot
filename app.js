const { createBot, createProvider, createFlow, addKeyword, EVENTS, addAnswer } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const connectDB = require('./config/db');
const [getByNumber, getNameByNumber] = require('./controllers/userController')
const contextManager = require('./utils/contextManager');
const { captureEventStream } = require('@whiskeysockets/baileys');

connectDB();


const flowMaterialPedagogico = addKeyword(['Material'])
.addAnswer('En este modulo encontraras tu material de trabajo segun la institucion a la que has sido pogramado: \n'+
'1.📘 *CARTILLA TRASO 2024*\n'+
'2.📚 *TEXTO SABER LAB:*\n'+ 
'3.🔙 *Volver al menú anterior*', {capture:true}, async (context, {gotoFlow, fallBack, flowDynamic})=>{
    const opcion = context.body
    if (opcion === '1') {
        flowDynamic(['*TEXTO SABER LAB:*\n https://grupoeducatecolombia.com/home \n USUARIO: pre-icfes@educate.com\n CONTRASEÑA: 420240711'])  
        return gotoFlow(flowDespedida)
    } else if(opcion ==='2'){
        flowDynamic(['*FISICA: *\nhttps://drive.google.com/file/d/1au-Q38ri6HiE-Lxhbthhatnr0qhIqpr4/view?usp=sharing \n\n'+
'*SOCIALES: *\nhttps://drive.google.com/file/d/1SnbZIzHGMghg0edPlwzixqt0bZ-bKk70/view?usp=sharing \n\n'+
'*LECTURA: *\nhttps://drive.google.com/file/d/1DgbpViEfYSt4DD271272in7tu0VJOkUF/view?usp=sharing \n\n'+
'*INGLES: *\nhttps://drive.google.com/file/d/1GVSEByWeuUXrfi58qj4ghA3GAEaq61oV/view?usp=sharing \n\n'+
'*MATEMATICAS: *\nhttps://drive.google.com/file/d/1I1JSgye4ja6Zdc1osvbL7RDy2-dC-Y9A/view?usp=sharing\n\n'+
'*BIOLOGIA: *\nhttps://drive.google.com/file/d/1_-jWJLDYMF_oH8zfFLaRUvu4DxUX2wRa/view?usp=sharing\n\n'+
'*QUIMICA: *\nhttps://drive.google.com/file/d/1ISkEYA2nzcM_RaUeGxVxy9_ZFDgoKgcM/view?usp=sharing\n\n'])
        return gotoFlow(flowDespedida)
    }else if(opcion ==='3'){
        return gotoFlow(flowUsuarioRegistrado)
    } else{
        await flowDynamic(['😥Lo siento, no entendí su opción. Por favor, elija una de las opciones proporcionadas.😅']);
        return fallBack();
    }
})

const flowDespedida = addKeyword('chao')
.addAnswer('espero haberte ayudado😊')

const flowAsesorAcademico = addKeyword(['Asesor'])
.addAction(null, async (context, { provider, flowDynamic, gotoFlow}) => {
    const asesorAcademico = '573004430289';
    const nombreApellido = context.pushName;
    const numero = context.from.substring(2);
    const mensajeAsesor = `❗❗❗El usuario ${nombreApellido} ${numero} desea hablar con un asesor😁.`;

    try {
        await provider.sendText(asesorAcademico + '@s.whatsapp.net', mensajeAsesor)
        await flowDynamic(['En breve un asesor se pondra en contacto con usted🧑‍💼'])
        return gotoFlow(flowDespedida)
    } catch (error) {
        console.error("Error al enviar el mensaje al asesor:", error);
    }

})

const flowPagosPadres = addKeyword(['AsesorAdministrativo'])
.addAction(null, async (context, { provider, flowDynamic, gotoFlow}) => {
    const asesorAdministrativo = '573004430289';
    const nombreApellido = context.pushName;
    const numero = context.from.substring(2);
    const mensajeAsesor = `❗❗❗el usuario ${nombreApellido} ${numero} desea hablar con un asesor😁.`;

    try {
        await provider.sendText(asesorAdministrativo + '@s.whatsapp.net', mensajeAsesor);
            await flowDynamic(['En breve un asesor se pondra en contacto con usted🧑‍💼'])
            return gotoFlow(flowDespedida)
    } catch (error) {
        console.error("Error al enviar el mensaje al asesor:", error);
    }

})


const flowSecundario = addKeyword(['disculpas'])
.addAnswer('😖Lo sentimos este modulo aun no esta habilitado.😞 \n 1.🔙 *Volver al menú anterior*', {capture:true}, async (context, {gotoFlow, fallBack, flowDynamic})=>{
        const opcion = context.body
        if (opcion === '1') {
            return gotoFlow(flowEstudiante)
        } else{
            await flowDynamic(['😥Lo siento, no entendí su opción. Por favor, elija una de las opciones proporcionadas.😅']);
            return fallBack();
        }
    }

)

const flowSecundarioProfesor = addKeyword(['disculpas'])
.addAnswer('Selecciona una opcion: 😁 \n 1.🔙 *Volver al menú anterior*', {capture:true}, async (context, {gotoFlow, fallBack, flowDynamic})=>{
        const opcion = context.body
        if (opcion === '1') {
            return gotoFlow(flowUsuarioRegistrado)
        } else{
            await flowDynamic(['😥Lo siento, no entendí su opción. Por favor, elija una de las opciones proporcionadas.😅']);
            return fallBack();
        }
    }

)

const flowSecundarioOtro = addKeyword(['disculpas'])
.addAnswer('😖Lo sentimos este modulo aun no esta habilitado.😞 \n 1.🔙 *Volver al menú anterior*', {capture:true}, async (context, {gotoFlow, fallBack, flowDynamic})=>{
        const opcion = context.body
        if (opcion === '1') {
            return gotoFlow(flowOtro)
        } else{
            await flowDynamic(['😥Lo siento, no entendí su opción. Por favor, elija una de las opciones proporcionadas.😅']);
            return fallBack();
        }
    }

)

const flowCertificados = addKeyword(['Certificados'])
.addAnswer('😊Por favor escribe el certificado que necesitas para continuar \n',
    {capture: true}, async (context, {provider, flowDynamic, gotoFlow})=>{
        const asesorContable = '573004430289';
        const nombreApellido = context.pushName;
        const mensaje = context.body;
        const numero = context.from.substring(2);
        const mensajeAsesor = `❗❗❗El usuario ${nombreApellido} ${numero} desea ${mensaje}😁.`;
    
        try {
            await provider.sendText(asesorContable + '@s.whatsapp.net', mensajeAsesor)
            await flowDynamic(['En breve un asesor se pondra en contacto con usted🧑‍💼'])
            return gotoFlow(flowDespedida)
        } catch (error) {
            console.error("Error al enviar el mensaje al asesor:", error);
        }
        
    
    })

    const flowPagos = addKeyword(['Pagos'])
.addAnswer('😊En esta seccion encontraras toda la informacion acerca de los pagos. Tambien recuerda que la fecha limite para el envio de la cuenta de cobro son los dias: \n'+
    '*5 y 20 de cada mes y los pagos se verán reflejaran como maximo tres dias despues del envio de la cuenta de cobro*, la velocidad de respuesta depende de el envio de esta misma. \n'+
    '1.📃 *Cuenta de cobro* \n'+
    '2.🧑‍💼 *Habla con un asesor* \n' +
    '3.🔙 *Volver al menú anterior*' ,
    {capture: true}, async (context, {provider, flowDynamic, gotoFlow, fallBack})=>{
        const asesorPagos = '573142786639';
        const nombreApellido = context.pushName;
        const mensaje = context.body;
        const numero = context.from.substring(2);
        const mensajeAsesor = `❗❗❗El usuario ${nombreApellido} ${numero} desea Informacion sobre pagos😁.`;

        if (mensaje === '1') {
            await flowDynamic(['Aqui podra descargar su cuenta de cobro: https://drive.google.com/file/d/1GmoTwpkgtXP1naQBSIBPX5iq1r3tcImt/view?usp=sharing'])
            return gotoFlow(flowDespedida)
        } else if (mensaje === '2') {
        try {
            await provider.sendText(asesorPagos + '@s.whatsapp.net', mensajeAsesor);
            await flowDynamic(['En breve un asesor se pondra en contacto con usted🧑‍💼'])
            return gotoFlow(flowDespedida)
        } catch (error) {
            console.error("Error al enviar el mensaje al asesor:", error);
        }
        } else if (mensaje === '3'){
            return gotoFlow(flowUsuarioRegistrado)
        } else {
            await flowDynamic(['😥Lo siento, no entendí su opción. Por favor, elija una de las opciones proporcionadas.😅']);
                    return fallBack();
        }
    
    })

const flowOpcionesEstudiante = addKeyword('validacion-exitosa')
.addAnswer('📚 *Por favor digite un numero* 📚',{capture:true}, async (context ,{fallBack,flowDynamic,gotoFlow})=>{
    
    const mensaje = context.body.trim();
                
                if (mensaje === '1') {
                    return gotoFlow(flowSecundario);
                } else if (mensaje === '2') {
                    return gotoFlow(flowSecundario);
                } else if (mensaje === '3') {
                    return gotoFlow(flowCertificados);
                } else if (mensaje === '4') {
                    return gotoFlow(flowSecundario);
                } else if (mensaje === '5') {
                    return gotoFlow(flowUsuarioNoRegistrado);
                } else if (mensaje === '6') {
                    return gotoFlow(flowAsesorAcademico);        
                } else {
                    await flowDynamic(['😥Lo siento, no entendí su opción. Por favor, elija una de las opciones proporcionadas.😅']);
                    return fallBack();
                }

})

const flowOpcionesPadre = addKeyword('validacion-exitosa')
.addAnswer('📚 *Por favor digite un numero* 📚',{capture:true}, async (context ,{fallBack,flowDynamic,gotoFlow})=>{
    
    const mensaje = context.body.trim();
                
                if (mensaje === '1') {
                    return gotoFlow(flowSecundario);
                } else if (mensaje === '2') {
                    return gotoFlow(flowSecundario);
                } else if (mensaje === '3') {
                    return gotoFlow(flowCertificados);
                } else if (mensaje === '4') {
                    return gotoFlow(flowSecundario);
                } else if (mensaje === '5') {
                    return gotoFlow(flowUsuarioNoRegistrado);
                } else if (mensaje === '6') {
                    return gotoFlow(flowPagosPadres); 
                }else if (mensaje === '7') {
                    return gotoFlow(flowAsesorAcademico);        
                } else {
                    await flowDynamic(['😥Lo siento, no entendí su opción. Por favor, elija una de las opciones proporcionadas.😅']);
                    return fallBack();
                }

})

const flowOpcionesOtro = addKeyword('validacion-exitosa')
.addAnswer('📚 *Por favor digite un numero* 📚',{capture:true}, async (context ,{fallBack,flowDynamic,gotoFlow})=>{
    
    const mensaje = context.body.trim();
                
                if (mensaje === '1') {
                    return gotoFlow(flowSecundarioOtro);
                } else if (mensaje === '2') {
                    return gotoFlow(flowUsuarioNoRegistrado);
                } else if (mensaje === '3') {
                    return gotoFlow(flowPagosPadres);        
                } else if (mensaje === '4') {
                    return gotoFlow(flowAsesorAcademico);
                }else{
                    await flowDynamic(['😥Lo siento, no entendí su opción. Por favor, elija una de las opciones proporcionadas.😅']);
                    return fallBack();
                }

})

const flowEstudiante = addKeyword(['estudiante'])
.addAction(null, async (context, {flowDynamic, gotoFlow})=>{
const nombreApellido = context.pushName;
await flowDynamic([`${nombreApellido}, por favor selecciona la opcion que necesites: \n`+
    '1.📃 *Resultados* \n'+
    '2.📆 *Cronograma de clases* \n'+
    '3.📝 *Certificados* \n'+
    '4.❓ *Informacion de Cursos* \n'+
    '5.🔙 *Volver al menu anterior* \n'+
    '6.🧑‍💼 *Habla con un asesor*' 
])
return gotoFlow(flowOpcionesEstudiante)

})

const flowPadreFamilia = addKeyword(['Padre'])
.addAction(null, async (context, {flowDynamic, gotoFlow})=>{
const nombreApellido = context.pushName;
await flowDynamic([`${nombreApellido}, por favor selecciona la opcion que necesites: \n`+
    '1.📃 *Resultados* \n'+
    '2.📆 *Cronograma de clases* \n'+
    '3.📝 *Certificados* \n'+
    '4.❓ *Informacion de Cursos* \n'+
    '5.🔙 *Volver al menu anterior* \n'+
    '6.💸 *Informacion sobre pagos* \n' +
    '7.🧑‍💼 *Habla con un asesor*' 
])
return gotoFlow(flowOpcionesPadre)

})

const flowOtro = addKeyword(['Otro'])
.addAction(null, async (context, {flowDynamic, gotoFlow})=>{
const nombreApellido = context.pushName;
await flowDynamic([`${nombreApellido}, por favor selecciona la opcion que necesites: \n`+
    '1.❓ *Informacion de Cursos* \n'+
    '2.🔙 *Volver al menu anterior* \n'+
    '3.💸 *Informacion sobre pagos* \n' +
    '4.🧑‍💼 *Habla con un asesor*' 
])
return gotoFlow(flowOpcionesOtro)

})

const flowOpcionesNoRegistrado = addKeyword('validacion-exitosa')
.addAnswer('📚 *Por favor digite un numero* 📚',{capture:true}, async (context ,{fallBack,flowDynamic,gotoFlow})=>{
    
    const mensaje = context.body.trim();
                
                if (mensaje === '1') {
                    return gotoFlow(flowEstudiante);
                } else if (mensaje === '2') {
                    return gotoFlow(flowPadreFamilia);
                } else if (mensaje === '3') {
                    return gotoFlow(flowOtro);
                } else {
                    await flowDynamic(['😥Lo siento, no entendí su opción. Por favor, elija una de las opciones proporcionadas.😅']);
                    return fallBack();
                }

})

const flowUsuarioNoRegistrado = addKeyword(['no-validacion',])
.addAction(
   async(context, {flowDynamic, gotoFlow})=>{
        const nombreApellido = context.pushName;
                const now = new Date(Date.now());
        const currentHour = now.getHours();
        let mensaje=""
        if (currentHour<12){
            mensaje="días"
        }else if(currentHour<18){
        mensaje="tardes"
        }else{
        mensaje="noches"
        }

                await flowDynamic([`Buenos ${mensaje} ${nombreApellido} \n` +
                    'Te comunicas con el area académica de Educate Para El Saber 📚 \n' +
                    'Mi nombre es 🤖 *Edu-Bot* 🤖 y estoy aqui para ayudarte en lo que necesites, para mejorar tu experiencia ' +
                    'Necesito datos adicionales antes de continuar, Por favor indica si eres:  \n' +
                    ' *1.*🧑‍🎓 *Estudiante* \n' +
                    ' *2.*👩‍👩‍👦 *Padre de familia* \n' +
                    ' *3.*⁉️ *Otro* \n' ])
                    return gotoFlow(flowOpcionesNoRegistrado);
                
            } 
            
        )


const flowOpcionesRegistrado = addKeyword('validacion-exitosa')
.addAnswer('📚 *Por favor digite un numero* 📚',{capture:true}, async (context ,{fallBack,flowDynamic,gotoFlow})=>{
    
    const mensaje = context.body.trim();
                
                if (mensaje === '1') {
                    return gotoFlow(flowSecundarioProfesor);
                } else if (mensaje === '2') {
                    return gotoFlow(flowMaterialPedagogico);
                } else if (mensaje === '3') {
                    return gotoFlow(flowPagos);
                } else if (mensaje === '4') {
                    return gotoFlow(flowAsesorAcademico);
                } else {
                    await flowDynamic(['😥Lo siento, no entendí su opción. Por favor, elija una de las opciones proporcionadas.😅']);
                    return fallBack();
                }

})

const flowUsuarioRegistrado = addKeyword(['no-validacion',])
.addAction(
   async(context, {flowDynamic, gotoFlow})=>{
        const numero = context.from;
        const userNameByNumber = await getNameByNumber(numero);
        const now = new Date(Date.now());
        const currentHour = now.getHours();
        let mensaje=""
        if (currentHour<12){
            mensaje="días"
        }else if(currentHour<18){
        mensaje="tardes"
        }else{
        mensaje="noches"
        }
        contextManager.setData('userName', userNameByNumber)
        const userName = contextManager.getData('userName');
        await flowDynamic([`Buenos ${mensaje} ${userName}, mi nombre es 🤖 *Edu-Bot* 🤖 y estoy aqui para ayudarte en lo que necesites.\n` +
            'Para poder ayudarlo por favor escriba una de las siguientes opciones:  \n' +
            ' *1.*✅ *Cronograma* \n' +
            ' *2.*📰 *Material Pedagogico* \n' +
            ' *3.*💸 *Informacion sobre pagos* \n' +
            ' *4.*👨‍💻 *Hablar con un asesor*'])
                return gotoFlow(flowOpcionesRegistrado)
            } 
            
        )


   
const flowPrincipal = addKeyword(EVENTS.WELCOME)
    .addAction(null, async (context, {gotoFlow, flowDynamic}) => {
        const numero = context.from;
        console.log(numero);
        const userBynumer = await getByNumber(numero);
       if (userBynumer) {
            return gotoFlow(flowUsuarioRegistrado);
        } else {
            return gotoFlow(flowUsuarioNoRegistrado);
        }
    });
    
     

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal, flowUsuarioRegistrado, flowUsuarioNoRegistrado,
        flowOpcionesNoRegistrado, flowEstudiante, flowOpcionesEstudiante, flowSecundario, flowCertificados,flowAsesorAcademico,flowPadreFamilia,flowOtro,
        flowOpcionesPadre,flowPagos,flowSecundarioProfesor,flowOpcionesRegistrado,flowPagosPadres,flowOpcionesOtro,flowSecundarioOtro,flowMaterialPedagogico
    ])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    },
    {
        globalState: {
          encendido: true,
        }
    }    
)

    QRPortalWeb()
}

main()
