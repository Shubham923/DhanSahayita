

const pdfjsLib = require("pdfjs-dist");


let medicalBill = {
    
}


async function getTextFromPDF(path) {
    let doc = await pdfjsLib.getDocument(path).promise;
    let page1 = await doc.getPage(1);
    let content = await page1.getTextContent();
    let strings = content.items.map(function(item) {
        return item.str;
    });
    
    strings.forEach(element => {
        let line = element.toString()
        if(line.includes("Tab")) {
            medicalBill["Tab"] = line.replace('Tab ', '').trim()
        } else if(line.includes("INV")) {
            medicalBill['invoice_num'] = line.replace('INV', '').trim()
        } else if(line.includes("INR")) {
            medicalBill['total_amount'] = line.replace('INR ', '').trim()
        }else if(line.includes("DOI")) {
            medicalBill['statement_state'] = line.replace('DOI: ', '').trim()
        } else if(line.includes("Hosp")) {
            medicalBill['hospital_name'] = line.replace('Hosp: ', '').trim()
        } else if(line.includes("Mr.")) {
            medicalBill['patient_name'] = line.replace('Mr.', '').trim()
        }

    });

    console.log(medicalBill)
    return medicalBill

    //return strings;
}



//getTextFromPDF('/Users/shubham/Documents/dhansahayita/backend/images/invoice_bill.pdf')

module.exports = getTextFromPDF