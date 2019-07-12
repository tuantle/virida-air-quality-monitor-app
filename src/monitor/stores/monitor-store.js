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
 * @module MonitorStore
 * @description - Virida client-native app air quality monitor (regional dust concentration PM25 and other pollutants) store.
 *
 * @author Tuan Le (tuan.t.lei@gmail.com)
 *
 *------------------------------------------------------------------------
 * @format
 * @flow
 */
'use strict'; // eslint-disable-line

import { Hf } from 'hyperflow';

import EVENT from '../events/monitor-event';

const MonitorStore = Hf.Store.augment({
    state: {
        status: {
            active: false,
            idle: false,
            online: true,
            geolocationOnline: true
        },
        aqr: {
            info: {
                name: ``,
                timestamp: ``,
                radius: 0,
                latitude: 0,
                longitude: 0,
                status: {
                    loading: false,
                    availability: {
                        feedData: false,
                        forecastData: false
                    }
                }
            },
            feeds: [],
            forecasts: []
        },
        aqActionableTip: {
            visible: false,
            aqSample: {
                aqParam: ``,
                aqAlertMessage: ``,
                aqAlertIndex: 0,
                aqi: 0
            }
        },
        aqWhatis: {
            visible: false,
            aqSample: {
                aqParam: ``,
                aqAlertIndex: 0,
                aqi: 0,
                aqConcentration: 0,
                aqUnit: ``,
                aqParamColor: ``
            }
        },
        aqForecastDiscussion: {
            visible: false,
            message: ``
        }
    },
    setup (done) {
        const store = this;

        store.incoming(EVENT.DO.MONITOR_RESET).handle(() => {
            store.reconfig({
                status: {
                    active: false,
                    idle: false,
                    online: true,
                    geolocationOnline: true
                },
                aqr: {
                    info: {
                        name: ``,
                        timestamp: ``,
                        radius: 0,
                        latitude: 0,
                        longitude: 0,
                        status: {
                            loading: false,
                            availability: {
                                feedData: false,
                                forecastData: false
                            }
                        }
                    },
                    feeds: [],
                    forecasts: []
                },
                aqActionableTip: {
                    visible: false,
                    aqSample: {
                        aqParam: ``,
                        aqAlertMessage: ``,
                        aqAlertIndex: 0,
                        aqi: 0
                    }
                },
                aqWhatis: {
                    visible: false,
                    aqSample: {
                        aqParam: ``,
                        aqAlertIndex: 0,
                        aqi: 0,
                        aqConcentration: 0,
                        aqUnit: ``,
                        aqParamColor: ``
                    }
                },
                aqForecastDiscussion: {
                    visible: false,
                    message: ``
                }
            }, {
                suppressMutationEvent: true
            });
        });

        store.incoming(EVENT.DO.MUTATE_MONITOR_STATUS).handle((status) => {
            store.reduce({
                status
            });
        });

        store.incoming(EVENT.DO.MUTATE_AQR_INFO).handle((mutateAQRInfo) => {
            store.reduce(mutateAQRInfo, {
                suppressMutationEvent: !store.status.active || store.status.idle
            });
        });

        store.incoming(EVENT.DO.MUTATE_AQR_FEEDS).handle((aqrFeeds) => {
            store.reconfig({
                aqr: {
                    feeds: aqrFeeds
                }
            }, {
                suppressMutationEvent: !store.status.active || store.status.idle
            });
        });

        store.incoming(EVENT.DO.MUTATE_AQR_FORECASTS).handle((aqrForecasts) => {
            store.reconfig({
                aqr: {
                    forecasts: aqrForecasts
                }
            }, {
                suppressMutationEvent: !store.status.active || store.status.idle
            });
        });

        store.incoming(EVENT.DO.MUTATE_AQ_ACTIONABLE_TIP).handle((aqActionableTip) => {
            store.reduce({
                aqActionableTip
            });
        });

        store.incoming(EVENT.DO.MUTATE_AQ_WHATIS).handle((aqWhatis) => {
            store.reduce({
                aqWhatis
            });
        });

        store.incoming(EVENT.DO.MUTATE_AQ_FORECAST_DISCUSSION).handle((aqForecastDiscussion) => {
            store.reduce({
                aqForecastDiscussion
            });
        });

        done();
    },
    teardown (done) {
        done();
    }
});
export default MonitorStore;
