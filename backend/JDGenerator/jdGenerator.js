
const { OpenAIApi, Configuration, CreateAnswerRequest } = require("openai");
const { JD_RAW, requirements } = require('./rawData.js')


async function generateJobDescription() {

    console.log("Reached here")

    const openai = new OpenAIApi(new Configuration({
        apiKey: process.env.OPEN_AI_KEY,
    }))

    var output =  JD_RAW

    let payload = {
        "documents": "[]",
        question: "Generate Job Description for role of ${role} with ${tech stack}",
        "search_model": "ada",
        "model": "ada",
        "examples_context": "",
        "examples": "",
        "max_tokens": "20"
     }

     const text = await openai.createAnswer(
        payload
     )

     console.log(text)
     return output

}

async function generateJD() {

    console.log("Reached here")

    const openai = new OpenAIApi(new Configuration({
        apiKey: process.env.OPEN_AI_KEY,
    }))

    var output =  JD_RAW


     console.log(output)
     return output

}

module.exports = generateJD;