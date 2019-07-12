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
 * @module AQRForecastAPIService
 * @description - Virida client-native app air quality regional forecast server api service.
 *
 * @author Tuan Le (tuan.t.lei@gmail.com)
 *
 *------------------------------------------------------------------------
 * @format
 * @flow
 */
'use strict'; // eslint-disable-line

import { Hf } from 'hyperflow';

import moment from 'moment';

import ReactNative from 'react-native'; // eslint-disable-line

import NetInfo from '@react-native-community/netinfo';

import AQAlertComposite from '../composites/aq-alert-composite';

import Theme from '../theme';

import CONSTANT from '../constant';

import EVENT from '../events/aqr-api-event';

const AQRForecastAPIService = Hf.Service.augment({
    composites: [
        AQAlertComposite
    ],
    setupAirNowGetAQRForecastDataAPI (jsonContentHeaders) {
        const service = this;

        service.incoming(EVENT.REQUEST.AIR_NOW_AQR_FORECAST_DATA).handle((requestor) => {
            const timeoutId = setTimeout(() => {
                service.outgoing(EVENT.RESPONSE.TO.AIR_NOW_AQR_FORECAST_DATA.TIMED_OUT).emit(() => {
                    return {
                        requestor,
                        errorMessage: `AirNow api request timeout.`
                    };
                });
                Hf.log(`warn1`, `AirNow api request timeout.`);
            }, CONSTANT.HTTP.API_REQUEST_TIMEOUT_MS);

            NetInfo.isConnected.fetch().then((online) => {
                if (online) {
                    if (Hf.isSchema({
                        aqParams: [ `string` ],
                        timestamp: `string`,
                        latitude: `number`,
                        longitude: `number`,
                        radius: `number`
                    }).of(requestor)) {
                        const {
                            aqParams,
                            timestamp,
                            latitude,
                            longitude,
                            radius
                        } = requestor;
                        let url;

                        url = `${CONSTANT.URL.AIR_NOW_GET_AQR_FORECAST_DATA_API}?format=application/json&latitude=`;
                        url = `${url}${latitude}&longitude=${longitude}&distance=${radius * 2}&date=${moment(timestamp).format(`YYYY-MM-DD`)}&API_KEY=${CONSTANT.API_KEY.AIR_NOW}`;
                        // Hf.log(`info1`, url);
                        fetch(url, {
                            method: `get`,
                            headers: jsonContentHeaders
                        }).then((response) => {
                            clearTimeout(timeoutId);
                            if (response.status === CONSTANT.HTTP.CODE.OK) {
                                Hf.log(`info1`, `AirNow server responsed with status ${CONSTANT.HTTP.CODE.OK}.`);
                                return response.json();
                            } else if (response.status === CONSTANT.HTTP.CODE.ERROR || response.status === CONSTANT.HTTP.CODE.BAD_GATEWAY_ERROR) {
                                service.outgoing(EVENT.RESPONSE.TO.AIR_NOW_AQR_FORECAST_DATA.ERROR).emit();
                                Hf.log(`warn1`, `Server responsed with error status ${CONSTANT.HTTP.CODE.ERROR}.`);
                            }
                        }).then((results) => {
                            results = results.filter((result) => aqParams.includes(result.ParameterName.toLowerCase().replace(/\./g, ``)));
                            if (Hf.isNonEmptyArray(results)) {
                                const reportingRegionName = `${results[0].ReportingArea}, ${results[0].StateCode}`;

                                service.outgoing(EVENT.RESPONSE.TO.AIR_NOW_AQR_FORECAST_DATA.OK).emit(() => {
                                    return {
                                        requestor,
                                        aqrInfo: {
                                            timestamp,
                                            name: reportingRegionName
                                        },
                                        aqrForecasts: Array(5).fill({
                                            aqParam: ``,
                                            aqi: 0,
                                            aqAlertIndex: 0,
                                            day: ``,
                                            aqDissusionMessage: ``,
                                            aqParamColor: Theme.color.palette.white
                                        }).map((aqForecast, index) => {
                                            const day = moment().add(index + 1, `days`).format(`ddd`);

                                            if (index <= results.length - 1) {
                                                const result = results[index];
                                                const aqParam = result.ParameterName.toLowerCase().replace(/\./g, ``);
                                                const aqi = parseInt(result.AQI, 10) >= 0 ? parseInt(result.AQI, 10) : 0;
                                                const aqAlert = service.getAQIAlert(aqi);
                                                // const day = moment(result.DateForecast.replace(/\s+/, ``)).add(1, `days`).format(`ddd`);
                                                const aqDissusionMessage = Hf.isString(result.Discussion) ? result.Discussion : ``;

                                                if (aqParam === `pm25`) {
                                                    return {
                                                        aqParam,
                                                        aqi,
                                                        aqAlertIndex: aqAlert.index,
                                                        day,
                                                        aqDissusionMessage,
                                                        aqParamColor: Theme.color.palette.teal
                                                    };
                                                } else if (aqParam === `pm10`) {
                                                    return {
                                                        aqParam,
                                                        aqi,
                                                        aqAlertIndex: aqAlert.index,
                                                        day,
                                                        aqDissusionMessage,
                                                        aqParamColor: Theme.color.palette.indigo
                                                    };
                                                } else if (aqParam === `o3`) {
                                                    return {
                                                        aqParam,
                                                        aqi,
                                                        aqAlertIndex: aqAlert.index,
                                                        day,
                                                        aqDissusionMessage,
                                                        aqParamColor: Theme.color.palette.orange
                                                    };
                                                } else if (aqParam === `no2`) {
                                                    return {
                                                        aqParam,
                                                        aqi,
                                                        aqAlertIndex: aqAlert.index,
                                                        day,
                                                        aqDissusionMessage,
                                                        aqParamColor: Theme.color.palette.blue
                                                    };
                                                } else if (aqParam === `so2`) {
                                                    return {
                                                        aqParam,
                                                        aqi,
                                                        aqAlertIndex: aqAlert.index,
                                                        day,
                                                        aqDissusionMessage,
                                                        aqParamColor: Theme.color.palette.purple
                                                    };
                                                } else if (aqParam === `co`) {
                                                    return {
                                                        aqParam,
                                                        aqi,
                                                        aqAlertIndex: aqAlert.index,
                                                        day,
                                                        aqDissusionMessage,
                                                        aqParamColor: Theme.color.palette.pink
                                                    };
                                                }
                                            }
                                            return {
                                                ...aqForecast,
                                                day
                                            };
                                        })
                                    };
                                });
                            } else {
                                service.outgoing(EVENT.RESPONSE.TO.AIR_NOW_AQR_FORECAST_DATA.NOT_FOUND).emit(() => {
                                    return {
                                        requestor,
                                        errorMessage: `AirNow api request forecast data not found.`
                                    };
                                });
                            }
                        }).catch((error) => {
                            clearTimeout(timeoutId);
                            service.outgoing(EVENT.RESPONSE.TO.AIR_NOW_AQR_FORECAST_DATA.ERROR).emit(() => {
                                return {
                                    requestor,
                                    errorMessage: `Unable to do get request, ${error.message}.`
                                };
                            });
                            Hf.log(`warn1`, `Unable to do get request, ${error.message}.`);
                        });
                    } else {
                        service.outgoing(EVENT.RESPONSE.TO.AIR_NOW_AQR_FORECAST_DATA.ERROR).emit(() => {
                            return {
                                requestor,
                                errorMessage: `Invalid AirNow api request params.`
                            };
                        });
                        Hf.log(`warn1`, `Invalid AirNow api request params.`);
                    }
                } else {
                    service.outgoing(EVENT.RESPONSE.TO.AIR_NOW_AQR_FORECAST_DATA.ERROR).emit(() => {
                        return {
                            requestor,
                            errorMessage: `Device is offline.`
                        };
                    });
                    Hf.log(`warn1`, `Device is offline.`);
                }
            });
        });
    },
    setup (done) {
        const service = this;
        const jsonContentHeaders = new Headers();

        jsonContentHeaders.append(`Accept`, `gzip`);
        jsonContentHeaders.append(`Accept`, `deflate`);
        jsonContentHeaders.append(`Accept`, `application/json`);
        jsonContentHeaders.append(`Content-Type`, `application/json`);
        service.setupAirNowGetAQRForecastDataAPI(jsonContentHeaders);
        done();
    },
    teardown (done) {
        done();
    }
});
export default AQRForecastAPIService;
