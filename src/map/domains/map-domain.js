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
 * @module MapDomain
 * @description - Virida client-native app setting domain.
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

import MapStore from '../stores/map-store';

import MapInterface from '../interfaces/map-interface';

import AQRSitesAPIService from '../../common/services/aqr-sites-api-service';

import MapUtilsComposite from '../composites/map-utils-composite';

import CONSTANT from '../../common/constant';

import EVENT from '../events/map-event';

const MapDomain = Hf.Domain.augment({
    composites: [
        MapUtilsComposite
    ],
    $init () {
        const domain = this;
        domain.register({
            store: MapStore({
                name: `map-store`
            }),
            intf: MapInterface({
                name: `map-interface`
            }),
            services: [
                AQRSitesAPIService({
                    name: `aqr-sites-api-service`
                })
            ]
        });
    },
    setup (done) {
        const domain = this;
        domain.incoming(EVENT.DO.MAP_RESET).repeat();

        domain.incoming(EVENT.BROADCAST.RUN_MODE).handle((runMode) => {
            return {
                idle: runMode === `background-running`
            };
        }).relay(EVENT.DO.MUTATE_MAP_STATUS);

        domain.incoming(EVENT.DO.MAP_ACTIVATION).handle((active) => {
            return {
                active
            };
        }).relay(EVENT.DO.MUTATE_MAP_STATUS);

        domain.incoming(EVENT.BROADCAST.DEVICE_ONLINE).handle((online) => {
            return {
                online
            };
        }).relay(EVENT.DO.MUTATE_MAP_STATUS);

        domain.incoming(EVENT.BROADCAST.DEVICE_GEOLOCATION_ONLINE).handle((geolocationOnline) => {
            return {
                geolocationOnline
            };
        }).relay(EVENT.DO.MUTATE_MAP_STATUS);

        domain.incoming(EVENT.BROADCAST.DEVICE_COORDINATE).handle((coordinate) => {
            return {
                timestamp: moment().format(),
                latitude: coordinate.latitude,
                longitude: coordinate.longitude,
                latitudeDelta: CONSTANT.MAP.LATITUDE_DELTA,
                longitudeDelta: CONSTANT.MAP.LONGITUDE_DELTA
            };
        }).relay(EVENT.DO.MUTATE_HOME_REGION);

        domain.incoming(EVENT.AS.HOME_REGION_MUTATED).handle(({
            homeRegion,
            aqrInfo
        }) => {
            const regionBBox = domain.getRegionBBox(homeRegion, CONSTANT.AQR.BBOX_DELTA_PADDING);

            if (!aqrInfo.status.availability.siteData) {
                domain.outgoing(EVENT.REQUEST.AQICN_AQR_SITE_DATA).emit(() => {
                    return {
                        aqParams: [ `pm25` ],
                        timestamp: homeRegion.timestamp,
                        bBox: regionBBox
                    };
                });
                domain.outgoing(EVENT.DO.MUTATE_AQR_INFO).emit(() => () => {
                    return {
                        aqr: {
                            info: {
                                timestamp: homeRegion.timestamp,
                                latitude: homeRegion.latitude,
                                longitude: homeRegion.longitude,
                                bBox: regionBBox,
                                status: {
                                    loading: !aqrInfo.status.availability.siteData
                                }
                            }
                        }
                    };
                });
            }
        });

        domain.incoming(EVENT.ON.REFRESH_AQR_SITE_DATA).forward(EVENT.DO.DEVICE_COORDINATE_REFRESH);

        domain.incoming(
            EVENT.ON.SELECT_AQR_SITE,
            EVENT.ON.DESELECT_AQR_SITE
        ).forward(EVENT.DO.MUTATE_SELECTED_AQR_SITE);

        domain.incoming(EVENT.ON.CHANGING_TO_NEW_REGION).handle(({
            aqrInfo,
            newRegion
        }) => {
            const {
                neCoordinate,
                swCoordinate
            } = domain.getRegionBBox(newRegion);

            if (!domain.isInsideRegionBBox(aqrInfo.bBox, neCoordinate) || !domain.isInsideRegionBBox(aqrInfo.bBox, swCoordinate)) {
                const regionBBox = domain.getRegionBBox(newRegion, CONSTANT.AQR.BBOX_DELTA_PADDING);

                domain.outgoing(EVENT.REQUEST.AQICN_AQR_SITE_DATA).emit(() => {
                    return {
                        aqParams: [ `pm25` ],
                        timestamp: newRegion.timestamp,
                        bBox: regionBBox
                    };
                });
                domain.outgoing(EVENT.DO.MUTATE_AQR_INFO).emit(() => () => {
                    return {
                        aqr: {
                            info: {
                                timestamp: newRegion.timestamp,
                                latitude: newRegion.latitude,
                                longitude: newRegion.longitude,
                                bBox: regionBBox,
                                status: {
                                    loading: true,
                                    availability: {
                                        siteData: false
                                    }
                                }
                            }
                        }
                    };
                });
            }
        });

        domain.incoming(
            EVENT.RESPONSE.TO.AQICN_AQR_SITE_DATA.OK,
            EVENT.RESPONSE.TO.AIR_NOW_AQR_SITE_DATA.OK
        ).handle(({
            aqrInfo,
            aqrSites
        }) => {
            if (Hf.isNonEmptyArray(aqrSites)) {
                domain.outgoing(EVENT.DO.MUTATE_AQR_SITES).emit(() => aqrSites);
                domain.outgoing(EVENT.DO.MUTATE_AQR_INFO).delay(CONSTANT.MAP.MARKER_TRACKING_DELAY_MS).emit(() => () => {
                    return {
                        aqr: {
                            info: {
                                ...aqrInfo,
                                status: {
                                    loading: false,
                                    availability: {
                                        siteData: true
                                    }
                                }
                            }
                        }
                    };
                });
                Hf.log(`info1`, `Received ${aqrSites.length} regional air quality site data from AQICN and/or AirNow .`);
            } else {
                domain.outgoing(EVENT.DO.MUTATE_AQR_INFO).delay(CONSTANT.MAP.MARKER_TRACKING_DELAY_MS).emit(() => () => {
                    return {
                        aqr: {
                            info: {
                                ...aqrInfo,
                                status: {
                                    loading: false,
                                    availability: {
                                        siteData: false
                                    }
                                }
                            }
                        }
                    };
                });
                Hf.log(`info1`, `Received 0 regional air quality site data from AQICN and/or AirNow .`);
            }
        });

        domain.incoming(
            EVENT.RESPONSE.TO.AQICN_AQR_SITE_DATA.NOT_FOUND,
            EVENT.RESPONSE.TO.AQICN_AQR_SITE_DATA.TIMED_OUT,
            EVENT.RESPONSE.TO.AQICN_AQR_SITE_DATA.ERROR
        ).handle(({
            requestor
        }) => {
            domain.outgoing(EVENT.REQUEST.AIR_NOW_AQR_SITE_DATA).emit(() => {
                return {
                    aqParams: [ `pm25` ],
                    timestamp: requestor.timestamp,
                    bBox: requestor.bBox
                };
            });
            Hf.log(`warn1`, `Unable to receive regional air quality site data from AQICN. Trying AirNow.`);
        });

        domain.incoming(
            EVENT.RESPONSE.TO.AIR_NOW_AQR_SITE_DATA.NOT_FOUND,
            EVENT.RESPONSE.TO.AIR_NOW_AQR_SITE_DATA.TIMED_OUT,
            EVENT.RESPONSE.TO.AIR_NOW_AQR_SITE_DATA.ERROR
        ).handle(() => {
            domain.outgoing(EVENT.DO.MUTATE_AQR_INFO).emit(() => () => {
                return {
                    aqr: {
                        info: {
                            status: {
                                loading: false,
                                availability: {
                                    siteData: false
                                }
                            }
                        }
                    }
                };
            });
            domain.outgoing(EVENT.BROADCAST.MAP_ALERT).emit(() => {
                return {
                    visible: true,
                    title: `Air Quality Site Map Alert`,
                    message: `Unable to Retrieve Regional Air Quality Site Data From.`
                };
            });
            Hf.log(`warn1`, `Unable to receive regional air quality site data from AirNow.`);
        });

        domain.incoming(EVENT.ON.TOGGLE_CITY_SUGGESTION_VISIBILITY).forward(EVENT.DO.MUTATE_CITY_SUGGESTION_VISIBILITY);

        domain.incoming(EVENT.ON.SHOW_AQ_ACTIONABLE_TIP_MODAL).forward(EVENT.DO.MUTATE_AQ_ACTIONABLE_TIP);

        domain.incoming(EVENT.ON.SHOW_AQ_WHATIS_MODAL).forward(EVENT.DO.MUTATE_AQ_WHATIS);

        domain.incoming(EVENT.ON.CLOSE_AQ_ACTIONABLE_TIP_MODAL).handle(() => {
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

        done();
    },
    teardown (done) {
        done();
    }
});
export default MapDomain;
