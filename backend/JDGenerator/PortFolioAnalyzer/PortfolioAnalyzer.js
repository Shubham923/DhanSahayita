const portfolio = require('../PortFolioAnalyzer/RawAssets/portfolio.json');
const newPortfolio = require('../PortFolioAnalyzer/RawAssets/newPortfolio.json');
const packages = require('../PortFolioAnalyzer/RawAssets/packages.json');
const e = require('express');


class PortFolioAnalyzer {

    static getMutualFundELSSReturns() {
        let mutualFunds = portfolio.summary.mutual_funds

        let totalReturns = 0
        mutualFunds.forEach(fund => {
            if (fund.mfType == 'ELSS') {
                totalReturns = totalReturns + (fund.portfolioAmount - fund.investedAmount)
            }
        });

        //console.log(totalReturns)
    }

    static getStockReturns() {
        let stocks = portfolio.summary.stocks

        let totalReturns = 0
        stocks.forEach(stock => {
            totalReturns = totalReturns + (stock.portfolioAmount - stock.investedAmount)
        });

        //.log(totalReturns)
    }


    static getTotalCapital() {
        return portfolio.profile.totalPortfolio
    }

    static getSalary() {
        return portfolio.profile.salary
    }


    /**
     * Get Mutual Funds related information
     */
    static getMutualFunds() {
        return portfolio.summary.mutual_funds
    }

    static getMutualFundReturns() {
        let mutualFunds = portfolio.summary.mutual_funds

        let totalReturns = 0
        mutualFunds.forEach(fund => {
            totalReturns = totalReturns + (fund.portfolioAmount - fund.investedAmount)
        });

        //console.log(totalReturns)
    }

    static getMutualFundByCaps() {
        let mutualFunds = portfolio.summary.mutual_funds

        let mutualFundCapsSet = new Set()

        mutualFunds.forEach(fund => {
            mutualFundCapsSet.add(fund.type)
        });

        return mutualFundCapsSet
    }

    static getMutualFundByCapsAllotment() {
        let mutualFunds = portfolio.summary.mutual_funds

        let mutualFundCapsSet = new Map()

        mutualFunds.forEach(fund => {
            if (mutualFundCapsSet[fund.type]) {
                let temp = mutualFundCapsSet[fund.type]
                mutualFundCapsSet[fund.type] = { type: fund.type, amount: temp.amount + fund.portfolioAmount }
            } else {
                mutualFundCapsSet[fund.type] = { type: fund.type, amount: fund.portfolioAmount }
            }
        });

        var pieData = [
        ]


        for (const [key, value] of Object.entries(mutualFundCapsSet)) {
            if (key == 'LARGE_CAP') {
                pieData.push({
                    value: value.amount,
                    text: 'Large Cap',
                    color: '#6750a4'
                })
            } else if (key == 'MEDIUM_CAP') {
                pieData.push({
                    value: value.amount,
                    text: 'Medium Cap',
                    color: '#eaddff'
                })
            } else if (key == 'SMALL_CAP') {
                pieData.push({
                    value: value.amount,
                    text: 'Small CAP',
                    color: '#625b71'
                })
            }
        }

        return pieData
    }

    static getMutualFundInvestementByCaps() {
        let funds = portfolio.summary.mutual_funds

        var result = funds.reduce((x, y) => {

            (x[y.type] = x[y.type] || []).push(y);

            return x;

        }, {});

        return result

        //console.log(result)
    }


    /**
     * Stock related information
     */

    static getStockBySectors() {
        let stocks = portfolio.summary.stocks

        let map = new Map()

        let stocksList = []

        var result = stocks.reduce((x, y) => {

            (x[y.type] = x[y.type] || []).push(y);

            return x;

        }, {});

        //console.log(result)

        return result
    }


    /**
     * FD related information
     */

    static getFixedDeposits() {
        return portfolio.summary.FD
    }



    /**
     * Emergency Fund related information
     */

    static getEmergencyFunds() {
        return portfolio.summary?.emergency_funds
    }




    /**
     * Overall
     */

    static getHigerLevelDistributionOverall() {

        let map = new Map()
        Object.entries(portfolio.summary).map(([make, type]) => {
            type.forEach(element => {
                if (!map[element.selfType]) {
                    map[element.selfType] =
                    {
                        "type": element.selfType,
                        "amount": element.portfolioAmount
                    }

                } else {
                    let obj = map[element.selfType]
                    map[element.selfType] =
                    {
                        "type": element.selfType,
                        "amount": obj.amount + element.portfolioAmount
                    }

                }
            })
        })
        return map
    }

    static getTotalBenefitedAmount(portfolio1) {
        let totalAmount = 0
        let total_amount = 0
        let map = new Map()
        Object.entries(portfolio1.summary).map(([make, type]) => {
            type.forEach(element => {
                totalAmount = totalAmount + (element.portfolioAmount + (element.portfolioAmount * element.rate / 100))
                total_amount += element.portfolioAmount
            })
        })
        return totalAmount - total_amount
    }

    static getTaxesOnSalary(portfolio) {
        var taxPc = 0.0

        var salary = portfolio.transactions.salary * 12
        if (salary < 700000) {
            taxPc = 0.0
        } else if (salary >= 700000 && salary < 1000000) {
            taxPc = 0.05
        } else if (salary >= 1000000 && salary < 1500000) {
            taxPc = 0.1
        } else if (salary >= 1500000 && salary < 2000000) {
            taxPc = 0.2
        } else {
            taxPc = 0.3
        }

        var taxInterestAmount = 0


        portfolio.loans.forEach(loan => {
            taxInterestAmount += loan.remainingLoanAmount * (loan.interestRate / 100)
        })


        var salary = salary - taxInterestAmount

        return salary * taxPc
    }

    static isEmpty(obj) {
        for (const prop in obj) {
            if (Object.hasOwn(obj, prop)) {
                return false;
            }
        }

        return true;
    }

    static compare(original, copy) {
        for (let [k, v] of Object.entries(original)) {
            if (typeof v === "object" && v !== null) {
                if (!copy.hasOwnProperty(k)) {
                    copy[k] = v; // 2
                } else {
                    this.compare(v, copy?.[k]);
                }
            } else {
                if (Object.is(v, copy?.[k])) {
                    delete copy?.[k]; // 1
                }
            }
        }
        return copy
    }

    //Imp
    static rebalance() {

        let actions = []
        //previous
        let totalBenefitedAmount = this.getTotalBenefitedAmount(portfolio)
        let totalTaxesOnSalary = this.getTaxesOnSalary(portfolio)
        //now

        let newTotalBenefitedAmount = this.getTotalBenefitedAmount(newPortfolio)
        let newYotalTaxesOnSalary = this.getTaxesOnSalary(newPortfolio)

        console.log(totalBenefitedAmount, totalTaxesOnSalary, newTotalBenefitedAmount, newYotalTaxesOnSalary)

        if (newYotalTaxesOnSalary - totalTaxesOnSalary > 0) {
            actions.push('INCREASE_IN_SLAB_BRACKET')
        }

        let diff = this.compare(portfolio, newPortfolio)

        //added loan?

        diff.loans?.forEach(loan => {
            if (loan != null && !this.isEmpty(loan)) {
                if(loan.type == 'HOME_LOAN') {
                    actions.push('HOME_LOAN_ACTION')
                } else if(loan.type == 'CAR_LOAN') {
                    actions.push('CAR_LOAN_ACTION')
                }
            }
        })

        if (diff?.externalFactors?.interest_rates != null) {
            var interestHike = newPortfolio.externalFactors.interest_rates - portfolio.externalFactors.interest_rates
            if (interestHike > 0) {
                actions.push('INCREASE_REPO_RATES')
            }
        }

        console.log(actions)
        return actions
    }


    static difference = function (s1, s2) {
        if (!s1 instanceof Set || !s2 instanceof Set) {
            console.log("The given objects are not of type Set");
            return null;
        }
        let newSet = new Set();
        s1.forEach(elem => newSet.add(elem));
        s2.forEach(elem => newSet.delete(elem));
        return newSet;
    }

    //rebalance()

    /**
     * IMP
     */
    static recommendPackages(risk) {
        var stockAvailableSets = new Set()
        var stockSectorsTemp = this.getStockBySectors()
        Object.entries(stockSectorsTemp).map(([make, type]) => {
            type.forEach(element => {
                stockAvailableSets.add(element.type)
            })
        })

        var mfCapsAvailableSets = this.getMutualFundByCaps()

        var isEmergencyFundAvailable = false

        var emergencyFund = this.getEmergencyFunds()

        if (emergencyFund != null) {
            isEmergencyFundAvailable = true
        }

        console.log(mfCapsAvailableSets, stockAvailableSets, isEmergencyFundAvailable)


        var quotes = packages


        var availableStocksSets = new Set()
        availableStocksSets.add('MEDIA')
        availableStocksSets.add('IT')
        availableStocksSets.add('ENERGY')

        var availableMutualFundCapSets = new Set()
        availableMutualFundCapSets.add("LARGE_CAP")
        availableMutualFundCapSets.add("MEDIUM_CAP")
        availableMutualFundCapSets.add("SMALL_CAP")

        var tags = []

        var missingMutualFundCapSets = this.difference(availableMutualFundCapSets, mfCapsAvailableSets)
        var missingStocksSets = this.difference(availableStocksSets, stockAvailableSets)

        missingMutualFundCapSets.forEach(key => tags.push(key))
        missingStocksSets.forEach(key => tags.push(key))

        if (!isEmergencyFundAvailable) {
            tags.push('emerency_funds')
        }

        if (!risk) {
            risk = 'LOW_RISK'
        }

        tags.push(risk)

        if (tags.includes('LOW_RISK')) {
            var index = tags.indexOf('SMALL_CAP');
            if (index !== -1) {
                tags.splice(index, 1);
            }
        }

        console.log(tags)

        let suggestions = []

        Object.entries(packages).map(([make, type]) => {
            type.forEach(element => {
                const filteredArray = element.tags.filter(value => tags.includes(value));
                if (!this.isEmpty(filteredArray)) {
                    suggestions.push(element)
                }
            })
        })

        var allQuotes = this.getAllQuotesOfUser()

        const filteredSuggestions = suggestions.filter(value => !allQuotes.includes(value.id));


        return filteredSuggestions
    }

    static getAllQuotesOfUser() {
        var quotes = []
        Object.entries(portfolio.summary).map(([make, type]) => {
            type.forEach(element => {
               quotes.push(element.id)
            })
        })
        return quotes
    }


    static getOverallDistributionForPieChart() {
        let temp = this.getHigerLevelDistributionOverall()
        let salary = this.getSalary()


        var pieData = [
        ]


        for (const [key, value] of Object.entries(temp)) {
            if (key == 'mutual_funds') {
                pieData.push({
                    value: value.amount,
                    text: 'MF',
                    color: '#e8def8'
                })
            } else if (key == 'stocks') {
                pieData.push({
                    value: value.amount,
                    text: 'Stocks',
                    color: '#efb8c8'
                })
            } else if (key == 'FD') {
                pieData.push({
                    value: value.amount,
                    text: 'FD',
                    color: '#6750a4'
                })
            } else if (key == 'emergency_funds') {
                pieData.push({
                    value: value.amount,
                    text: 'EF',
                    color: '#eaddff'
                })
            }
        }

        pieData.push({
            value: this.getSalary() * 12 - (portfolio.transactions.spending * 12),
            text: 'SAVINGS',
            color: '#6750a4'
        })
        console.log(pieData)
        return pieData
    }

    //Imp
    static getDhansahayitaSuggestions(riskType) {
        var benefits = []
        var returns = 0
        if(riskType=='LOW_RISK') {
            benefits = [
                "Low risk, sit back and experiance the growth",
                "Excellent for working employees",
                "Invest consistently For Longer Period with our Low Risk Funds"
            ]
            returns = 8
        } else if (riskType=='MEDIUM_RISK') {
            benefits = [
                "Moderate Returns, Moderate Growth",
                "Expertly Chosen Funds",
                "Invest consistently with our Medium Risk Funds"
            ]
            returns = 12
        } else {
            benefits = [
                "High Returns, Fast Growth",
                "Expertly Chosen Funds",
                "Take you from Zero to Hero"
            ]
            returns = 16
        }

        var recPackages = this.recommendPackages(riskType)

        var mf = ''
        var stocks = ''
        var ef = ''
        var fds = ''

        recPackages.forEach(element => {
            if(element.selfType == 'mutual_funds') {
                mf = mf + element.name + ', '
            } else if(element.selfType == 'stocks') {
                stocks = stocks + element.type + ', '
            } else if(element.selfType == 'emerency_funds') {
                ef = ef + element.name + ', '
            } else if(element.selfType == 'FD') {
                fds = fds + element.name + ', '
            }
        })

        if(!this.isEmpty(ef)) {
            ef = "Emergency Funds: " + ef
        }

        if(!this.isEmpty(ef)) {
            mf = "Mutual Funds: " + mf
        }

        if(!this.isEmpty(ef)) {
            fds = "Fixed Deposits: " + fds
        }

        if(!this.isEmpty(stocks)) {
            stocks = "Stock Sectors: " + stocks
        }

        return {
            suggestionName: "DhanSahayita SuperSaver Basket",
            returns: returns + "% in 5 years",
            benefits: benefits,
            suggestedQuotes: {
                mf: mf,
                stocks: stocks,
                ef: ef,
                fds: fds
        }
        }
    }

}

Set.difference = function (s1, s2) {
    if (!s1 instanceof Set || !s2 instanceof Set) {
        console.log("The given objects are not of type Set");
        return null;
    }
    let newSet = new Set();
    s1.forEach(elem => newSet.add(elem));
    s2.forEach(elem => newSet.delete(elem));
    return newSet;
}

module.exports = PortFolioAnalyzer
