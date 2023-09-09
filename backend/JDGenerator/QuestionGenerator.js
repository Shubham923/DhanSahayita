
const { OpenAIApi, Configuration, CreateAnswerRequest } = require("openai");
const { JD_RAW, requirements, QUESTIONS_RAW, QUESTIONS_RAW_GAP } = require('./rawData.js')


async function generateQuestions() {

    console.log("Reached here")

    const openai = new OpenAIApi(new Configuration({
        apiKey: process.env.OPEN_AI_KEY,
    }))

    var output =  JD_RAW

    let payload = {
        "documents": "[]",
        question: "Generate HR Questions for role of ${role} with ${tech stack}",
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

     return text

}

async function generateQuestionsV1(name) {

    console.log("Reached here", name)

    const openai = new OpenAIApi(new Configuration({
        apiKey: process.env.OPEN_AI_KEY,
    }))

    var output =  QUESTIONS_RAW

    if(name === "Nikhil Dupally") {
        output = QUESTIONS_RAW_GAP
    }


     console.log(output)
     return output

}

module.exports = generateQuestionsV1;