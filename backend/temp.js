const insurancePolicies = require('./JDGenerator/InsuranceClaim/RawAssets/insurancePolicies.json');
var transform = require('./JDGenerator/InsuranceClaim/InsuranceQuotesTransformer.js')
var PortFolioAnalyzer = require('./JDGenerator/PortFolioAnalyzer/PortfolioAnalyzer')


const fs = require('fs');
const fileName = './JDGenerator/PortFolioAnalyzer/RawAssets/newPortfolio.json';
const file = require(fileName);

var updatedJson = '{"profile":{"name":"Shubham Shinde","age":25,"type":"mutual_funds","masked_account_number":"XXXXXXX123","link_ref_number":"123456789","totalPortfolio":34000,"salary":200000},"summary":{"mutual_funds":[{"FatcaStatus":"YES","rate":5,"name":"Mirae Assets Mutual Funds","portfolioAmount":10000,"investedAmount":900,"type":"LARGE_CAP","id":"MF101","selfType":"mutual_funds"},{"FatcaStatus":"YES","rate":5,"name":"Blue Chip Mutual Funds","portfolioAmount":222000,"investedAmount":20000,"type":"LARGE_CAP","id":"MF102","selfType":"mutual_funds"},{"FatcaStatus":"YES","rate":5,"name":"Parag Parikh Mutual Funds","portfolioAmount":112000,"investedAmount":10000,"type":"LARGE_CAP","mfType":"ELSS","id":"MF103","selfType":"mutual_funds"}],"stocks":[{"FatcaStatus":"YES","name":"JSW","portfolioAmount":13000,"investedAmount":10000,"rate":5,"type":"ENERGY","id":"ST101","selfType":"stocks"},{"FatcaStatus":"YES","name":"ADANI Power","portfolioAmount":12000,"investedAmount":10000,"rate":5,"type":"ENERGY","id":"ST102","selfType":"stocks"},{"FatcaStatus":"YES","name":"Bharat Petrolium","portfolioAmount":2000,"investedAmount":1000,"rate":5,"type":"ENERGY","id":"ST103","selfType":"stocks"},{"FatcaStatus":"YES","name":"TV18","portfolioAmount":22000,"investedAmount":10000,"rate":5,"type":"MEDIA","id":"ST104","selfType":"stocks"}],"FD":[{"FatcaStatus":"YES","name":"Kotak Mahindra","portfolioAmount":2000,"investedAmount":10000,"rate":5,"type":"FD","id":"FD101","selfType":"FD"}]},"transactions":{"salary":200000,"spending":120000},"loans":[{"name":"ICICI Bank Loan","remainingLoanAmount":1000000,"tenure":60,"interestRate":12,"type":"HOME_LOAN"}],"externalFactors":{"interest_rates":14}}'
function temp() {
    // fs.writeFile(fileName, updatedJson, function writeJSON(err) {
    //     if (err) return console.log(err);
    //     console.log(JSON.stringify(file));
    //     console.log('writing to ' + fileName);
    //   });
    //  console.log(PortFolioAnalyzer.rebalance())

    console.log(PortFolioAnalyzer.rebalance())
}


temp()



