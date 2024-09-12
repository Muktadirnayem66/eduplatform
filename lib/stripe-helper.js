
export function formatAmountForStripe(amount, currency){

    let NumberFormat = new Intl.NumberFormat(["en-IN"], {
        style:"currency",
        currency:currency,
        currencyDisplay:"symbol"
    })
    const parts = NumberFormat.formatToParts(amount)
    
    let zeroDecimalCurrency = true
    for(let part of parts){
        if(part.type === "decimal"){
            zeroDecimalCurrency = false
        }
    }
    return zeroDecimalCurrency ? amount : Math.round(amount * 100)
}

