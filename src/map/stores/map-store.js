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
 * @module MapStore
 * @description - Virida client-native app map store.
 *
 * @author Tuan Le (tuan.t.lei@gmail.com)
 *
 *------------------------------------------------------------------------
 * @format
 * @flow
 */
'use strict'; // eslint-disable-line

import { Hf } from 'hyperflow';

import EVENT from '../events/map-event';

const MapStore = Hf.Store.augment({
    state: {
        citySuggestionVisible: false,
        status: {
            active: false,
            idle: false,
            online: true,
            geolocationOnline: true
        },
        homeRegion: {
            timestamp: ``,
            latitude: 0,
            longitude: 0,
            latitudeDelta: 0,
            longitudeDelta: 0
        },
        aqr: {
            info: {
                timestamp: ``,
                latitude: 0,
                longitude: 0,
                bBox: {
                    neCoordinate: {
                        latitude: 0,
                        longitude: 0
                    },
                    swCoordinate: {
                        latitude: 0,
                        longitude: 0
                    }
                },
                status: {
                    loading: false,
                    availability: {
                        siteData: false
                    }
                }
            },
            selectedSiteCode: ``,
            sites: []
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
        }
    },
    setup (done) {
        const store = this;

        store.incoming(EVENT.DO.MAP_RESET).handle(() => {
            store.reconfig({
                citySuggestionVisible: false,
                status: {
                    active: false,
                    idle: false,
                    online: true,
                    geolocationOnline: true
                },
                homeRegion: {
                    timestamp: ``,
                    radius: 0,
                    latitude: 0,
                    longitude: 0,
                    latitudeDelta: 0,
                    longitudeDelta: 0
                },
                aqr: {
                    info: {
                        timestamp: ``,
                        latitude: 0,
                        longitude: 0,
                        bBox: {
                            neCoordinate: {
                                latitude: 0,
                                longitude: 0
                            },
                            swCoordinate: {
                                latitude: 0,
                                longitude: 0
                            }
                        },
                        status: {
                            loading: false,
                            availability: {
                                siteData: false
                            }
                        }
                    },
                    selectedSiteCode: ``,
                    sites: []
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
                }
            }, {
                suppressMutationEvent: true
            });
        });

        store.incoming(EVENT.DO.MUTATE_MAP_STATUS).handle((status) => {
            store.reduce({
                status
            });
        });

        store.incoming(EVENT.DO.MUTATE_HOME_REGION).handle((homeRegion) => {
            if(store.reduce({
                homeRegion
            }, {
                suppressMutationEvent: true
            })) {
                store.outgoing(EVENT.AS.HOME_REGION_MUTATED).emit(() => {
                    return {
                        homeRegion: store.homeRegion,
                        aqrInfo: store.aqr.info
                    };
                });
            }
        });

        store.incoming(EVENT.DO.MUTATE_AQR_INFO).handle((mutateAQRInfo) => {
            store.reduce(mutateAQRInfo, {
                suppressMutationEvent: !store.status.active || store.status.idle
            });
        });

        store.incoming(EVENT.DO.MUTATE_SELECTED_AQR_SITE).handle((selectedAQRSiteCode) => {
            store.reduce({
                aqr: {
                    selectedSiteCode: selectedAQRSiteCode
                }
            }, {
                suppressMutationEvent: !store.status.active || store.status.idle
            });
        });

        store.incoming(EVENT.DO.MUTATE_AQR_SITES).handle((aqrSites) => {
            store.reconfig({
                aqr: {
                    sites: aqrSites
                }
            }, {
                suppressMutationEvent: !store.status.active || store.status.idle
            });
        });

        store.incoming(EVENT.DO.MUTATE_CITY_SUGGESTION_VISIBILITY).handle(() => {
            store.reduce({
                citySuggestionVisible: !store.citySuggestionVisible
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

        done();
    },
    teardown (done) {
        done();
    }
});
export default MapStore;
