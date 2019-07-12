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
 * @module AQRNotificationAPIService
 * @description - Virida client-native app air quality regional notification server api service.
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

import BackgroundGeolocation from 'react-native-background-geolocation';

import BackgroundFetch from 'react-native-background-fetch';

import PushNotification from 'react-native-push-notification';

import AQAlertComposite from '../composites/aq-alert-composite';

import CONSTANT from '../constant';

import EVENT from '../events/aqr-api-event';

const {
    PushNotificationIOS
} = ReactNative;

const AQRNotificationAPIService = Hf.Service.augment({
    composites: [
        Hf.State.MutationComposite,
        AQAlertComposite
    ],
    state: {
        notification: {
            value: {
                unhealthyAQAlert: true,
                dailyAQAlert: true,
                scheduledTime: {
                    dailyAQAlert: moment(CONSTANT.NOTIFICATION.DAILY_AQ_ALERT_TIME, `h:mm:ssa`).add(24, `hours`).format()
                }
            }
        }
    },
    $init () {
        const service = this;
        PushNotification.configure({
            onNotification: service.onNotification,
            popInitialNotification: true,
            requestPermissions: true,
            'content-available': 1
        });
    },
    onNotification ({
        userInteraction,
        foreground,
        finish
    }) {
        if (!userInteraction) {
            PushNotification.setApplicationIconBadgeNumber(0);
        }
        if (foreground) {
            PushNotification.setApplicationIconBadgeNumber(0);
        }
        finish(PushNotificationIOS.FetchResult.NoData);
        Hf.log(`info1`, `AQ alert notification pushed.`);
    },
    setupAirNowAQRAlertNotification (jsonContentHeaders) {
        const service = this;

        BackgroundFetch.configure({
            minimumFetchInterval: CONSTANT.GENERAL.BACKGROUND_HEARTBEAT_INTERVAL_M,
            stopOnTerminate: false,
            startOnBoot: true
        }, () => {
            if (service.notification.unhealthyAQAlert || service.notification.dailyAQAlert) {
                BackgroundGeolocation.getCurrentPosition({
                    samples: 1,
                    persist: false
                }).then(({
                    activity,
                    coords: coordinate
                }) => {
                    NetInfo.isConnected.fetch().then((online) => {
                        if (online) {
                            const duration = moment.duration(moment().diff(moment(service.notification.scheduledTime.dailyAQAlert)));
                            let url = `${CONSTANT.URL.AIR_NOW_GET_AQR_FEED_DATA_API}?format=application/json&latitude=`;

                            url = `${url}${coordinate.latitude}&longitude=${coordinate.longitude}&distance=${CONSTANT.AQR.SEARCH_RADIUS_MILE * 2}&API_KEY=${CONSTANT.API_KEY.AIR_NOW}`;
                            fetch(url, {
                                method: `get`,
                                headers: jsonContentHeaders
                            }).then((response) => {
                                if (response.status === CONSTANT.HTTP.CODE.OK) {
                                    Hf.log(`info1`, `AirNow server responsed with status ${CONSTANT.HTTP.CODE.OK}.`);
                                    return response.json();
                                } else if (response.status === CONSTANT.HTTP.CODE.ERROR || response.status === CONSTANT.HTTP.CODE.BAD_GATEWAY_ERROR) {
                                    Hf.log(`warn1`, `Server responsed with error status ${CONSTANT.HTTP.CODE.ERROR}.`);
                                }
                            }).then((results) => {
                                const result = results.find((_result) => _result.ParameterName === `PM2.5`);

                                if (Hf.isObject(result)) {
                                    const aqAlert = service.getAQIAlert(parseInt(result.AQI, 10) >= 0 ? parseInt(result.AQI, 10) : 0);

                                    // PushNotification.localNotification({
                                    //     title: `TEST Alert!!!`,
                                    //     message: `Current Air Quality Is ${aqAlert.message} With AQI = ${aqAlert.aqi} - Activity is ${activity.type}.`,
                                    //     playSound: true,
                                    //     soundName: `default`
                                    // });

                                    if (service.notification.unhealthyAQAlert &&
                                        aqAlert.aqi >= 200 ||
                                       ((activity.type === `still` && aqAlert.aqi >= 150) ||
                                       ((activity.type === `on_foot` || activity.type === `running` || activity.type === `on_bicycle`) && aqAlert.aqi >= 100))) {
                                        PushNotification.localNotification({
                                            title: `Unhealthy Air Quality Alert!!!`,
                                            message: `Current Air Quality Is ${aqAlert.message} With AQI = ${aqAlert.aqi}`,
                                            playSound: true,
                                            soundName: `default`
                                        });
                                    }
                                    if (service.notification.dailyAQAlert && duration.asMilliseconds() >= 0) {
                                        PushNotification.localNotification({
                                            title: `Daily Air Quality Alert`,
                                            message: `Current Air Quality Is ${aqAlert.message} With AQI = ${aqAlert.aqi}`,
                                            playSound: true,
                                            soundName: `default`
                                        });
                                        service.reduce({
                                            notification: {
                                                scheduledTime: {
                                                    dailyAQAlert: moment(CONSTANT.NOTIFICATION.DAILY_AQ_ALERT_TIME, `h:mm:ssa`).add(24, `hours`).format()
                                                }
                                            }
                                        });
                                        Hf.log(`info1`, `Next daily air quality alert notification scheduled.`);
                                    } else {
                                        Hf.log(`info1`, `Time until next daily air quality alert notification ${duration.asMilliseconds()}.`);
                                    }
                                }
                                BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
                            }).catch((error) => {
                                BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
                                Hf.log(`warn1`, `Unable to do get request, ${error.message}.`);
                            });
                        }
                    });
                }).catch((error) => {
                    BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
                    switch (error) { // eslint-disable-line
                    case 0:
                        Hf.log(`warn1`, `Unable to get device's geolocation. Location unknown.`);
                        break;
                    case 1:
                        Hf.log(`warn1`, `Unable to get device's geolocation. Location permission denied.`);
                        break;
                    case 2:
                        Hf.log(`warn1`, `Unable to get device's geolocation. Network error.`);
                        break;
                    case 408:
                        Hf.log(`warn1`, `Unable to get device's geolocation. Location timeout.`);
                        break;
                    }
                });
            } else {
                BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
            }
        }, (error) => {
            Hf.log(`warn1`, `Unable to start background fetching. ${error.message}.`);
        });
        BackgroundFetch.status((status) => {
            switch(status) { // eslint-disable-line
            case BackgroundFetch.STATUS_RESTRICTED:
                Hf.log(`warn1`, `Background fetching restricted.`);
                break;
            case BackgroundFetch.STATUS_DENIED:
                Hf.log(`warn1`, `Background fetching denied.`);
                break;
            case BackgroundFetch.STATUS_AVAILABLE:
                Hf.log(`info1`, `Starting background fetching.`);
                break;
            }
        });
    },
    setupAQICNAQRAlertNotification (jsonContentHeaders) {
        const service = this;

        BackgroundFetch.configure({
            minimumFetchInterval: CONSTANT.GENERAL.BACKGROUND_HEARTBEAT_INTERVAL_M,
            stopOnTerminate: false,
            startOnBoot: true
        }, () => {
            if (service.notification.unhealthyAQAlert || service.notification.dailyAQAlert) {
                BackgroundGeolocation.getCurrentPosition({
                    samples: 1,
                    persist: false
                }).then(({
                    activity,
                    coords: coordinate
                }) => {
                    NetInfo.isConnected.fetch().then((online) => {
                        if (online) {
                            const duration = moment.duration(moment().diff(moment(service.notification.scheduledTime.dailyAQAlert)));
                            const url = `${CONSTANT.URL.AQICN_GET_AQR_FEED_DATA_API}geo:${coordinate.latitude};${coordinate.longitude}/?token=${CONSTANT.API_KEY.AQICN}`;

                            fetch(url, {
                                method: `get`,
                                headers: jsonContentHeaders
                            }).then((response) => {
                                if (response.status === CONSTANT.HTTP.CODE.OK) {
                                    Hf.log(`info1`, `AQICN server responsed with status ${CONSTANT.HTTP.CODE.OK}.`);
                                    return response.json();
                                } else if (response.status === CONSTANT.HTTP.CODE.ERROR || response.status === CONSTANT.HTTP.CODE.BAD_GATEWAY_ERROR) {
                                    Hf.log(`warn1`, `Server responsed with error status ${CONSTANT.HTTP.CODE.ERROR}.`);
                                }
                            }).then(({
                                status,
                                data
                            }) => {
                                if (status === `ok` && Hf.isObject(data) && Hf.isObject(data) && Hf.isObject(data.iaqi.pm25)) {
                                    const aqi = parseInt(data.iaqi.pm25.v, 10);
                                    const aqAlert = service.getAQIAlert(parseInt(aqi, 10) >= 0 ? parseInt(aqi, 10) : 0);

                                    // PushNotification.localNotification({
                                    //     title: `TEST Alert!!!`,
                                    //     message: `Current Air Quality Is ${aqAlert.message} With AQI = ${aqAlert.aqi} - Activity is ${activity.type}.`,
                                    //     playSound: true,
                                    //     soundName: `default`
                                    // });

                                    if (service.notification.unhealthyAQAlert &&
                                        aqAlert.aqi >= 200 ||
                                       ((activity.type === `still` && aqAlert.aqi >= 150) ||
                                       ((activity.type === `on_foot` || activity.type === `running` || activity.type === `on_bicycle`) && aqAlert.aqi >= 100))) {
                                        PushNotification.localNotification({
                                            title: `Unhealthy Air Quality Alert!!!`,
                                            message: `Current Air Quality Is ${aqAlert.message} With AQI = ${aqAlert.aqi}`,
                                            playSound: true,
                                            soundName: `default`
                                        });
                                    }
                                    if (service.notification.dailyAQAlert && duration.asMilliseconds() >= 0) {
                                        PushNotification.localNotification({
                                            title: `Daily Air Quality Alert`,
                                            message: `Current Air Quality Is ${aqAlert.message} With AQI = ${aqAlert.aqi}`,
                                            playSound: true,
                                            soundName: `default`
                                        });
                                        service.reduce({
                                            notification: {
                                                scheduledTime: {
                                                    dailyAQAlert: moment(CONSTANT.NOTIFICATION.DAILY_AQ_ALERT_TIME, `h:mm:ssa`).add(24, `hours`).format()
                                                }
                                            }
                                        });
                                        Hf.log(`info1`, `Next daily air quality alert notification scheduled.`);
                                    } else {
                                        Hf.log(`info1`, `Time until next daily air quality alert notification ${duration.asMilliseconds()}.`);
                                    }
                                }
                                BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
                            }).catch((error) => {
                                BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
                                Hf.log(`warn1`, `Unable to do get request, ${error.message}.`);
                            });
                        }
                    });
                }).catch((error) => {
                    BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
                    switch (error) { // eslint-disable-line
                    case 0:
                        Hf.log(`warn1`, `Unable to get device's geolocation. Location unknown.`);
                        break;
                    case 1:
                        Hf.log(`warn1`, `Unable to get device's geolocation. Location permission denied.`);
                        break;
                    case 2:
                        Hf.log(`warn1`, `Unable to get device's geolocation. Network error.`);
                        break;
                    case 408:
                        Hf.log(`warn1`, `Unable to get device's geolocation. Location timeout.`);
                        break;
                    }
                });
            } else {
                BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
            }
        }, (error) => {
            Hf.log(`warn1`, `Unable to start background fetching. ${error.message}.`);
        });
        BackgroundFetch.status((status) => {
            switch(status) { // eslint-disable-line
            case BackgroundFetch.STATUS_RESTRICTED:
                Hf.log(`warn1`, `Background fetching restricted.`);
                break;
            case BackgroundFetch.STATUS_DENIED:
                Hf.log(`warn1`, `Background fetching denied.`);
                break;
            case BackgroundFetch.STATUS_AVAILABLE:
                Hf.log(`info1`, `Starting background fetching.`);
                break;
            }
        });
    },
    setup (done) {
        const service = this;
        const jsonContentHeaders = new Headers();

        jsonContentHeaders.append(`Accept`, `gzip`);
        jsonContentHeaders.append(`Accept`, `deflate`);
        jsonContentHeaders.append(`Accept`, `application/json`);
        jsonContentHeaders.append(`Content-Type`, `application/json`);
        // service.setupAirNowAQRAlertNotification(jsonContentHeaders);
        service.setupAQICNAQRAlertNotification(jsonContentHeaders);

        service.incoming(EVENT.DO.MUTATE_NOTIFICATION_SETTING).handle((notification) => {
            if (service.reduce({
                notification
            })) {
                Hf.log(`info1`, `Air quality notification setting updated.`);
            }
        });
        done();
    },
    teardown (done) {
        BackgroundFetch.stop(() => {
            Hf.log(`info1`, `Stopping background fetching.`);
        }, (error) => {
            Hf.log(`warn1`, `Unable to stop background fetching. ${error.message}.`);
        });
        done();
    }
});
export default AQRNotificationAPIService;
