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
 * @module AQRSitesAPIService
 * @description - Virida client-native app air quality regional sites server api service.
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

const AQRSitesAPIService = Hf.Service.augment({
    composites: [
        AQAlertComposite
    ],
    setupAirNowGetAQRSiteDataAPI (jsonContentHeaders) {
        const service = this;

        service.incoming(EVENT.REQUEST.AIR_NOW_AQR_SITE_DATA).handle((requestor) => {
            const timeoutId = setTimeout(() => {
                service.outgoing(EVENT.RESPONSE.TO.AIR_NOW_AQR_SITE_DATA.TIMED_OUT).emit(() => {
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
                        bBox: {
                            neCoordinate: {
                                latitude: `number`,
                                longitude: `number`
                            },
                            swCoordinate: {
                                latitude: `number`,
                                longitude: `number`
                            }
                        }
                    }).of(requestor)) {
                        const {
                            aqParams,
                            timestamp,
                            bBox
                        } = requestor;
                        const bBoxPts = `${bBox.swCoordinate.longitude},${bBox.swCoordinate.latitude},${bBox.neCoordinate.longitude},${bBox.neCoordinate.latitude}`;
                        let url;

                        url = `${CONSTANT.URL.AIR_NOW_GET_AQR_SITE_DATA_API}?format=application/json&verbose=1&startDate=${moment(timestamp).utc().subtract(1, `minutes`).format(`YYYY-MM-DDThh`)}&endDate=${moment(timestamp).utc().format(`YYYY-MM-DDThh`)}&parameters=${aqParams}&BBOX=${bBoxPts}&dataType=B&API_KEY=${CONSTANT.API_KEY.AIR_NOW}`;
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
                                service.outgoing(EVENT.RESPONSE.TO.AIR_NOW_AQR_SITE_DATA.ERROR).emit();
                                Hf.log(`warn1`, `Server responsed with error status ${CONSTANT.HTTP.CODE.ERROR}.`);
                            }
                        }).then((results) => {
                            results = results.filter((result) => aqParams.includes(result.Parameter.toLowerCase().replace(/\./g, ``)));
                            if (Hf.isNonEmptyArray(results)) {
                                const aqrSites = results.map((result) => {
                                    const aqi = parseInt(result.AQI, 10) >= 0 ? parseInt(result.AQI, 10) : 0;
                                    const aqAlert = service.getAQIAlert(aqi);

                                    return {
                                        info: {
                                            code: result.IntlAQSCode,
                                            name: result.SiteName,
                                            latitude: result.Latitude,
                                            longitude: result.Longitude
                                        },
                                        aqSample: {
                                            aqParam: result.Parameter.toLowerCase().replace(/\./g, ``),
                                            aqi: aqi,
                                            aqAlertIndex: aqAlert.index,
                                            aqAlertMessage: aqAlert.message,
                                            aqUnit: `µg / m³`,
                                            aqConcentration: parseFloat(result.Value)
                                        }
                                    };
                                }).sort((resultA, resultB) => resultB.aqi - resultA.aqi).filter((result, index) => index <= CONSTANT.AQR.SITE_COUNT_LIMIT);
                                if (!Hf.isEmpty(aqrSites)) {
                                    service.outgoing(EVENT.RESPONSE.TO.AIR_NOW_AQR_SITE_DATA.OK).emit(() => {
                                        return {
                                            requestor,
                                            aqrInfo: {
                                                timestamp,
                                                bBox
                                            },
                                            aqrSites
                                        };
                                    });
                                } else {
                                    service.outgoing(EVENT.RESPONSE.TO.AIR_NOW_AQR_SITE_DATA.NOT_FOUND).emit(() => {
                                        return {
                                            requestor,
                                            errorMessage: `AirNow api request site data not found.`
                                        };
                                    });
                                }
                            } else {
                                service.outgoing(EVENT.RESPONSE.TO.AIR_NOW_AQR_SITE_DATA.NOT_FOUND).emit(() => {
                                    return {
                                        requestor,
                                        errorMessage: `AirNow api request site data not found.`
                                    };
                                });
                            }
                        }).catch((error) => {
                            clearTimeout(timeoutId);
                            service.outgoing(EVENT.RESPONSE.TO.AIR_NOW_AQR_SITE_DATA.ERROR).emit(() => {
                                return {
                                    requestor,
                                    errorMessage: `Unable to do get request, ${error.message}.`
                                };
                            });
                            Hf.log(`warn1`, `Unable to do get request, ${error.message}.`);
                        });
                    } else {
                        service.outgoing(EVENT.RESPONSE.TO.AIR_NOW_AQR_SITE_DATA.ERROR).emit(() => {
                            return {
                                requestor,
                                errorMessage: `Invalid AirNow api request params.`
                            };
                        });
                        Hf.log(`warn1`, `Invalid AirNow api request params.`);
                    }
                } else {
                    service.outgoing(EVENT.RESPONSE.TO.AIR_NOW_AQR_SITE_DATA.ERROR).emit(() => {
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
    setupAQICNGetAQRSiteDataAPI (jsonContentHeaders) {
        const service = this;

        service.incoming(EVENT.REQUEST.AQICN_AQR_SITE_DATA).delay(CONSTANT.HTTP.AQICN_API_REQUEST_DELAY_MS).handle((requestor) => {
            const timeoutId = setTimeout(() => {
                service.outgoing(EVENT.RESPONSE.TO.AQICN_AQR_SITE_DATA.TIMED_OUT).emit(() => {
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
                        bBox: {
                            neCoordinate: {
                                latitude: `number`,
                                longitude: `number`
                            },
                            swCoordinate: {
                                latitude: `number`,
                                longitude: `number`
                            }
                        }
                    }).of(requestor)) {
                        const {
                            // aqParams,
                            timestamp,
                            bBox
                        } = requestor;
                        const bBoxPts = `${bBox.swCoordinate.latitude},${bBox.swCoordinate.longitude},${bBox.neCoordinate.latitude},${bBox.neCoordinate.longitude}`;
                        let url;

                        url = `${CONSTANT.URL.AQICN_GET_AQR_SITE_DATA_API}?latlng=${bBoxPts}&token=${CONSTANT.API_KEY.AQICN}`;
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
                                service.outgoing(EVENT.RESPONSE.TO.AQICN_AQR_SITE_DATA.ERROR).emit();
                                Hf.log(`warn1`, `Server responsed with error status ${CONSTANT.HTTP.CODE.ERROR}.`);
                            }
                        }).then(({
                            status,
                            data
                        }) => {
                            if (status === `ok` && Hf.isNonEmptyArray(data)) {
                                const aqrSites = data.filter((result) => result.aqi !== `-`).map((result) => {
                                    const aqi = parseInt(result.aqi, 10) >= 0 ? parseInt(result.aqi, 10) : 0;
                                    const aqAlert = service.getAQIAlert(aqi);

                                    return {
                                        info: {
                                            code: `${result.uid}`,
                                            name: ``,
                                            latitude: result.lat,
                                            longitude: result.lon
                                        },
                                        aqSample: {
                                            ...service.getPM25LvlFromAQI(aqi),
                                            aqParam: `pm25`,
                                            aqi,
                                            aqAlertIndex: aqAlert.index,
                                            aqAlertMessage: aqAlert.message,
                                            aqParamColor: Theme.color.palette.teal
                                        }
                                    };
                                }).sort((resultA, resultB) => resultB.aqi - resultA.aqi).filter((result, index) => index <= CONSTANT.AQR.SITE_COUNT_LIMIT);
                                if (!Hf.isEmpty(aqrSites)) {
                                    service.outgoing(EVENT.RESPONSE.TO.AQICN_AQR_SITE_DATA.OK).emit(() => {
                                        return {
                                            requestor,
                                            aqrInfo: {
                                                timestamp,
                                                bBox
                                            },
                                            aqrSites
                                        };
                                    });
                                } else {
                                    service.outgoing(EVENT.RESPONSE.TO.AQICN_AQR_SITE_DATA.NOT_FOUND).emit(() => {
                                        return {
                                            requestor,
                                            errorMessage: `AQICN api request site data not found.`
                                        };
                                    });
                                }
                            } else {
                                service.outgoing(EVENT.RESPONSE.TO.AQICN_AQR_SITE_DATA.NOT_FOUND).emit(() => {
                                    return {
                                        requestor,
                                        errorMessage: `AQICN api request site data not found.`
                                    };
                                });
                            }
                        }).catch((error) => {
                            clearTimeout(timeoutId);
                            service.outgoing(EVENT.RESPONSE.TO.AQICN_AQR_SITE_DATA.ERROR).emit(() => {
                                return {
                                    requestor,
                                    errorMessage: `Unable to do get request, ${error.message}.`
                                };
                            });
                            Hf.log(`warn1`, `Unable to do get request, ${error.message}.`);
                        });
                    } else {
                        service.outgoing(EVENT.RESPONSE.TO.AQICN_AQR_SITE_DATA.ERROR).emit(() => {
                            return {
                                requestor,
                                errorMessage: `Invalid AQICN api request params.`
                            };
                        });
                        Hf.log(`warn1`, `Invalid AQICN api request params.`);
                    }
                } else {
                    service.outgoing(EVENT.RESPONSE.TO.AQICN_AQR_SITE_DATA.ERROR).emit(() => {
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
        service.setupAirNowGetAQRSiteDataAPI(jsonContentHeaders);
        service.setupAQICNGetAQRSiteDataAPI(jsonContentHeaders);
        done();
    },
    teardown (done) {
        done();
    }
});
export default AQRSitesAPIService;
