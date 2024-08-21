const { createBot, createProvider, createFlow, addKeyword, EVENTS, addAnswer } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const connectDB = require('./config/db');
const [getByNumber, getNameByNumber] = require('./controllers/userController')
const contextManager = require('./utils/contextManager');
const { captureEventStream } = require('@whiskeysockets/baileys');

connectDB();

const flowDespedida = addKeyword('chao')
.addAnswer('espero haberte ayudado')

const flowAsesorAcademico = addKeyword(['Asesor'])
.addAction(null, async (context, { provider}) => {
    const asesorAcademico = '573004430289';
    const nombreApellido = context.pushName;
    const numero = context.from.substring(2);
    const mensajeAsesor = `❗❗❗El usuario ${nombreApellido} ${numero} desea hablar con un asesor😁.`;

    try {
        await provider.sendText(asesorAcademico + '@s.whatsapp.net', mensajeAsesor);
    } catch (error) {
        console.error("Error al enviar el mensaje al asesor:", error);
    }

}).addAnswer('En breve un asesor se pondra en contacto con usted...', {capture:true}, async (context, {gotoFlow})=>{
    const mensaje = context;
    if (mensaje) {
        return gotoFlow(flowDespedida)
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

const flowCertificados = addKeyword(['Certificados'])
.addAnswer('😊Por favor escribe el certificado que necesitas para continuar \n',
    {capture: true}, async (context, {provider, flowDynamic})=>{
        const asesorContable = '573004430289';
        const nombreApellido = context.pushName;
        const mensaje = context.body;
        const numero = context.from.substring(2);
        const mensajeAsesor = `❗❗❗El usuario ${nombreApellido} ${numero} desea ${mensaje}😁.`;
    
        try {
            await provider.sendText(asesorContable + '@s.whatsapp.net', mensajeAsesor);
            await flowDynamic ([''])
        } catch (error) {
            console.error("Error al enviar el mensaje al asesor:", error);
        }
        
        if (condition) {
            
        }
    
    });


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

const flowOpcionesNoRegistrado = addKeyword('validacion-exitosa')
.addAnswer('📚 *Por favor digite un numero* 📚',{capture:true}, async (context ,{fallBack,flowDynamic,gotoFlow})=>{
    
    const mensaje = context.body.trim();
                
                if (mensaje === '1') {
                    return gotoFlow(flowEstudiante);
                } else if (mensaje === '2') {
                    return gotoFlow(flowCuentaCobro);
                } else if (mensaje === '3') {
                    return gotoFlow(flowInformacionPagos);
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

        await flowDynamic([`🌤️🖐️Buenos ${mensaje} ${nombreApellido} \n` +
            'Te comunicas con el area académica de Educate Para El Saber 📚 \n' +
            'Estoy aqui para ayudarte en lo que necesites, para mejorar tu experiencia \n' +
            'Necesito datos adicionales antes de continuar 😊, Por favor indica si eres:  \n' +
            ' *1.*🧑‍🎓 *Estudiante* \n' +
            ' *2.*👩‍👩‍👦 *Padre de familia* \n' +
            ' *3.*⁉️ *Otro* \n' ])
            return gotoFlow(flowOpcionesNoRegistrado);
        
    } 
    
)


const flowUsuarioRegistrado = addKeyword('validacion-exitosa')
.addAnswer('📚 *Por favor digite un numero* 📚',{capture:true}, async (context ,{fallBack,flowDynamic,gotoFlow})=>{
    
    const mensaje = context.body.trim();
                
                if (mensaje === '1') {
                    return gotoFlow(flowTuto);
                } else if (mensaje === '2') {
                    return gotoFlow(flowCuentaCobro);
                } else if (mensaje === '3') {
                    return gotoFlow(flowInformacionPagos);
                } else if (mensaje === '4') {
                    return gotoFlow(flowAsesorAcademico);
                } else {
                    await flowDynamic(['😥Lo siento, no entendí su opción. Por favor, elija una de las opciones proporcionadas.😅']);
                    return fallBack();
                }

})


   
const flowPrincipal = addKeyword(['Hola','hola','ola'])
    .addAction(null, async (context, {gotoFlow, flowDynamic}) => {
        const numero = context.from;
        console.log(numero);
        const userBynumer = await getByNumber(numero);
        const userNameByNumber = await getNameByNumber(numero);
        if (userBynumer) {

            contextManager.setData('userName', userNameByNumber)
            const userName = contextManager.getData('userName');
            await flowDynamic([`🌤️🖐️Buenos días Profesor ${userName} \n` +
                'Para poder ayudarlo por favor escriba una de las siguientes opciones:  \n' +
                ' *1.*✅ *Cronograma* \n' +
                ' *2.*📰 *Material Pedagogico* \n' +
                ' *3.*💸 *Informacion sobre pagos* \n' +
                ' *4.*👨‍💻 *Hablar con un asesor*'])

            return gotoFlow(flowUsuarioRegistrado);
        } else {
            return gotoFlow(flowUsuarioNoRegistrado);
        }
    });
    
    const flowBienvenida = addKeyword(EVENTS.WELCOME)
    .addAnswer('Bienvenido mi nombre es 🤖 *Edu-Bot * 🤖 y estoy aqui para ayudarte en lo que necesites.\n'+
        'Para continuar por favor selecciona: \n *1.*⏭️ *Iniciar* ')
    .addAnswer('📚 *Por favor digite un numero* 📚', {capture:true}, async (context, {gotoFlow, flowDynamic, fallBack})=>{
            const mensaje = context.body
            if (mensaje === '1') {
                return gotoFlow(flowPrincipal)
            }else{
                await flowDynamic(['😥Lo siento, no entendí su opción. Por favor escribe *Iniciar*.😅']);
                    return fallBack();
            }
        }
    )
     

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowBienvenida,flowPrincipal, flowUsuarioRegistrado, flowUsuarioNoRegistrado,
        flowOpcionesNoRegistrado, flowEstudiante, flowOpcionesEstudiante, flowSecundario, flowCertificados,flowAsesorAcademico
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
