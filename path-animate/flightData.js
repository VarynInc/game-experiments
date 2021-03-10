const flightData = function() {
    const flightData = {
        airportCodes: [
            "ATL",
            "EWR",
            "LAX",
            "BML",
            "BUR",
            "DTW",
            "FLL",
            "JFK",
            "LAS",
            "LGA",
            "LHR",
            "LOD",
            "JAC",
            "MSP",
            "ORD",
            "PSP",
            "ORL",
            "PDX",
            "RDU",
            "SFO",
            "SEA",
            "TUS"
        ],
        airlineCodes: [
            "AA",
            "AS",
            "AF",
            "AK",
            "AZ",
            "BA",
            "B6",
            "CA",
            "DL",
            "EK",
            "FX",
            "FI",
            "IC",
            "LY",
            "MQ",
            "QX",
            "QF",
            "SK",
            "UA",
            "WN"
        ],
        militaryCodes: [
            "JANAP",
            "DELTA",
            "FXTRT",
            "NODAK",
            "VIKNG",
            "ROMEO",
            "DFORC"
        ],
        minFlightNumber: 10,
        maxFlightNumber: 8900
    };

    return {
        getNextFlightNumber: function(airplaneClass) {
            let flightNumber = null;
            if (airplaneClass == "a-mil") {
                flightNumber = {
                    carrier: flightData.militaryCodes[Math.floor(Math.random() * flightData.militaryCodes.length)],
                    departing: "USAF",
                };
            } else if (airplaneClass == "chopper") {
                flightNumber = {
                    carrier: "BR",
                    departing: "local",
                };
            } else if (airplaneClass == "a-cub") {
                flightNumber = {
                    carrier: "IND",
                    departing: "local",
                };
            } else {
                flightNumber = {
                    carrier: flightData.airlineCodes[Math.floor(Math.random() * flightData.airlineCodes.length)],
                    departing: flightData.airportCodes[Math.floor(Math.random() * flightData.airportCodes.length)],
                };
            }
            flightNumber.flightNumber = flightData.minFlightNumber + (Math.floor(Math.random() * (flightData.maxFlightNumber - flightData.minFlightNumber)));
            return flightNumber;
        }
    }
}();
