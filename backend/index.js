const openai = require("langchain/llms/openai")
const { OpenAIApi, Configuration } = require("openai");
const hf1 = require("langchain/llms/hf")
const fs = require("fs")
const huggingface = require("@huggingface/inference")
const express = require('express')
const fileupload = require("express-fileupload");
const app = express()
const cors = require('cors')
const port = 3001
require('dotenv').config()
const hf = new huggingface.HfInference(apiKey = process.env.HF_HUB_KEY)
const pool = require('./db')
const axios = require('axios');
const path = require('path');
const generateJD = require('./JDGenerator/jdGenerator.js')
const nodemailer = require('nodemailer');
const generateQuestions = require('./JDGenerator/QuestionGenerator.js')
const insurancePolicies = require('./JDGenerator/InsuranceClaim/RawAssets/insurancePolicies.json');
var transform = require('./JDGenerator/InsuranceClaim/InsuranceQuotesTransformer.js')
var evaluateInsuranceValidity = require('./JDGenerator/InsuranceClaim/InsuranceClaimStatusProvider')
var portfolioSuggestions = require('./JDGenerator/PortFolioAnalyzer/PortfolioAnalyzer')
var getHigerLevelDistributionOverall = require('./JDGenerator/PortFolioAnalyzer/PortfolioAnalyzer')
var PortFolioAnalyzer = require('./JDGenerator/PortFolioAnalyzer/PortfolioAnalyzer')

var auditorApproval = false

var bodyParser = require('body-parser');


const multer = require('multer')

const expo = require('expo-server-sdk')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'images/')
    },
    filename: function (req, file, cb) {
      const ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
      cb(null, 'invoice_bill' + ext) //Appending .jpg
    }
  })
  
  var upload = multer({ storage: storage });
    
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
//app.use(express.json({ type: '*/*', strict: false }))




app.post('/startConsentFlow', async (req, res) => {
    console.log(req.body)
    try {
        const clientId = "eef2aad6-47bb-4d29-83e5-76f0c81b633a"
        const clientSecret = "LvbFpJE7bhKgbiFnQQj1FLNgWiXry1KF"
        const productInstanceId = "2b8f22ed-00b2-4874-b6ca-e4624d698b01"
        const vua = req.body['vua']

        const response = await fetch(
            'https://orgservice-prod.setu.co/v1/users/login',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'client': 'bridge'
                },
                body: JSON.stringify({
                    "clientID": clientId,
                    "secret": clientSecret,
                    "grant_type": "client_credentials"
                })
            }
        );
        const access_token = await response.json();
        
        if (access_token.access_token != undefined && access_token.access_token != null) {
            const response2 = await fetch(
                'https://fiu-uat.setu.co/v2/consents',
                {
                    method: 'POST',
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "x-client_id": clientId,
                        "x-client-secret": clientSecret,
                        "x-product-instance-id": productInstanceId,
                        "Authorization": "Bearer " + access_token.access_token
                    },
                    body: JSON.stringify({
                        "consentDuration": {
                            "unit": "MONTH",
                            "value": "24"
                        },
                        "vua": vua,
                        "dataRange": {
                            "from": "2022-12-01T00:00:00Z",
                            "to": "2023-08-12T00:00:00Z"
                        },
                        "dataLife": {
                            "value": 0,
                            "unit": "MONTH"
                        },
                        "context": []
                    })
                }
            );
            const resp = await response2.json();
            if (response2.ok) {
                console.log(resp)
                if (resp.url != undefined && resp.url != null) {
                    res.json(resp.url)
                } else {
                    res.status(400).send(resp)
                }
            } else {
                res.status(response.status).send(resp)
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

app.post('/shareConsent', async (req, res) => {

    let expo2 = new expo.Expo({ accessToken: 'M9woFNThWqII7KUKQCrxYBtvzb6_TGoh_XXIDq0y' });

    // Create the messages that you want to send to clients
    let messages = [];
    for (let pushToken of ['ExponentPushToken[o652-RCBi6ebvfQiFCr3W_]']) {
        // Check that all your push tokens appear to be valid Expo push tokens
        if (!expo.Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
            continue;
        }

        messages.push({
            to: pushToken,
            sound: 'default',
            title: 'Share Consent with Sairaj',
            body: 'To manage financial data',
            data: { withSome: 'data' },
        })
    }

    let chunks = expo2.chunkPushNotifications(messages);
    let tickets = [];
    (async () => {

        for (let chunk of chunks) {
            try {
                let ticketChunk = await expo2.sendPushNotificationsAsync(chunk);
                console.log(ticketChunk);
                tickets.push(...ticketChunk);
                res.status(200)

            } catch (error) {
                console.error(error);
                res.status(400)
            }
        }
    })();
})

app.post('/startKYCFlow', async (req, res) => {
    try {
        const clientId = "simplifiers-dg-sbx"
        const clientSecret = "QZFXMpPT4wCp4sh7VV8qp9TBKXI9tKQA"
        const productInstanceId = "4d09dd9c-3fd7-4293-8cb6-6d865be5f681"
        const defaultUrl = "https://dg-sandbox.setu.co/digilocker/login/c4e98cb3-df13-47f7-809a-107d5104d2fb?path=LzRkMDlkZDljLTNmZDctNDI5My04Y2I2LTZkODY1YmU1ZjY4MS8="

        const response = await fetch(
            'https://dg-sandbox.setu.co/api/digilocker/',
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "x-client_id": clientId,
                    "x-client-secret": clientSecret,
                    "x-product-instance-id": productInstanceId,
                },
                body: JSON.stringify({"redirectUrl": "https://dhansahayita.free.beeceptor.com"})
            }
        );
        const kycResponse = await response.json();
        console.log(kycResponse)
        
        if (kycResponse.url != undefined && kycResponse.url != null) {
            res.json({'url': kycResponse.url})
        } else {
            res.json({'url': defaultUrl})
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})
 
app.post('/summarizer', async (req, res) => {
    const response = await hf.summarization({
        model: 'faceb̀ook/bart-large-cnn',
        inputs: req.body['toSummarize'],
        parameters: {
            max_length: 100
        }
    })
    
    console.log(response)
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.json(response)
})

app.post('/ask', async (req, res) => {
    console.log("ask", req.body)
    let answerer = await hf.questionAnswer({
        model: 'deepset/roberta-base-squad2',
        inputs: {
            question: req.body['question'],
            context: 'The capital of France is Paris.'
        },
        parameters: {
            max_length: 100
        }
    });
    console.log(answerer)
    res.json({answer: answerer.answer})
})

app.post('/submitTest', async (req, res) => {
    console.log("submitTest", req.body)
    //todo: insert in db
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.json({
        "success": true
    })
})

app.post('/getScreeningQuestions', async (req, res) => {
    console.log("getScreeningQuestions", req.body)
    //todo: get from db
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.json({
        "questions": ["Name?", "Surname?"]
    })
})

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD
    }
});

app.post("/sample", async (req, res) => {
    console.log("sample", req.body)
    // const roles = await pool.query("SELECT * FROM requirements;");
    // console.log(roles.rows);
    res.json({"success": true})
});

app.post("/fetchInsurancePolicies", async (req, res) => {
    console.log("sample", req.body)
    res.json(insurancePolicies)
});

app.post("/rebalance", async (req, res) => {
    console.log("sample", req.body)
    res.send(PortFolioAnalyzer.rebalance())
});

app.post("/fetchDhanSahayitaRecos", async (req, res) => {
    console.log("fetchDhanSahayitaRecos", req.body)
    res.send(PortFolioAnalyzer.getDhansahayitaSuggestions())
});

app.post("/getOverallDistru", async (req, res) => {
    console.log("getOverallDistru", req.body)
    res.send(PortFolioAnalyzer.getOverallDistributionForPieChart())
});

app.post("/getMFDistru", async (req, res) => {
    console.log("getOverallDistru", req.body)
    res.send(PortFolioAnalyzer.getMutualFundByCapsAllotment())
});

app.post("/fetchSimplifiedInsurancePolicies", async (req, res) => {
    auditorApproval = false
    console.log("sample", req.body)
    res.json(JSON.stringify(transform(insurancePolicies)))
});


app.post("/getAuditorApproval", async (req, res) => {
    console.log("sample", req.body)
    res.send(auditorApproval)
});

app.post("/setAuditorApproval", async (req, res) => {
    auditorApproval = req.body.status
    console.log("sample", req.body)
    res.send(auditorApproval)
});

app.post("/evaluateInsuranceValidity", async (req, res) => {
    console.log("sample", JSON.stringify(await evaluateInsuranceValidity(req.body.a)))
    res.json(JSON.stringify(await evaluateInsuranceValidity(req.body.a)))
});

app.post('/upload', upload.single('upload'), (req , res) => {
    console.log("req")
    res.send()
});

app.post("/uploads", async (req, res) => {
    console.log("received file",)
});

app.post("/sendEmail", async (req, res) => {
    // const roles = await pool.query("SELECT * FROM sample;");
    // console.log(roles.rows);

    // const query = {
    //     text: 'INSERT INTO sample(name) VALUES($1)',
    //     values: ['shubham2'],
    // }
    // const insert = await pool.query(query)
    // console.log(insert)

    console.log("sendEmail", req.body)

    const mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: req.body.email,
        subject: req.body.title,
        text: 'Please login and attempt a test at http://localhost:3000/purity-ui-dashboard/#/admin/candidate/signin or take a video interview at http://localhost:3000/purity-ui-dashboard/#/admin/meet'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            // do something useful
        }
    })

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.json("done")
});


const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 }

app.use(cors())

app.post("/dbQuery", async (req, res) => {
    console.log("Shubham, I am here in DBQuery", req.body.query)

    const roles = await pool.query(req.body.query);
    console.log(roles);

    // const query = {
    //     text: 'INSERT INTO sample(name) VALUES($1)',
    //     values: ['shubham2'],
    // }
    // const insert = await pool.query(query)
    // console.log(insert)

    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.send(roles.rows)
});

app.post("/dbUpdate", async (req, res) => {
    console.log("Shubham, I am here in DBQuery", req.body.query)

    const roles = await pool.query(req.body.query);
    console.log(roles);

    // const query = {
    //     text: 'INSERT INTO sample(name) VALUES($1)',
    //     values: ['shubham2'],
    // }
    // const insert = await pool.query(query)
    // console.log(insert)

    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.send(roles.rows)
});

app.post("/generateQuestions", async (req, res) => {
    console.log("Shubham, I am here in DBQuery", req.body.candidateId)

    const data = await generateQuestions(req.body.candidateId)

    res.send({data})
});

app.get("/dbInsert", async (query, res) => {
    console.log("Shubham, I am here")
    const roles = await pool.query(query);
    console.log(roles);

    // const query = {
    //     text: 'INSERT INTO sample(name) VALUES($1)',
    //     values: ['shubham2'],
    // }
    // const insert = await pool.query(query)
    // console.log(insert)

    res.send("Inserted")
});

app.get("/jdgen", async (req, res) => {
    setTimeout(async function() {
        //your code to be executed after 1 second
      
    console.log("Shubham, I am here")

    const roles = await generateJD()


    res.json({ message: roles});
    }, 3000);
    //res.send("done")
});

app.post("/getPortfolioSuggestions", async (req, res) => {
    let riskType = req.body.riskType
    res.send(portfolioSuggestions(riskType))
    //res.send("done")
});

app.post("/getPortfolioShare", async (req, res) => {
    res.send(getHigerLevelDistributionOverall())
});

app.post("/getRebalanceActions", async (req, res) => {
    res.send(rebalance())
});

async function transcribeAudio(filePath) {
    const openai = new OpenAIApi(new Configuration({
        apiKey: process.env.OPEN_AI_KEY,
    }))

    const transcript = await openai.createTranscription(
        fs.createReadStream(filePath),
        "whisper-1"
    );
    return transcript.data.text;
}

app.post('/transcribe', async (req, res) => {
    // const audioUrl = 'https://cdn.filestackcontent.com/BEagwPgcS7ynYq80ZrgU';
    console.log(req.body)
    const audioUrl = req.body.audioUrl;
    const fileName = 'audioFile.mp3';
    const storagePath = path.join(__dirname, 'storage');
    const audiofilePath = path.join(storagePath, fileName);

    try {
        const response = await axios({
            method: 'GET',
            url: audioUrl,
            responseType: 'stream',
        });

        response.data.pipe(fs.createWriteStream(audiofilePath, { flags: 'a' }));

        response.data.on('end', async () => {
            const text = await transcribeAudio(audiofilePath)
            console.log(text)
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
            res.json({ 'transcribedText': text });
        });

    } catch (error) {
        console.error('Error downloading the file:', error.message);
        res.status(500).send('Error downloading the file.');
    }

});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

// hf.zeroShotClassification({
//     model: 'facebook/bart-large-mnli',
//     inputs:
//         "Candidate 1 - Based on the information provided in Nikhil Dupally's resume, he appears to be a potentially good fit for a Data Science role. He has several relevant skills and experiences that align with the requirements typically seen in data science positions. Here are some aspects that suggest his suitability,Candidate 2 - Based on the information provided in Gaurav's resume summary, he does not appear to have direct experience or qualifications specific to a Data Scientist role. As per the resume, his background and experience are more aligned with software development, particularly in backend development, Java, Spring Boot, and related technologies."
//     ,
//     parameters: {
//         candidate_labels: ['is_candidate_1_fit', 'is_candidate_2_fit'],
        
//     }
// }).then((res) => console.log(res))