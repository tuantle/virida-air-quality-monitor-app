/**
 * Copyright (c) 2017-present, Virida YEAwareness, Org. All rights reserved.
 *
 * Licensed under the MIT License.
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://opensource.org/licenses/mit-license.html
 *
 * Unless = required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *------------------------------------------------------------------------
 *
 * @module AQAlertComposite
 * @description - Virida client-native air quality alert composite.
 *
 * @author Tuan Le (tuan.t.lei@gmail.com)
 *
 *------------------------------------------------------------------------
 * @format
 * @flow
 */
'use strict'; // eslint-disable-line

import { Hf } from 'hyperflow';

import Theme from '../theme';

const invInterpolateLinear = function invInterpolateLinear (aqiHigh, aqiLow, highLvl, lowLvl, _aqi) {
    return ((_aqi - aqiLow) / (aqiHigh - aqiLow)) * (highLvl - lowLvl) + lowLvl;
};
// const interpolateLinear = function interpolateLinear (aqiHigh, aqiLow, highLvl, lowLvl, lvl) {
//     return Math.round(((lvl - lowLvl) / (highLvl - lowLvl)) * (aqiHigh - aqiLow) + aqiLow);
// };
// const pollutants = {
//     pm25: {
//         unit: "&micro;g/m<sup>3</sup>",
//         name: "PM<sub>2.5</sub>",
//         range: [0, 50, 100, 150, 200, 300, 400, 500],
//         scale: [0, 12, 35.5, 55.5, 150.5, 250.5, 350.5, 500.5]
//     },
//     pm10: {
//         unit: "&micro;g/m<sup>3</sup>",
//         name: "PM<sub>10</sub>",
//         range: [0, 50, 100, 150, 200, 300, 400, 500],
//         scale: [0, 55, 155, 255, 355, 425, 505, 605]
//     },
//     o31: {
//         unit: "ppb",
//         name: "O<sub>3</sub> (1 hour average)",
//         range: ["1-hour ozone values do not define lower AQI values (<100). AQI values of 100 or below are calculated with 8-hour ozone concentrations.", 100, 150, 200, 300, 400, 500],
//         scale: [0, .125, .165, .205, .405, .505, .605]
//     },
//     o38: {
//         unit: "ppb",
//         name: "O<sub>3</sub> (8 hours average)",
//         range: [0, 50, 100, 150, 200, 300, "8-hour ozone values do not define higher AQI values (>=300).  AQI values of 300 or greater are calculated with 1-hour ozone concentrations."],
//         scale: [0, .06, .076, .096, .116, .375]
//     },
//     so21: {
//         unit: "ppb",
//         name: "SO<sub>2</sub> (1 hour average)",
//         range: [0, 50, 100, 150, 200, "AQI values of 200 or greater are calculated with 24-hour SO2 concentrations."],
//         scale: [0, 36, 76, 186, 304, 604]
//     },
//     so224: {
//         unit: "ppb",
//         name: "SO<sub>2</sub> (24 hours average)",
//         range: ["AQI values less than 200 are calculated with 1-hour SO2 concentrations.", 200, 300, 400, 500],
//         scale: [0, 304, 605, 805, 1004]
//     },
//     no2: {
//         unit: "ppb",
//         name: "NO2<sub>2</sub>",
//         range: [0, 50, 100, 150, 200, 300, 400, 500],
//         scale: [0, .054, .101, .361, .650, 1.250, 1.650, 2.049]
//     },
//     co: {
//         unit: "ppm",
//         name: "CO",
//         range: [0, 50, 100, 150, 200, 300, 400, 500],
//         scale: [0, 4.5, 9.5, 12.5, 15.5, 30.5, 40.5, 50.5]
//     },
// };

export default Hf.Composite({
    template: {
        getAQIAlert (aqi) {
            let aqAlertIndex = 0;
            let aqAlertMessage = `Good`;
            if (aqi <= 50) {
                aqAlertIndex = 0;
                aqAlertMessage = `Good`;
            } else if (aqi > 50 && aqi <= 100) {
                aqAlertIndex = 1;
                aqAlertMessage = `Moderate`;
            } else if (aqi > 100 && aqi <= 200) {
                aqAlertIndex = 2;
                aqAlertMessage = `Unhealthy`;
            } else if (aqi > 200 && aqi <= 300) {
                aqAlertIndex = 3;
                aqAlertMessage = `Harmful`;
            } else if (aqi > 300) {
                aqAlertIndex = 4;
                aqAlertMessage = `Deadly`;
            }
            return {
                aqi,
                index: aqAlertIndex,
                color: Theme.color.aqAlerts[aqAlertIndex],
                message: aqAlertMessage
            };
        },
        getPM25LvlFromAQI (aqi) {
            let aqConcentration = 0.0;
            if (aqi >= 0 && aqi <= 50) {
                aqConcentration = parseFloat(invInterpolateLinear(50, 0, 12.1, 0, aqi).toFixed(1));
            } else if (aqi > 50 && aqi <= 100) {
                aqConcentration = parseFloat(invInterpolateLinear(100, 51, 35.5, 12.1, aqi).toFixed(1));
            } else if (aqi > 100 && aqi <= 150) {
                aqConcentration = parseFloat(invInterpolateLinear(150, 101, 55.5, 35.5, aqi).toFixed(1));
            } else if (aqi > 150 && aqi <= 200) {
                aqConcentration = parseFloat(invInterpolateLinear(200, 151, 150.5, 55.5, aqi).toFixed(1));
            } else if (aqi > 200 && aqi <= 300) {
                aqConcentration = parseFloat(invInterpolateLinear(300, 201, 250.5, 150.5, aqi).toFixed(1));
            } else if (aqi > 300 && aqi <= 400) {
                aqConcentration = parseFloat(invInterpolateLinear(400, 301, 350.5, 250.5, aqi).toFixed(1));
            } else if (aqi > 400 && aqi <= 500) {
                aqConcentration = parseFloat(invInterpolateLinear(500, 401, 500.5, 350.5, aqi).toFixed(1));
            } else {
                aqConcentration = 500.5;
            }
            return {
                aqUnit: `µg / m³`,
                aqConcentration
            };
        },
        getPM10LvlFromAQI (aqi) {
            let aqConcentration = 0.0;
            if (aqi >= 0 && aqi <= 50) {
                aqConcentration = parseFloat(invInterpolateLinear(50, 0, 55.1, 0, aqi).toFixed(1));
            } else if (aqi > 50 && aqi <= 100) {
                aqConcentration = parseFloat(invInterpolateLinear(100, 51, 155.5, 55.1, aqi).toFixed(1));
            } else if (aqi > 100 && aqi <= 150) {
                aqConcentration = parseFloat(invInterpolateLinear(150, 101, 255.5, 155.5, aqi).toFixed(1));
            } else if (aqi > 150 && aqi <= 200) {
                aqConcentration = parseFloat(invInterpolateLinear(200, 151, 355.5, 255.5, aqi).toFixed(1));
            } else if (aqi > 200 && aqi <= 300) {
                aqConcentration = parseFloat(invInterpolateLinear(300, 201, 425.5, 355.5, aqi).toFixed(1));
            } else if (aqi > 300 && aqi <= 400) {
                aqConcentration = parseFloat(invInterpolateLinear(400, 301, 505.5, 425.5, aqi).toFixed(1));
            } else if (aqi > 400 && aqi <= 500) {
                aqConcentration = parseFloat(invInterpolateLinear(500, 401, 605.5, 505.5, aqi).toFixed(1));
            } else {
                aqConcentration = 605.5;
            }
            return {
                aqUnit: `µg / m³`,
                aqConcentration
            };
        },
        getO3LvlFromAQI (aqi) {
            let aqConcentration = 0.0;
            if (aqi >= 0 && aqi <= 50) {
                aqConcentration = parseFloat(invInterpolateLinear(50, 0, 0.06, 0, aqi).toFixed(3));
            } else if (aqi > 50 && aqi <= 100) {
                aqConcentration = parseFloat(invInterpolateLinear(100, 51, 0.076, 0.06, aqi).toFixed(3));
            } else if (aqi > 100 && aqi <= 150) {
                aqConcentration = parseFloat(invInterpolateLinear(150, 101, 0.096, 0.076, aqi).toFixed(3));
            } else if (aqi > 150 && aqi <= 200) {
                aqConcentration = parseFloat(invInterpolateLinear(200, 151, 0.116, 0.096, aqi).toFixed(3));
            } else if (aqi > 200 && aqi <= 300) {
                aqConcentration = parseFloat(invInterpolateLinear(300, 201, 0.375, 0.116, aqi).toFixed(3));
            } else {
                aqConcentration = 0.375;
            }
            return {
                aqUnit: `ppb`,
                aqConcentration
            };
        },
        getNO2LvlFromAQI (aqi) {
            let aqConcentration = 0.0;
            if (aqi >= 0 && aqi <= 50) {
                aqConcentration = parseFloat(invInterpolateLinear(50, 0, 0.054, 0, aqi).toFixed(3));
            } else if (aqi > 50 && aqi <= 100) {
                aqConcentration = parseFloat(invInterpolateLinear(100, 51, 0.101, 0.054, aqi).toFixed(3));
            } else if (aqi > 100 && aqi <= 150) {
                aqConcentration = parseFloat(invInterpolateLinear(150, 101, 0.361, 0.101, aqi).toFixed(3));
            } else if (aqi > 150 && aqi <= 200) {
                aqConcentration = parseFloat(invInterpolateLinear(200, 151, 0.650, 0.361, aqi).toFixed(3));
            } else if (aqi > 200 && aqi <= 300) {
                aqConcentration = parseFloat(invInterpolateLinear(300, 201, 1.250, 0.650, aqi).toFixed(3));
            } else if (aqi > 300 && aqi <= 400) {
                aqConcentration = parseFloat(invInterpolateLinear(400, 301, 1.650, 1.250, aqi).toFixed(3));
            } else if (aqi > 400 && aqi <= 500) {
                aqConcentration = parseFloat(invInterpolateLinear(500, 401, 2.049, 1.650, aqi).toFixed(3));
            } else {
                aqConcentration = 2.049;
            }
            return {
                aqUnit: `ppb`,
                aqConcentration
            };
        },
        getSO2LvlFromAQI (aqi) {
            let aqConcentration = 0.0;
            if (aqi >= 0 && aqi <= 50) {
                aqConcentration = parseFloat(invInterpolateLinear(50, 0, 36, 0, aqi).toFixed(3));
            } else if (aqi > 50 && aqi <= 100) {
                aqConcentration = parseFloat(invInterpolateLinear(100, 51, 76, 36, aqi).toFixed(3));
            } else if (aqi > 100 && aqi <= 150) {
                aqConcentration = parseFloat(invInterpolateLinear(150, 101, 186, 76, aqi).toFixed(3));
            } else if (aqi > 150 && aqi <= 200) {
                aqConcentration = parseFloat(invInterpolateLinear(200, 151, 304, 186, aqi).toFixed(3));
            } else if (aqi > 200 && aqi <= 300) {
                aqConcentration = parseFloat(invInterpolateLinear(300, 201, 604, 304, aqi).toFixed(3));
            } else if (aqi > 300 && aqi <= 400) {
                aqConcentration = 604;
            } else if (aqi > 400 && aqi <= 500) {
                aqConcentration = 604;
            } else {
                aqConcentration = 604;
            }
            return {
                aqUnit: `ppb`,
                aqConcentration
            };
        },
        getCOLvlFromAQI (aqi) {
            let aqConcentration = 0.0;
            if (aqi >= 0 && aqi <= 50) {
                aqConcentration = parseFloat(invInterpolateLinear(50, 0, 4.5, 0, aqi).toFixed(3));
            } else if (aqi > 50 && aqi <= 100) {
                aqConcentration = parseFloat(invInterpolateLinear(100, 51, 4.5, 9.5, aqi).toFixed(3));
            } else if (aqi > 100 && aqi <= 150) {
                aqConcentration = parseFloat(invInterpolateLinear(150, 101, 12.5, 9.5, aqi).toFixed(3));
            } else if (aqi > 150 && aqi <= 200) {
                aqConcentration = parseFloat(invInterpolateLinear(200, 151, 15.5, 12.5, aqi).toFixed(3));
            } else if (aqi > 200 && aqi <= 300) {
                aqConcentration = parseFloat(invInterpolateLinear(300, 201, 30.5, 15.5, aqi).toFixed(3));
            } else if (aqi > 300 && aqi <= 400) {
                aqConcentration = parseFloat(invInterpolateLinear(400, 301, 40.5, 30.5, aqi).toFixed(3));
            } else if (aqi > 400 && aqi <= 500) {
                aqConcentration = parseFloat(invInterpolateLinear(500, 401, 50.5, 40.5, aqi).toFixed(3));
            } else {
                aqConcentration = 50.5;
            }
            return {
                aqUnit: `ppm`,
                aqConcentration
            };
        }
    }
});
