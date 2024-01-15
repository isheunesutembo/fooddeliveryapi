const nodemailer=require('nodemailer')
async function sendEmail(userEmail,message){

    const transporter=nodemailer.createTransport({
        service:"gmail",
        auth:{

        }
    })
    const mailOptions={
        from:process.env.AUTH_EMAIL,
        to:userEmail,
        subject:"Foodly Verification Code",
        html:`<h1>Foodly verification code</h1>
        <p>Your verification code is:</p>
        <h2 style="color:blue;">${message}</h2>
        <p>Please enter this code on the verification code to complete</p>
        <p>If you did not request this email ,please ignore this email</p>`
    }
    try{
       await transporter.sendMail(mailOptions)
       console.log('Verification email sent')
    }catch(error){
        console.log("Email sending failed with an error",error)

    }

}

module.exports=sendEmail;