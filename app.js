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
    clientName,
    clientCompany,
    clientLocation,
    projectName,
    sDoorType,
    sDoorConfig,
    sHingePos,
    sIsPaintedFinish,
    sIsGalvanizedFinish,
    sIsOtherFinish,
    sOtherFinish,
    sIsBoltOn,
    sHasLockBar,
    sMountingType,
    sHeight,
    sWidth,
    sTopClearance,
    sBottomClearance,
    sLeftClearance,
    sRightClearance,
    comment,
    Images
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
            sDoorType+";"+
            sDoorConfig+";"+
            sHingePos+";"+
            sIsPaintedFinish+";"+
            sIsGalvanizedFinish+";"+
            sIsOtherFinish+";"+
            sOtherFinish+";"+
            sIsBoltOn+";"+
            sHasLockBar+";"+
            sMountingType+";"+
            sHeight+";"+
            sWidth+";"+
            sTopClearance+";"+
            sBottomClearance+";"+
            sLeftClearance+";"+
            sRightClearance;

        const  mail_configs_client={
            from: email,
            to: requesterEmail,
            bcc: email,
            subject: "Access & Inspection Door Inquiry",
            text: "This is auto generated email, do not reply. Received your access & inspection door configuration, our sales representative will contact you shortly.",
            html: `<p>This is auto auto generated email, do not reply. Received your access & inspection door configuration, our sales representative will contact you shortly.</p>
            <p>Project Name: ${projectName}</p>
            <p>Door Type: ${sDoorType}</p>
            <p>Door Configuration: ${sDoorConfig}</p>
            <p>Hinge Position: ${sHingePos}</p>
            <p>Is Painted?: ${sIsPaintedFinish}</p>
            <p>Is Galvanized?: ${sIsGalvanizedFinish}</p>
            ${sIsOtherFinish?`<p>Other Finishing: ${sOtherFinish}</p>`:''}
            <p>Bolt-On Mesh: ${sIsBoltOn}</p>
            <p>Lock Bar at rear: ${sHasLockBar}</p>
            <p>Mounting Type: ${sMountingType}</p>
            <p>Opening Height(mm): ${sHeight}</p>
            <p>Opening Width(mm): ${sWidth}</p>
            <p>Top Clearance(mm): ${sTopClearance}</p>
            <p>Bottom Clearance(mm): ${sBottomClearance}</p>
            <p>Left Clearance(mm): ${sLeftClearance}</p>
            <p>Right Clearance(mm): ${sRightClearance}</p>
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
            <p>Name: ${clientName}</p>
            <p>Company: ${clientCompany}</p>
            <p>Location: ${clientLocation}</p>
            <p>Project Name: ${projectName}</p>
            <p>Quote Price: $ ${QuotePrice}</p>
            <p>Door Type: ${sDoorType}</p>
            <p>Door Configuration: ${sDoorConfig}</p>
            <p>Hinge Position: ${sHingePos}</p>
            <p>Is Painted?: ${sIsPaintedFinish}</p>
            <p>Is Galvanized?: ${sIsGalvanizedFinish}</p>
            ${sIsOtherFinish?`<p>Other Finishing: ${sOtherFinish}</p>`:''}
            <p>Bolt-On Mesh: ${sIsBoltOn}</p>
            <p>Lock Bar at rear: ${sHasLockBar}</p>
            <p>Mounting Type: ${sMountingType}</p>
            <p>Opening Height(mm): ${sHeight}</p>
            <p>Opening Width(mm): ${sWidth}</p>
            <p>Top Clearance(mm): ${sTopClearance}</p>
            <p>Bottom Clearance(mm): ${sBottomClearance}</p>
            <p>Left Clearance(mm): ${sLeftClearance}</p>
            <p>Right Clearance(mm): ${sRightClearance}</p>
            <p>Comment: ${comment}</p>
            <p>Files attached: </p>
            ${Images.map((image)=>(
                    `<p href="${image}">${image}</p>`
                )
            )}
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