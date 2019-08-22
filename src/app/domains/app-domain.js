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
 * @module AppDomain
 * @description - Virida client-native app domain.
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

import CodePush from 'react-native-code-push';

import BackgroundGeolocation from 'react-native-background-geolocation';

import AppStore from '../stores/app-store';

import AppInterface from '../interfaces/app-interface';

import StorageService from '../../common/services/storage-service';

import GeolocationService from '../../common/services/geolocation-service';

import MonitorDomain from '../../monitor/domains/monitor-domain';

import MapDomain from '../../map/domains/map-domain';

import SettingDomain from '../../setting/domains/setting-domain';

import CONSTANT from '../../common/constant';

import EVENT from '../events/app-event';

const {
    AppState
} = ReactNative;

let periodicRefreshIntervalId = null;

const AppDomain = Hf.Domain.augment({
    $init () {
        const domain = this;
        domain.register({
            store: AppStore({
                name: `app-store`
            }),
            intf: AppInterface({
                name: `app-interface`
            }),
            services: [
                StorageService({
                    name: `storage-service`
                }),
                GeolocationService({
                    name: `geolocation-service`
                })
            ],
            childDomains: [
                MonitorDomain({
                    name: `monitor`
                }),
                MapDomain({
                    name: `map`
                }),
                SettingDomain({
                    name: `setting`
                })
            ]
        });

        CodePush.sync({
            // updateDialog: false,
            updateDialog: {
                updateTitle: `A New Update Is Available`,
                optionalUpdateMessage: `Install Update?`,
                optionalIgnoreButtonLabel: `Yes`,
                optionalInstallButtonLabel: `No`
            },
            checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
            installMode: CodePush.InstallMode.ON_NEXT_RESUME // codePush.InstallMode.ON_NEXT_SUSPEND
        }, (syncStatus) => {
            switch (syncStatus) { // eslint-disable-line
            case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
                Hf.log(`info1`, `Code push is checking for new update.`);
                break;
            case CodePush.SyncStatus.AWAITING_USER_ACTION:
                Hf.log(`info1`, `Code push is waiting for user interaction.`);
                break;
            case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
                Hf.log(`info1`, `Code push is downloading new update.`);
                break;
            case CodePush.SyncStatus.INSTALLING_UPDATE:
                Hf.log(`info1`, `Code push is installing new update.`);
                break;
            case CodePush.SyncStatus.UP_TO_DATE:
                Hf.log(`info1`, `Code push shows app is uptodate.`);
                break;
            case CodePush.SyncStatus.UPDATE_IGNORED:
                Hf.log(`info1`, `Code push update cancelled by user.`);
                break;
            case CodePush.SyncStatus.UPDATE_INSTALLED:
                Hf.log(`info1`, `Code push update installed and will be applied on restart.`);
                break;
            case CodePush.SyncStatus.UNKNOWN_ERROR:
                Hf.log(`info1`, `Code push received an unknown error status.`);
                break;
            }
        }, (downloadProgress) => {
            if (Hf.isObject(downloadProgress)) {
                Hf.log(`info1`, `Code push sync downloading ${downloadProgress.receivedBytes} of ${downloadProgress.totalBytes}.`);
            }
        });

        BackgroundGeolocation.ready({
            foregroundService: false,
            forceReloadOnHeartbeat: false,
            stopOnTerminate: true,
            startOnBoot: false,
            preventSuspend: false,
            debug: false, // Hf.DEVELOPMENT,
            maxRecordsToPersist: 1,
            distanceFilter: 10,
            stopTimeout: 1,
            // heartbeatInterval: CONSTANT.GENERAL.BACKGROUND_HEARTBEAT_INTERVAL_M * 60,
            desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_LOW,
            // notificationPriority: BackgroundGeolocation.NOTIFICATION_PRIORITY_MIN,
            logLevel: BackgroundGeolocation.LOG_LEVEL_OFF // Hf.DEVELOPMENT ? BackgroundGeolocation.LOG_LEVEL_VERBOSE : BackgroundGeolocation.LOG_LEVEL_OFF
        }).then(({
            enabled
        }) => {
            if (enabled) {
                BackgroundGeolocation.stop(() => {
                    Hf.log(`info1`, `Initially stop background geolocation tracking.`);
                }, (error) => {
                    Hf.log(`warn1`, `Unable to stop background geolocation tracking. ${error.message}.`);
                });
            }
            Hf.log(`info1`, `Background geolocation tracking ready.`);
        }).catch((error) => {
            switch (error) { // eslint-disable-line
            case 0:
                Hf.log(`warn1`, `Unable to create background geolocation tracking. Location unknown.`);
                break;
            case 1:
                Hf.log(`warn1`, `Unable to create background geolocation tracking. Location permission denied.`);
                break;
            case 2:
                Hf.log(`warn1`, `Unable to create background geolocation tracking. Network error.`);
                break;
            case 408:
                Hf.log(`warn1`, `Unable to create background geolocation tracking. Location timeout.`);
                break;
            }
        });
    },
    setup (done) {
        const domain = this;

        domain.outgoing(EVENT.DO.STORAGE_INITIALIZATION).emit();

        domain.incoming(EVENT.AS.STORAGE_INITIALIZED).handle(() => {
            BackgroundGeolocation.start(() => {
                Hf.log(`info1`, `Starting background geolocation tracking.`);
            }, (error) => {
                Hf.log(`warn1`, `Unable to start background geolocation tracking. ${error.message}.`);
            });

            AppState.addEventListener(`change`, (nextAppState) => {
                let nextRunMode;
                domain.outgoing(EVENT.DO.MUTATE_RUN_MODE).emit(() => ({
                    runMode
                }) => {
                    if (runMode === `background-running` && nextAppState === `active`) {
                        domain.outgoing(EVENT.BROADCAST.RUN_MODE).emit(() => `foreground-running`);
                        nextRunMode = `foreground-running`;
                        Hf.log(`info1`, `Entering foreground run mode.`);
                    } else if (runMode === `foreground-running` && (nextAppState === `background` || nextAppState === `inactive `)) {
                        domain.outgoing(EVENT.BROADCAST.RUN_MODE).emit(() => `background-running`);
                        nextRunMode = `background-running`;
                        Hf.log(`info1`, `Entering background run mode.`);
                    } else {
                        nextRunMode = runMode;
                    }
                    return {
                        runMode: nextRunMode
                    };
                });
            });

            NetInfo.addEventListener(`connectionChange`, (connectionInfo) => {
                if (connectionInfo.type !== `none`) {
                    domain.outgoing(EVENT.BROADCAST.DEVICE_ONLINE).emit(() => true);
                    Hf.log(`info1`, `Device is online.`);
                } else {
                    domain.outgoing(EVENT.BROADCAST.DEVICE_ONLINE).emit(() => false);
                    Hf.log(`info1`, `Device is offline.`);
                }
            });

            if (periodicRefreshIntervalId !== null) {
                clearInterval(periodicRefreshIntervalId);
            }
            periodicRefreshIntervalId = setInterval(() => {
                domain.outgoing(EVENT.REQUEST.DEVICE_COORDINATE).emit();
            }, CONSTANT.GENERAL.PERIODIC_REFRESH_INTERVAL_MS);
            Hf.log(`info1`, `Starting periodic refresh.`);

            domain.outgoing(EVENT.DO.MUTATE_STORAGE_INITIALIZED).delay(CONSTANT.GENERAL.STARTUP_DELAY_MS).emit(() => true);
        }).relay(EVENT.REQUEST.READ_SETTING);

        domain.incoming(EVENT.RESPONSE.TO.READ_SETTING.OK).handle(({
            showIntro
        }) => {
            if (showIntro) {
                domain.outgoing(EVENT.DO.MUTATE_SHOW_INTRO).emit(() => true);
                domain.outgoing(EVENT.DO.MONITOR_ACTIVATION).emit(() => false);
            } else {
                domain.outgoing(EVENT.DO.MUTATE_SHOW_INTRO).emit(() => false);
                domain.outgoing(EVENT.DO.MONITOR_ACTIVATION).emit(() => true);
                domain.outgoing(EVENT.REQUEST.DEVICE_COORDINATE).emit();
            }
        });

        domain.incoming(
            EVENT.ON.INTRO_FINISHED,
            EVENT.ON.INTRO_SKIPPED
        ).handle(() => {
            domain.outgoing(EVENT.DO.MUTATE_SHOW_INTRO).emit(() => false);
            domain.outgoing(EVENT.DO.MONITOR_ACTIVATION).emit(() => true);
            domain.outgoing(EVENT.REQUEST.DEVICE_COORDINATE).emit();
        });

        domain.incoming(EVENT.AS.RESET).handle(() => {
            domain.outgoing(
                EVENT.DO.MONITOR_ACTIVATION,
                EVENT.DO.MAP_ACTIVATION,
                EVENT.DO.SETTING_ACTIVATION
            ).emit(() => false);
            domain.outgoing(
                EVENT.DO.MONITOR_RESET,
                EVENT.DO.MAP_RESET,
                EVENT.DO.SETTING_RESET
            ).emit();
        });

        domain.incoming(EVENT.RESPONSE.TO.WRITE_SETTING.OK).forward(EVENT.BROADCAST.SETTING_WRITTEN);

        domain.incoming(EVENT.BROADCAST.SETTING_WRITTEN).repeat();

        domain.incoming(EVENT.DO.DEVICE_COORDINATE_REFRESH).forward(EVENT.REQUEST.DEVICE_COORDINATE);

        domain.incoming(
            EVENT.RESPONSE.TO.DEVICE_COORDINATE.OK,
            EVENT.AS.DEVICE_COORDINATE_REFRESHED
        ).handle((coordinate) => {
            domain.outgoing(EVENT.BROADCAST.DEVICE_GEOLOCATION_ONLINE).emit(() => true);
            return coordinate;
        }).relay(EVENT.BROADCAST.DEVICE_COORDINATE);

        domain.incoming(
            EVENT.RESPONSE.TO.READ_SETTING.NOT_FOUND,
            EVENT.RESPONSE.TO.READ_SETTING.ERROR,
        ).handle(() => {
            return {
                visible: true,
                title: `App Storage`,
                message: `Unable To Read Data From Storage.`
            };
        }).relay(EVENT.DO.MUTATE_ALERT);

        domain.incoming(EVENT.RESPONSE.TO.WRITE_SETTING.ERROR).handle(() => {
            return {
                visible: true,
                title: `App Storage`,
                message: `Unable To Write Data To Storage.`
            };
        }).relay(EVENT.DO.MUTATE_ALERT);

        domain.incoming(EVENT.RESPONSE.TO.DEVICE_COORDINATE.ERROR).handle(() => {
            return {
                visible: true,
                title: `Geolocation`,
                message: `Unable To Get Device's Geolocation.`
            };
        }).relay(EVENT.DO.MUTATE_ALERT);

        domain.incoming(
            EVENT.BROADCAST.MONITOR_ALERT,
            EVENT.BROADCAST.MAP_ALERT,
            EVENT.BROADCAST.SETTING_ALERT
        ).forward(EVENT.DO.MUTATE_ALERT);

        domain.incoming(EVENT.ON.CLOSE_ALERT_MODAL).handle(() => {
            return {
                visible: false,
                title: ``,
                message: ``
            };
        }).relay(EVENT.DO.MUTATE_ALERT);

        domain.incoming(EVENT.ON.GO_TO_MONITOR).handle(() => {
            domain.outgoing(EVENT.DO.MONITOR_ACTIVATION).emit(() => true);
            domain.outgoing(
                EVENT.DO.MAP_ACTIVATION,
                EVENT.DO.SETTING_ACTIVATION
            ).emit(() => false);
            // domain.outgoing(EVENT.REQUEST.DEVICE_COORDINATE).emit();
        });

        domain.incoming(EVENT.ON.GO_TO_MAP).handle(() => {
            domain.outgoing(EVENT.DO.MAP_ACTIVATION).emit(() => true);
            domain.outgoing(
                EVENT.DO.MONITOR_ACTIVATION,
                EVENT.DO.SETTING_ACTIVATION
            ).emit(() => false);
            // domain.outgoing(EVENT.REQUEST.DEVICE_COORDINATE).emit();
        });

        domain.incoming(EVENT.ON.GO_TO_SETTING).handle(() => {
            domain.outgoing(EVENT.DO.SETTING_ACTIVATION).emit(() => true);
            domain.outgoing(
                EVENT.DO.MONITOR_ACTIVATION,
                EVENT.DO.MAP_ACTIVATION
            ).emit(() => false);
        });
        done();
    },
    teardown (done) {
        clearInterval(periodicRefreshIntervalId);
        periodicRefreshIntervalId = null;
        Hf.log(`info1`, `Stopping periodic refresh.`);

        BackgroundGeolocation.stop(() => {
            Hf.log(`info1`, `Stopping background geolocation tracking.`);
        }, (error) => {
            Hf.log(`warn1`, `Unable to stop background geolocation tracking. ${error.message}.`);
        });
        BackgroundGeolocation.removeListeners();

        AppState.removeEventListener(`change`);

        NetInfo.removeEventListener(`connectionChange`);

        done();
    }
});

export default AppDomain;
