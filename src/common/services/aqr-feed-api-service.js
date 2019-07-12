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
 * @module AQRFeedAPIService
 * @description - Virida client-native app air quality regional feed server api service.
 *
 * @author Tuan Le (tuan.t.lei@gmail.com)
 *
 *------------------------------------------------------------------------
 * @format
 * @flow
 */
'use strict'; // eslint-disable-line

import { Hf } from 'hyperflow';

import ReactNative from 'react-native'; // eslint-disable-line

import NetInfo from '@react-native-community/netinfo';

import AQAlertComposite from '../composites/aq-alert-composite';

import Theme from '../theme';

import CONSTANT from '../constant';

import EVENT from '../events/aqr-api-event';

const AQRFeedAPIService = Hf.Service.augment({
    composites: [
        AQAlertComposite
    ],
    setupAirNowGetAQRFeedDataAPI (jsonContentHeaders) {
        const service = this;

        service.incoming(EVENT.REQUEST.AIR_NOW_AQR_FEED_DATA).handle((requestor) => {
            const timeoutId = setTimeout(() => {
                service.outgoing(EVENT.RESPONSE.TO.AIR_NOW_AQR_FEED_DATA.TIMED_OUT).emit(() => {
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

                        url = `${CONSTANT.URL.AIR_NOW_GET_AQR_FEED_DATA_API}?format=application/json&latitude=`;
                        url = `${url}${latitude}&longitude=${longitude}&distance=${radius * 2}&API_KEY=${CONSTANT.API_KEY.AIR_NOW}`;
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
                                service.outgoing(EVENT.RESPONSE.TO.AIR_NOW_AQR_FEED_DATA.ERROR).emit();
                                Hf.log(`warn1`, `Server responsed with error status ${CONSTANT.HTTP.CODE.ERROR}.`);
                            }
                        }).then((results) => {
                            results = results.filter((result) => aqParams.includes(result.ParameterName.toLowerCase().replace(/\./g, ``)));
                            if (Hf.isNonEmptyArray(results)) {
                                const reportingRegionName = `${results[0].ReportingArea}, ${results[0].StateCode}`;
                                service.outgoing(EVENT.RESPONSE.TO.AIR_NOW_AQR_FEED_DATA.OK).emit(() => {
                                    return {
                                        requestor,
                                        aqrInfo: {
                                            timestamp,
                                            name: reportingRegionName
                                        },
                                        aqrFeeds: results.map((result) => {
                                            const aqi = parseInt(result.AQI, 10) >= 0 ? parseInt(result.AQI, 10) : 0;
                                            const aqAlert = service.getAQIAlert(aqi);
                                            const aqParam = result.ParameterName.toLowerCase().replace(/\./g, ``);

                                            if (aqParam === `pm25`) {
                                                return {
                                                    ...service.getPM25LvlFromAQI(aqi),
                                                    aqParam,
                                                    aqi,
                                                    aqAlertIndex: aqAlert.index,
                                                    aqAlertMessage: aqAlert.message,
                                                    aqParamColor: Theme.color.palette.teal
                                                };
                                            } else if (aqParam === `pm10`) {
                                                return {
                                                    ...service.getPM10LvlFromAQI(aqi),
                                                    aqParam,
                                                    aqi,
                                                    aqAlertIndex: aqAlert.index,
                                                    aqAlertMessage: aqAlert.message,
                                                    aqParamColor: Theme.color.palette.indigo
                                                };
                                            } else if (aqParam === `o3`) {
                                                return {
                                                    ...service.getO3LvlFromAQI(aqi),
                                                    aqParam,
                                                    aqi,
                                                    aqAlertIndex: aqAlert.index,
                                                    aqAlertMessage: aqAlert.message,
                                                    aqParamColor: Theme.color.palette.orange
                                                };
                                            } else if (aqParam === `no2`) {
                                                return {
                                                    ...service.getNO2LvlFromAQI(aqi),
                                                    aqParam,
                                                    aqi,
                                                    aqAlertIndex: aqAlert.index,
                                                    aqAlertMessage: aqAlert.message,
                                                    aqParamColor: Theme.color.palette.blue
                                                };
                                            } else if (aqParam === `so2`) {
                                                return {
                                                    ...service.getSO2LvlFromAQI(aqi),
                                                    aqParam,
                                                    aqi,
                                                    aqAlertIndex: aqAlert.index,
                                                    aqAlertMessage: aqAlert.message,
                                                    aqParamColor: Theme.color.palette.purple
                                                };
                                            } else if (aqParam === `co`) {
                                                return {
                                                    ...service.getCOLvlFromAQI(aqi),
                                                    aqParam,
                                                    aqi,
                                                    aqAlertIndex: aqAlert.index,
                                                    aqAlertMessage: aqAlert.message,
                                                    aqParamColor: Theme.color.palette.pink
                                                };
                                            }
                                        })
                                    };
                                });
                            } else {
                                service.outgoing(EVENT.RESPONSE.TO.AIR_NOW_AQR_FEED_DATA.NOT_FOUND).emit(() => {
                                    return {
                                        requestor,
                                        errorMessage: `AirNow api request feed data not found.`
                                    };
                                });
                            }
                        }).catch((error) => {
                            clearTimeout(timeoutId);
                            service.outgoing(EVENT.RESPONSE.TO.AIR_NOW_AQR_FEED_DATA.ERROR).emit(() => {
                                return {
                                    requestor,
                                    errorMessage: `Unable to do get request, ${error.message}.`
                                };
                            });
                            Hf.log(`warn1`, `Unable to do get request, ${error.message}.`);
                        });
                    } else {
                        service.outgoing(EVENT.RESPONSE.TO.AIR_NOW_AQR_FEED_DATA.ERROR).emit(() => {
                            return {
                                requestor,
                                errorMessage: `Invalid AirNow api request params.`
                            };
                        });
                        Hf.log(`warn1`, `Invalid AirNow api request params.`);
                    }
                } else {
                    service.outgoing(EVENT.RESPONSE.TO.AIR_NOW_AQR_FEED_DATA.ERROR).emit(() => {
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
    setupAQICNGetAQRFeedDataAPI (jsonContentHeaders) {
        const service = this;

        service.incoming(EVENT.REQUEST.AQICN_AQR_FEED_DATA).delay(CONSTANT.HTTP.AQICN_API_REQUEST_DELAY_MS).handle((requestor) => {
            const timeoutId = setTimeout(() => {
                service.outgoing(EVENT.RESPONSE.TO.AQICN_AQR_FEED_DATA.TIMED_OUT).emit(() => {
                    return {
                        requestor,
                        errorMessage: `AQICN api request timeout.`
                    };
                });
                Hf.log(`warn1`, `AQICN api request timeout.`);
            }, CONSTANT.HTTP.API_REQUEST_TIMEOUT_MS);

            NetInfo.isConnected.fetch().then((online) => {
                if (online) {
                    if (Hf.isSchema({
                        aqParams: [ `string` ],
                        timestamp: `string`,
                        latitude: `number`,
                        longitude: `number`
                    }).of(requestor)) {
                        const {
                            aqParams,
                            timestamp,
                            latitude,
                            longitude
                        } = requestor;
                        const url = `${CONSTANT.URL.AQICN_GET_AQR_FEED_DATA_API}geo:${latitude};${longitude}/?token=${CONSTANT.API_KEY.AQICN}`;

                        // Hf.log(`info1`, url);
                        fetch(url, {
                            method: `get`,
                            headers: jsonContentHeaders
                        }).then((response) => {
                            clearTimeout(timeoutId);
                            if (response.status === CONSTANT.HTTP.CODE.OK) {
                                Hf.log(`info1`, `AQICN server responsed with status ${CONSTANT.HTTP.CODE.OK}.`);
                                return response.json();
                            } else if (response.status === CONSTANT.HTTP.CODE.ERROR || response.status === CONSTANT.HTTP.CODE.BAD_GATEWAY_ERROR) {
                                service.outgoing(EVENT.RESPONSE.TO.AQICN_AQR_FEED_DATA.ERROR).emit();
                                Hf.log(`warn1`, `Server responsed with error status ${CONSTANT.HTTP.CODE.ERROR}.`);
                            }
                        }).then(({
                            status,
                            data
                        }) => {
                            if (status === `ok` && Hf.isObject(data)) {
                                const nameSegments = Hf.stringToArray(data.city.name, `,`);
                                let reportingRegionName = ``;

                                if (nameSegments.length <= 2) {
                                    reportingRegionName = data.city.name;
                                } else {
                                    reportingRegionName = Hf.arrayToString(nameSegments.slice(nameSegments.length - 2), `,`);
                                }
                                service.outgoing(EVENT.RESPONSE.TO.AQICN_AQR_FEED_DATA.OK).emit(() => {
                                    return {
                                        requestor,
                                        aqrInfo: {
                                            timestamp,
                                            name: reportingRegionName
                                        },
                                        aqrFeeds: Object.keys(data.iaqi).filter((key) => aqParams.includes(key)).map((key) => {
                                            const aqParam = key;
                                            const aqi = parseInt(data.iaqi[key].v, 10);
                                            const aqAlert = service.getAQIAlert(aqi);

                                            if (aqParam === `pm25`) {
                                                return {
                                                    ...service.getPM25LvlFromAQI(parseFloat(data.iaqi[key].v)),
                                                    aqParam,
                                                    aqi,
                                                    aqAlertIndex: aqAlert.index,
                                                    aqAlertMessage: aqAlert.message,
                                                    aqParamColor: Theme.color.palette.teal
                                                };
                                            } else if (aqParam === `pm10`) {
                                                return {
                                                    ...service.getPM10LvlFromAQI(parseFloat(data.iaqi[key].v)),
                                                    aqParam,
                                                    aqi,
                                                    aqAlertIndex: aqAlert.index,
                                                    aqAlertMessage: aqAlert.message,
                                                    aqParamColor: Theme.color.palette.indigo
                                                };
                                            } else if (aqParam === `o3`) {
                                                return {
                                                    ...service.getO3LvlFromAQI(parseFloat(data.iaqi[key].v)),
                                                    aqParam,
                                                    aqi,
                                                    aqAlertIndex: aqAlert.index,
                                                    aqAlertMessage: aqAlert.message,
                                                    aqParamColor: Theme.color.palette.orange
                                                };
                                            } else if (aqParam === `no2`) {
                                                return {
                                                    ...service.getNO2LvlFromAQI(parseFloat(data.iaqi[key].v)),
                                                    aqParam,
                                                    aqi,
                                                    aqAlertIndex: aqAlert.index,
                                                    aqAlertMessage: aqAlert.message,
                                                    aqParamColor: Theme.color.palette.blue
                                                };
                                            } else if (aqParam === `so2`) {
                                                return {
                                                    ...service.getSO2LvlFromAQI(parseFloat(data.iaqi[key].v)),
                                                    aqParam,
                                                    aqi,
                                                    aqAlertIndex: aqAlert.index,
                                                    aqAlertMessage: aqAlert.message,
                                                    aqParamColor: Theme.color.palette.purple
                                                };
                                            } else if (aqParam === `co`) {
                                                return {
                                                    ...service.getCOLvlFromAQI(aqi),
                                                    aqParam,
                                                    aqi,
                                                    aqAlertIndex: aqAlert.index,
                                                    aqAlertMessage: aqAlert.message,
                                                    aqParamColor: Theme.color.palette.pink
                                                };
                                            }
                                        })
                                    };
                                });
                            } else {
                                service.outgoing(EVENT.RESPONSE.TO.AQICN_AQR_FEED_DATA.NOT_FOUND).emit(() => {
                                    return {
                                        requestor,
                                        errorMessage: `AQICN api request feed data not found.`
                                    };
                                });
                            }
                        }).catch((error) => {
                            clearTimeout(timeoutId);
                            service.outgoing(EVENT.RESPONSE.TO.AQICN_AQR_FEED_DATA.ERROR).emit(() => {
                                return {
                                    requestor,
                                    errorMessage: `Unable to do get request, ${error.message}.`
                                };
                            });
                            Hf.log(`warn1`, `Unable to do get request, ${error.message}.`);
                        });
                    } else {
                        service.outgoing(EVENT.RESPONSE.TO.AQICN_AQR_FEED_DATA.ERROR).emit(() => {
                            return {
                                requestor,
                                errorMessage: `Invalid AQICN api request params.`
                            };
                        });
                        Hf.log(`warn1`, `Invalid AQICN api request params.`);
                    }
                } else {
                    service.outgoing(EVENT.RESPONSE.TO.AQICN_AQR_FEED_DATA.ERROR).emit(() => {
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
        service.setupAirNowGetAQRFeedDataAPI(jsonContentHeaders);
        service.setupAQICNGetAQRFeedDataAPI(jsonContentHeaders);
        done();
    },
    teardown (done) {
        done();
    }
});
export default AQRFeedAPIService;
