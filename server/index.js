const express = require('express')
const cors = require('cors')
// const session = require('express-session')
const fs = require('fs')

const app = express()

const clientAdress = "http://localhost:3000"

app.use(cors({
    origin: clientAdress
}))

app.use(express.json())


app.get('/api/flight/search', (req, res) => {
    let rawdata = fs.readFileSync('Raw_data OW.json');
    let fligthsRaw = JSON.parse(rawdata);

    const intoTheLegs = (placement, content, fligth) => {
        let obj = [{}]
        let SegmentDuration = fligth.Segments[0].SegmentDuration
        let ValidatingCarrier = fligth.Segments[0].ValidatingCarrier
        if (placement == 0) {
            let DeparturePoint = content.Legs[0].DeparturePoint
            let ArrivalPoint = content.Legs[0].ArrivalPoint
            let FlightNumber = content.Legs[0].FlightNumber
            let AirlineName = content.Legs[0].AirlineName
            let AirlineCode = content.Legs[0].AirlineCode
            let TotalPrice = fligth.TotalPrice
            let AveragePrice = fligth.AveragePrice
            let CurrencySymbol = fligth.CurrencySymbol
            obj = {
                ID: fligth.ID,
                Segments: [{ "Legs": [{ DeparturePoint, ArrivalPoint, FlightNumber, AirlineName, AirlineCode }], SegmentDuration, ValidatingCarrier }],
                TotalPrice,
                AveragePrice,
                CurrencySymbol
            }
        } else if (placement > 0) {
            obj = {
                ID: fligth.ID
            }
            let oneLoeg = []
            for (let i = 0; i < placement; i++) {
                let DeparturePoint = content.Legs[i].DeparturePoint
                let ArrivalPoint = content.Legs[i].ArrivalPoint
                let FlightNumber = content.Legs[i].FlightNumber
                let AirlineName = content.Legs[i].AirlineName
                let AirlineCode = content.Legs[i].AirlineCode
                oneLoeg.push({ DeparturePoint, ArrivalPoint, FlightNumber, AirlineName, AirlineCode });
            }
            obj.Segments = [{ "Legs": oneLoeg, SegmentDuration, ValidatingCarrier }]

        }
        return obj
    }

    const cleaningJson = () =>
        fligthsRaw.map(fligth => {
            let obj = [{}]
            let SegmentDuration = fligth.Segments[0].SegmentDuration
            let ValidatingCarrier = fligth.Segments[0].ValidatingCarrier
            if (!fligth.Segments[0].Legs) {
                obj = {
                    ID: fligth.ID,
                    Segments: [{ SegmentDuration, ValidatingCarrier }]
                }
            }
            const lengthOfLegs = (fligth.Segments[0].Legs).length

            obj = intoTheLegs(lengthOfLegs, fligth.Segments[0], fligth)

            const TotalPrice = fligth.TotalPrice
            const AveragePrice = fligth.AveragePrice
            const CurrencySymbol = fligth.CurrencySymbol

            obj.TotalPrice = TotalPrice
            obj.AveragePrice = AveragePrice
            obj.CurrencySymbol = CurrencySymbol
            return obj
        })

    res.send(cleaningJson())

})



app.listen(1000, () => console.log("the server is up!"))