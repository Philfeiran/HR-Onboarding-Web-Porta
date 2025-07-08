import emailjs from '@emailjs/browser';


console.log(import.meta.env.VITE_EMAILJS_Public_Key);
emailjs.init(import.meta.env.VITE_EMAILJS_Public_Key);
console.log(import.meta.env.VITE_EMAILJS_Public_Key);


interface EmailParams{
    email:string;
    name:string;
    url:string;
}


export async function sendEmail(params:EmailParams):Promise<void>{
    const {name,url,email} = params;
    try{
        await emailjs.send(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
            {
                
                name
                ,link:url
                ,email
            },
            // import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        )
    }catch(error){
        console.error('Error sending email:', error);
        throw error;
    }
}