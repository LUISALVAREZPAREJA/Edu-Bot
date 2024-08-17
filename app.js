const { createBot, createProvider, createFlow, addKeyword, EVENTS, addAnswer } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const connectDB = require('./config/db');
const [getByNumber, getNameByNumber] = require('./controllers/userController')
const contextManager = require('./utils/contextManager');

connectDB();

const flowSecundario = addKeyword(['2', 'siguiente']).addAnswer(['📄 Aquí tenemos el flujo secundario'])

const flowDocs = addKeyword(['doc', 'documentacion', 'documentación']).addAnswer(
    [
        '📄 Aquí encontras las documentación recuerda que puedes mejorarla',
        'https://bot-whatsapp.netlify.app/',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)

const flowTuto = addKeyword(['tutorial', 'tuto']).addAnswer(
    [
        '🙌 Aquí encontras un ejemplo rapido',
        'https://bot-whatsapp.netlify.app/docs/example/',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)

const flowUsuarioNoRegistrado = addKeyword(['no-validacion',])
.addAnswer('🌤️🖐️Buenos días. \n'+
    'Bienvenido te comunicas con el area académica de Educate Para El Saber 📚 \n' +
    'Estoy aqui para ayudarte en lo que necesites, para mejorar tu experiencia por favor \n'+
    '✏️ *Escribe tu nombre y apellido* ✏️',
    {capture:true}, async(context, {flowDynamic})=>{
        const nombreApellido = context.body.trim();
        await flowDynamic([`😁Muchas gracias ${nombreApellido} \n` +
            'Necesito datos adicionales antes de continuar 😊, Por favor indica si eres:  \n' +
            ' *1.*🧑‍🎓 *Estudiante* \n' +
            ' *2.*👩‍👩‍👦 *Padre de familia* \n' +
            ' *3.*⁉️ *Otro* \n' ])
        
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
                    return gotoFlow(flowAsesor);
                } else {
                    await flowDynamic(['😥Lo siento, no entendí su opción. Por favor, elija una de las opciones proporcionadas.😅']);
                    return fallBack();
                }

})


   
const flowPrincipal = addKeyword(EVENTS.WELCOME)
    .addAction(null, async (context, {gotoFlow, flowDynamic}) => {
        const numero = context.from;
        const userBynumer = await getByNumber(numero);
        const userNameByNumber = await getNameByNumber(numero);

        if (userBynumer) {

            contextManager.setData('userName', userNameByNumber)
            const userName = contextManager.getData('userName');
            await flowDynamic([`🌤️🖐️Buenos días Profesor ${userName} \n` +
                'Para poder ayudarlo por favor escriba una de las siguientes opciones:  \n' +
                ' *1.*✅ *Cronograma* \n' +
                ' *2.*📰 *Cuenta de cobro* \n' +
                ' *3.*💸 *Informacion sobre pagos* \n' +
                ' *4.*👨‍💻 *Hablar con un asesor*'])

            return gotoFlow(flowUsuarioRegistrado);
        } else {
            return gotoFlow(flowUsuarioNoRegistrado);
        }
    });
    
     

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal, flowUsuarioRegistrado, flowUsuarioNoRegistrado])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
