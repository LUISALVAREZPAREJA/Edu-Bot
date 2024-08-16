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

const flowUsuarioNoRegistrado = addKeyword(['no-validacion','1']).addAnswer(
    [
        '🚀 Puedes aportar tu granito de arena a este proyecto',
        '[*opencollective*] https://opencollective.com/bot-whatsapp',
        '[*buymeacoffee*] https://www.buymeacoffee.com/leifermendez',
        '[*patreon*] https://www.patreon.com/leifermendez',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)
const flowUsuarioRegistrado = addKeyword('validacion-exitosa')
.addAction(null, async (context, {flowDynamic}) => {
    const userName = contextManager.getData('userName');    
    await flowDynamic([`🌤️🖐️Buenos días Profesor ${userName}`, 
        'Para poder ayudarlo por favor escriba una de las siguientes opciones:  \n'+
        ' *1.*✅ *Cronograma* \n'+
        ' *2.*📰 *Cuenta de cobro* \n'+
        ' *3.*💸 *Informacion sobre pagos* \n'+
        ' *4.*👨‍💻 *Hablar con un asesor*'],
        
    )
});
   
const flowPrincipal = addKeyword(EVENTS.WELCOME)
    .addAction(null, async (context, {gotoFlow}) => {
        const numero = context.from;
        const userBynumer = await getByNumber(numero);
        const userNameByNumber = await getNameByNumber(numero);

        if (userBynumer) {

            contextManager.setData('userName', userNameByNumber)
            contextManager.setData('otherInfo', userBynumer)

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
