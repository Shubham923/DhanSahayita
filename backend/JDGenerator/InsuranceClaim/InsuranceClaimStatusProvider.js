const insurancePolicies = require('../InsuranceClaim/RawAssets/insurancePolicies.json');
var transform = require('./InsuranceQuotesTransformer.js')
var getTextFromPDF = require('./InsuranceBillProcessor.js')


let insuranceStatus = {}

async function evaluateInsuranceValidity(type) {
    let quotes = transform(insurancePolicies)
    return await evaluateQuote(quotes[0])
}


async function evaluateQuote(quote) {
    var error = ''
    var valid = true
    console.log(quote)
    let billDetails = await getTextFromPDF('/Users/sairaj.sawant/Downloads/react-native-paper-example_v5/backend/images/invoice_bill.pdf')
    let billDetailsJson = JSON.parse(JSON.stringify(billDetails))

    if(billDetailsJson.patient_name == quote.name) {
        console.log('match')
    } else {
        valid = false
        console.log('unmatch', billDetailsJson.patient_name, quote.name)
    }

    if(parseFloat(billDetailsJson.total_amount) < quote.remainingSum) {
        console.log('valid', billDetailsJson.total_amount, quote.remainingSum)
    } else {
        valid = false
        error = 'Available Balance is less than actual bill amount. You may get partial reimbursement subject to Auditor approval'
        console.log('invalid', billDetailsJson.total_amount, quote.remainingSum)
    }

    let statementDate = new Date(billDetailsJson.statement_state)

    let policyStartDate = new Date(quote.policyStartDate)

    let policyEndDate = new Date(quote.policyEndDate)


    if(statementDate >= policyStartDate && statementDate <= policyEndDate) {
        console.log('valid statement')
    } else {
        valid = false
        error = 'Statement date is obsolute.'
        console.log('invalid statement')
    }


    console.log(statementDate, policyStartDate, policyEndDate)

    return {
        isValid: valid,
        error: error,
        policyDetails: quote,
        billDetails: billDetailsJson
    }

}

module.exports = evaluateInsuranceValidity