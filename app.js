const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const app = express();
const fs = require('node:fs');
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 5000;
const email = process.env.USER_ID;

app.use(cors());
app.use(express.json({limit:"25mb"}));
app.use(express.urlencoded({limit:"25mb"}));
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    next();
})

function sendEmail({
    requesterEmail,
    comment,
    doorType,
    doorConfig,
    hingePos,
    isPaintedFinish,
    isGalvanizedFinish,
    isOtherFinish,
    otherFinish,
    isBoltOn,
    hasLockBar,
    mountingType,
    height,
    width,
    topClearance,
    bottomClearance,
    leftClearance,
    rightClearance
}){
    return new Promise((resolve,reject)=>{
        var transporter = nodemailer.createTransport({
            host: 'mail.smtp2go.com',
            //host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: email,
                pass: process.env.USER_PW
            },
        })

        const QuotePrice = 1500;

        const configtext = 
            doorType+";"+
            doorConfig+";"+
            hingePos+";"+
            isPaintedFinish+";"+
            isGalvanizedFinish+";"+
            isOtherFinish+";"+
            otherFinish+";"+
            isBoltOn+";"+
            hasLockBar+";"+
            mountingType+";"+
            height+";"+
            width+";"+
            topClearance+";"+
            bottomClearance+";"+
            leftClearance+";"+
            rightClearance;

        const mail_configs_client={
            from: email,
            to: requesterEmail,
            bcc: email,
            subject: "Access & Inspection Door Inquiry",
            text: "This is auto generated email, do not reply. Received your access & inspection door configuration, our sales representative will contact you shortly.",
            html: `<p>This is auto auto generated email, do not reply. Received your access & inspection door configuration, our sales representative will contact you shortly.</p>
            <p>Door Type: ${doorType}</p>
            <p>Door Configuration: ${doorConfig}</p>
            <p>Hinge Position: ${hingePos}</p>
            <p>Is Painted?: ${isPaintedFinish}</p>
            <p>Is Galvanized?: ${isGalvanizedFinish}</p>
            ${isOtherFinish?`<p>Other Finishing: ${otherFinish}</p>`:''}
            <p>Bolt-On Mesh: ${isBoltOn}</p>
            <p>Lock Bar at rear: ${hasLockBar}</p>
            <p>Mounting Type: ${mountingType}</p>
            <p>Opening Height(mm): ${height}</p>
            <p>Opening Width(mm): ${width}</p>
            <p>Top Clearance(mm): ${topClearance}</p>
            <p>Bottom Clearance(mm): ${bottomClearance}</p>
            <p>Left Clearance(mm): ${leftClearance}</p>
            <p>Right Clearance(mm): ${rightClearance}</p>
            <p>Comment: ${comment}</p>
            `,
            attachments:[
                {
                    filename:'aidoor.btgconfig',
                    content: configtext
                }
            ]
        }

        const mail_configs_sales={
            from: email,
            to: email,
            subject: "Access & Inspection Door Inquiry | Quotation",
            text: "This is auto auto generated email, do not reply. Access & Inspection Door request detail in attached.",
            html: `<p>This is auto auto generated email, do not reply. Access & Inspection Door request detail as below.</p>
            <p>Quote Price: $ ${QuotePrice}</p>
            <p>Door Type: ${doorType}</p>
            <p>Door Configuration: ${doorConfig}</p>
            <p>Hinge Position: ${hingePos}</p>
            <p>Is Painted?: ${isPaintedFinish}</p>
            <p>Is Galvanized?: ${isGalvanizedFinish}</p>
            ${isOtherFinish?`<p>Other Finishing: ${otherFinish}</p>`:''}
            <p>Bolt-On Mesh: ${isBoltOn}</p>
            <p>Lock Bar at rear: ${hasLockBar}</p>
            <p>Mounting Type: ${mountingType}</p>
            <p>Opening Height(mm): ${height}</p>
            <p>Opening Width(mm): ${width}</p>
            <p>Top Clearance(mm): ${topClearance}</p>
            <p>Bottom Clearance(mm): ${bottomClearance}</p>
            <p>Left Clearance(mm): ${leftClearance}</p>
            <p>Right Clearance(mm): ${rightClearance}</p>
            <p>Comment: ${comment}</p>
            `,
            attachments:[
                {
                    filename:'aidoor.btgconfig',
                    content: configtext
                }
            ]
        }

        transporter.sendMail(mail_configs_client,function(error,info){
            if(error){
                console.log(error);
                return reject({message: 'An error has occurred'});
            }
            return resolve({message: 'Email sent successfully'});
        })

        transporter.sendMail(mail_configs_sales,function(error,info){
            if(error){
                console.log(error);
            }
        })
    })
}

app.get("/",(req,res)=>{
    sendEmail()
    .then((response=>res.send(response.message)))
    .catch((error)=>res.status(500).send(error.message));
})

app.post("/send_email",(req,res)=>{
    sendEmail(req.body)
    .then((response=>res.send(response.message)))
    .catch((error)=>res.status(500).send(error.message));
})

app.listen(port,()=>{
    console.log(`nodemailerProject is listening at http://localhost:${port}`);
})