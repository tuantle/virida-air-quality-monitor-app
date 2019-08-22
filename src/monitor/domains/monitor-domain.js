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
 * @module MonitorDomain
 * @description - Virida client-native app air quality regional monitor (dust concentration PM25 and other pollutants) domain.
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

import MonitorStore from '../stores/monitor-store';

import MonitorInterface from '../interfaces/monitor-interface';

import AQRFeedAPIService from '../../common/services/aqr-feed-api-service';

import AQRForecastAPIService from '../../common/services/aqr-forecast-api-service';

import AQRNotificationAPIService from '../../common/services/aqr-notification-api-service';

import CONSTANT from '../../common/constant';

import EVENT from '../events/monitor-event';

const MonitorDomain = Hf.Domain.augment({
    $init () {
        const domain = this;
        domain.register({
            store: MonitorStore({
                name: `monitor-store`
            }),
            intf: MonitorInterface({
                name: `monitor-interface`
            }),
            services: [
                AQRFeedAPIService({
                    name: `aqr-feed-api-service`
                }),
                AQRForecastAPIService({
                    name: `aqr-forecast-api-service`
                }),
                AQRNotificationAPIService({
                    name: `aqr-notification-api-service`
                })
            ]
        });
    },
    setup (done) {
        const domain = this;

        domain.incoming(EVENT.DO.MONITOR_RESET).repeat();

        domain.incoming(EVENT.BROADCAST.SETTING_WRITTEN).handle(({
            notification
        }) => {
            if (Hf.isObject(notification)) {
                domain.outgoing(EVENT.DO.MUTATE_NOTIFICATION_SETTING).emit(() => notification);
            }
        });

        domain.incoming(EVENT.BROADCAST.RUN_MODE).handle((runMode) => {
            return {
                idle: runMode === `background-running`
            };
        }).relay(EVENT.DO.MUTATE_MONITOR_STATUS);

        domain.incoming(EVENT.DO.MONITOR_ACTIVATION).handle((active) => {
            return {
                active
            };
        }).relay(EVENT.DO.MUTATE_MONITOR_STATUS);

        domain.incoming(EVENT.BROADCAST.DEVICE_ONLINE).handle((online) => {
            return {
                online
            };
        }).relay(EVENT.DO.MUTATE_MONITOR_STATUS);

        domain.incoming(EVENT.BROADCAST.DEVICE_GEOLOCATION_ONLINE).handle((geolocationOnline) => {
            return {
                geolocationOnline
            };
        }).relay(EVENT.DO.MUTATE_MONITOR_STATUS);

        domain.incoming(EVENT.BROADCAST.DEVICE_COORDINATE).handle((coordinate) => {
            const region = {
                timestamp: moment().format(),
                latitude: coordinate.latitude,
                longitude: coordinate.longitude,
                radius: CONSTANT.AQR.SEARCH_RADIUS_MILE
            };

            domain.outgoing(EVENT.DO.MUTATE_AQR_INFO).emit(() => ({
                aqr
            }) => {
                let loading = false;

                if (!aqr.info.status.availability.feedData) {
                    loading = true;
                    domain.outgoing(EVENT.REQUEST.AQICN_AQR_FEED_DATA).emit(() => {
                        return {
                            ...region,
                            aqParams: [ `pm25`, `o3`, `no2`, `so2`, `co` ]
                        };
                    });
                }
                if (!aqr.info.status.availability.forecastData) {
                    loading = true;
                    domain.outgoing(EVENT.REQUEST.AIR_NOW_AQR_FORECAST_DATA).emit(() => {
                        return {
                            ...region,
                            aqParams: [ `pm25`, `o3`, `no2`, `so2`, `co` ]
                        };
                    });
                }
                return {
                    aqr: {
                        info: {
                            ...region,
                            status: {
                                loading
                            }
                        }
                    }
                };
            });
        });

        domain.incoming(EVENT.ON.REFRESH_AQR_FEED_DATA).handle(() => {
            domain.outgoing(EVENT.DO.MUTATE_AQR_INFO).emit(() => () => {
                return {
                    aqr: {
                        info: {
                            status: {
                                availability: {
                                    feedData: false
                                }
                            }
                        }
                    }
                };
            });
        }).relay(EVENT.DO.DEVICE_COORDINATE_REFRESH);

        domain.incoming(EVENT.ON.REFRESH_AQR_FORECAST_DATA).handle(() => {
            domain.outgoing(EVENT.DO.MUTATE_AQR_INFO).emit(() => () => {
                return {
                    aqr: {
                        info: {
                            status: {
                                availability: {
                                    forecastData: false
                                }
                            }
                        }
                    }
                };
            });
        }).relay(EVENT.DO.DEVICE_COORDINATE_REFRESH);

        domain.incoming(
            EVENT.RESPONSE.TO.AQICN_AQR_FEED_DATA.OK,
            EVENT.RESPONSE.TO.AIR_NOW_AQR_FEED_DATA.OK
        ).handle(({
            aqrInfo,
            aqrFeeds
        }) => {
            if (Hf.isNonEmptyArray(aqrFeeds)) {
                domain.outgoing(EVENT.DO.MUTATE_AQR_FEEDS).emit(() => aqrFeeds);
                domain.outgoing(EVENT.DO.MUTATE_AQR_INFO).emit(() => () => {
                    return {
                        aqr: {
                            info: {
                                ...aqrInfo,
                                status: {
                                    loading: false,
                                    availability: {
                                        feedData: true
                                    }
                                }
                            }
                        }
                    };
                });
                Hf.log(`info1`, `Received AQICN and/or AirNow regional air quality feed data.`);
            } else {
                domain.outgoing(EVENT.DO.MUTATE_AQR_INFO).emit(() => () => {
                    return {
                        aqr: {
                            info: {
                                ...aqrInfo,
                                status: {
                                    loading: false,
                                    availability: {
                                        feedData: false
                                    }
                                }
                            }
                        }
                    };
                });
                Hf.log(`info1`, `Received no AQICN and/or AirNow regional air quality feed data.`);
            }
        });

        domain.incoming(EVENT.RESPONSE.TO.AIR_NOW_AQR_FORECAST_DATA.OK).handle(({
            aqrInfo,
            aqrForecasts
        }) => {
            if (Hf.isNonEmptyArray(aqrForecasts)) {
                domain.outgoing(EVENT.DO.MUTATE_AQR_FORECASTS).emit(() => aqrForecasts);
                domain.outgoing(EVENT.DO.MUTATE_AQR_INFO).emit(() => () => {
                    return {
                        aqr: {
                            info: {
                                ...aqrInfo,
                                status: {
                                    loading: false,
                                    availability: {
                                        forecastData: true
                                    }
                                }
                            }
                        }
                    };
                });
                Hf.log(`info1`, `Received AirNow regional air quality forecast data.`);
            } else {
                domain.outgoing(EVENT.DO.MUTATE_AQR_INFO).emit(() => () => {
                    return {
                        aqr: {
                            info: {
                                ...aqrInfo,
                                status: {
                                    loading: false,
                                    availability: {
                                        forecastData: false
                                    }
                                }
                            }
                        }
                    };
                });
                Hf.log(`info1`, `Received no AirNow regional air quality forecast data.`);
            }
        });

        domain.incoming(
            EVENT.RESPONSE.TO.AQICN_AQR_FEED_DATA.NOT_FOUND,
            EVENT.RESPONSE.TO.AQICN_AQR_FEED_DATA.TIMED_OUT,
            EVENT.RESPONSE.TO.AQICN_AQR_FEED_DATA.ERROR
        ).handle(({
            requestor
        }) => {
            domain.outgoing(EVENT.REQUEST.AIR_NOW_AQR_FEED_DATA).emit(() => {
                return {
                    aqParams: [ `pm25`, `o3`, `no2`, `so2`, `co` ],
                    timestamp: requestor.timestamp,
                    latitude: requestor.latitude,
                    longitude: requestor.longitude,
                    radius: requestor.radius
                };
            });
            Hf.log(`warn1`, `Unable to received regional air quality feed data from AQICN. Trying AirNow.`);
        });

        domain.incoming(
            EVENT.RESPONSE.TO.AIR_NOW_AQR_FEED_DATA.NOT_FOUND,
            EVENT.RESPONSE.TO.AIR_NOW_AQR_FEED_DATA.TIMED_OUT,
            EVENT.RESPONSE.TO.AIR_NOW_AQR_FEED_DATA.ERROR
        ).handle(() => {
            domain.outgoing(EVENT.DO.MUTATE_AQR_INFO).emit(() => () => {
                return {
                    aqr: {
                        info: {
                            status: {
                                loading: false,
                                availability: {
                                    feedData: false
                                }
                            }
                        }
                    }
                };
            });
            domain.outgoing(EVENT.BROADCAST.MONITOR_ALERT).emit(() => {
                return {
                    visible: true,
                    title: `Regional Air Quality Monitor Alert`,
                    message: `Unable to Retrieve Regional Air Quality Feed Data.`
                };
            });
            Hf.log(`warn1`, `Unable to received regional air quality feed data from AirNow.`);
        });

        domain.incoming(
            EVENT.RESPONSE.TO.AIR_NOW_AQR_FORECAST_DATA.NOT_FOUND,
            EVENT.RESPONSE.TO.AIR_NOW_AQR_FORECAST_DATA.TIMED_OUT,
            EVENT.RESPONSE.TO.AIR_NOW_AQR_FORECAST_DATA.ERROR
        ).handle(() => {
            domain.outgoing(EVENT.DO.MUTATE_AQR_INFO).emit(() => () => {
                return {
                    aqr: {
                        info: {
                            status: {
                                loading: false,
                                availability: {
                                    forecastData: false
                                }
                            }
                        }
                    }
                };
            });
            // domain.outgoing(EVENT.BROADCAST.MONITOR_ALERT).emit(() => {
            //     return {
            //         visible: true,
            //         title: `Regional Air Quality Monitor Alert`,
            //         message: `Unable to Retrieve Regional Air Quality Forecast Data.`
            //     };
            // });
            Hf.log(`warn1`, `Unable to received regional air quality forecast data from AirNow.`);
        });

        domain.incoming(EVENT.ON.SHOW_AQ_ACTIONABLE_TIP_MODAL).handle((aqActionableTip) => {
            domain.outgoing(EVENT.DO.MUTATE_MONITOR_STATUS).emit(() => {
                return {
                    active: false
                };
            });
            return aqActionableTip;
        }).relay(EVENT.DO.MUTATE_AQ_ACTIONABLE_TIP);

        domain.incoming(EVENT.ON.SHOW_AQ_WHATIS_MODAL).handle((aqWhatis) => {
            domain.outgoing(EVENT.DO.MUTATE_MONITOR_STATUS).emit(() => {
                return {
                    active: false
                };
            });
            return aqWhatis;
        }).relay(EVENT.DO.MUTATE_AQ_WHATIS);

        domain.incoming(EVENT.ON.SHOW_AQ_FORECAST_DISCUSSION_MODAL).handle((aqForecastDiscussion) => {
            domain.outgoing(EVENT.DO.MUTATE_MONITOR_STATUS).emit(() => {
                return {
                    active: false
                };
            });
            return aqForecastDiscussion;
        }).relay(EVENT.DO.MUTATE_AQ_FORECAST_DISCUSSION);

        domain.incoming(EVENT.ON.CLOSE_AQ_ACTIONABLE_TIP_MODAL).handle(() => {
            domain.outgoing(EVENT.DO.MUTATE_MONITOR_STATUS).emit(() => {
                return {
                    active: true
                };
            });
            return {
                visible: false,
                aqSample: {
                    aqParam: ``,
                    aqAlertMessage: ``,
                    aqAlertIndex: 0,
                    aqi: 0
                }
            };
        }).relay(EVENT.DO.MUTATE_AQ_ACTIONABLE_TIP);

        domain.incoming(EVENT.ON.CLOSE_AQ_WHATIS_MODAL).handle(() => {
            domain.outgoing(EVENT.DO.MUTATE_MONITOR_STATUS).emit(() => {
                return {
                    active: true
                };
            });
            return {
                visible: false,
                aqSample: {
                    aqParam: ``,
                    aqAlertIndex: 0,
                    aqi: 0,
                    aqConcentration: 0,
                    aqUnit: ``,
                    aqParamColor: ``
                }
            };
        }).relay(EVENT.DO.MUTATE_AQ_WHATIS);

        domain.incoming(EVENT.ON.CLOSE_AQ_FORECAST_DISCUSSION_MODAL).handle(() => {
            domain.outgoing(EVENT.DO.MUTATE_MONITOR_STATUS).emit(() => {
                return {
                    active: true
                };
            });
            return {
                visible: false,
                message: ``
            };
        }).relay(EVENT.DO.MUTATE_AQ_FORECAST_DISCUSSION);

        done();
    },
    teardown (done) {
        done();
    }
});
export default MonitorDomain;
