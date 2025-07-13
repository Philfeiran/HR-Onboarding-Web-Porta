import emailjs from '@emailjs/nodejs';
import { config } from '@src/config/loadConfig';


// console.log(import.meta.env.VITE_EMAILJS_Public_Key);
// emailjs.init(import.meta.env.VITE_EMAILJS_Public_Key);
// console.log(import.meta.env.VITE_EMAILJS_Public_Key);

if (!config.emailjsPublicKey) {
    throw new Error('EMAILJS_PUBLIC_KEY environment variable is not set');
}
emailjs.init({
    publicKey: config.emailjsPublicKey,
    privateKey: config.emailjsPrivateKey
});


interface EmailParams{
    email:string;
    name:string;
    url:string;
}


export async function sendEmail(params:EmailParams):Promise<void>{
    const {name,url,email} = params;
    
    if (!config.emailjsServiceId) {
        throw new Error('EMAILJS_SERVICE_ID environment variable is not set');
    }
    if (!config.emailjsTemplateId) {
        throw new Error('EMAILJS_TEMPLATE_ID environment variable is not set');
    }
    
    try{
        await emailjs.send(
            // import.meta.env.VITE_EMAILJS_SERVICE_ID,
            config.emailjsServiceId,
            // import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
            config.emailjsTemplateId,
            {
                
                name
                ,link:url
                ,email
            },
            {
                publicKey:config.emailjsPublicKey
                ,privateKey:config.emailjsPrivateKey
            }
            // import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        )
    }catch(error){
        console.error('Error sending email:', error);
        throw error;
    }
}