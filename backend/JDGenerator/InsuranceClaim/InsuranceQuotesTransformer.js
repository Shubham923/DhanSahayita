
let policyDetailsList = []

function transform(insurancePolicies) {
    convert1(insurancePolicies[0])
    convert2(insurancePolicies[1])
    
    return policyDetailsList
}

function transform0(insurancePolicies) {
    convert1(insurancePolicies[0])
    
    return policyDetailsList
}

function transform1(insurancePolicies) {
    convert2(insurancePolicies[1])
    
    return policyDetailsList
}

function convert1(value) {

    let rider = JSON.parse(JSON.stringify(value.profile.riders.rider[0]))

    let holder = JSON.parse(JSON.stringify(value.profile.holders.holder[0]))

    policyDetailsList.push(
        {
            policyNumber: value.masked_account_number,
            duration: rider.policyStartDate + " to " + rider.policyEndDate,
            type: value.type,
            tenure: rider.tenureMonths + ' months',
            name: holder.name,
            email: holder.email,
            mobile: holder.mobile,
            PAN: holder.pan,
            sumAssured:  rider.sumAssured,
            remainingSum: 14000,
            policyStartDate: rider.policyStartDate,
            policyEndDate: rider.policyEndDate
        }
    )
}

function convert2(value) {

    let rider = JSON.parse(JSON.stringify(value.profile.riders.rider))

    let holder = JSON.parse(JSON.stringify(value.profile.holders.holder))

    policyDetailsList.push(
        {
            policyNumber: value.masked_account_number,
            duration: rider.policyStartDate + " to " + rider.policyEndDate,
            type: value.type,
            tenure: rider.tenureMonths + ' months',
            name: holder.name,
            email: holder.email,
            mobile: holder.mobile,
            PAN: holder.pan,
            sumAssured:  rider.sumAssured,
            remainingSum: 400
        
    })
    //console.log(policyDetailsList)
}

module.exports = transform