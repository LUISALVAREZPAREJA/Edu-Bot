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

const flowEstudiante = addKeyword(['tutorial', 'tuto']).addAnswer(
    [
       'hola'
    ]
)

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
            'Estoy aqui para ayudarte en lo que necesites, para mejorar tu experiencia' +
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
                    return gotoFlow(flowAsesor);
                } else {
                    await flowDynamic(['😥Lo siento, no entendí su opción. Por favor, elija una de las opciones proporcionadas.😅']);
                    return fallBack();
                }

})


   
const flowPrincipal = addKeyword(EVENTS.WELCOME)
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
    
     

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal, flowUsuarioRegistrado, flowUsuarioNoRegistrado,
        flowOpcionesNoRegistrado, flowEstudiante
    ])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
