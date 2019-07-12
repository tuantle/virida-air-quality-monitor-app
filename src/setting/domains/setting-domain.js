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
 * @module SettingDomain
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

import SettingStore from '../stores/setting-store';

import SettingInterface from '../interfaces/setting-interface';

import StorageService from '../../common/services/storage-service';

import EVENT from '../events/setting-event';

const SettingDomain = Hf.Domain.augment({
    $init () {
        const domain = this;
        domain.register({
            store: SettingStore({
                name: `setting-store`
            }),
            intf: SettingInterface({
                name: `setting-interface`
            }),
            services: [
                StorageService({
                    name: `storage-service`
                })
            ]
        });
    },
    setup (done) {
        const domain = this;
        domain.incoming(EVENT.DO.SETTING_RESET).repeat();

        domain.incoming(EVENT.BROADCAST.RUN_MODE).handle((runMode) => {
            return {
                idle: runMode === `background-running`
            };
        }).relay(EVENT.DO.MUTATE_SETTING_STATUS);

        domain.incoming(EVENT.DO.SETTING_ACTIVATION).handle((active) => {
            if (active) {
                domain.outgoing(EVENT.REQUEST.READ_SETTING).emit();
            }
            return {
                active
            };
        }).relay(EVENT.DO.MUTATE_SETTING_STATUS);

        domain.incoming(EVENT.BROADCAST.DEVICE_ONLINE).handle((online) => {
            return {
                online
            };
        }).relay(EVENT.DO.MUTATE_SETTING_STATUS);

        domain.incoming(EVENT.BROADCAST.DEVICE_GEOLOCATION_ONLINE).handle((geolocationOnline) => {
            return {
                geolocationOnline
            };
        }).relay(EVENT.DO.MUTATE_SETTING_STATUS);

        domain.incoming(EVENT.RESPONSE.TO.READ_SETTING.OK).handle((setting) => {
            domain.outgoing(EVENT.DO.MUTATE_RATING_SUBMISSION).emit(() => setting.ratingSubmitted);
            domain.outgoing(EVENT.DO.MUTATE_SHOW_INTRO).emit(() => () => {
                return {
                    showIntro: setting.showIntro
                };
            });
            domain.outgoing(EVENT.DO.MUTATE_NOTIFICATION).emit(() => () => {
                return {
                    notification: {
                        unhealthyAQAlert: setting.notification.unhealthyAQAlert,
                        dailyAQAlert: setting.notification.dailyAQAlert
                    }
                };
            });
        });

        domain.incoming(EVENT.ON.SUBMIT_RATING).handle((ratingSubmitted) => {
            domain.outgoing(EVENT.DO.MUTATE_RATING_SUBMISSION).emit(() => ratingSubmitted);
            return {
                ratingSubmitted
            };
        }).relay(EVENT.REQUEST.WRITE_SETTING);

        domain.incoming(EVENT.ON.TOGGLE_DAILY_AQ_ALERT_NOTIFICATION).handle(() => ({
            notification
        }) => {
            return {
                notification: {
                    dailyAQAlert: !notification.dailyAQAlert
                }
            };
        }).relay(EVENT.DO.MUTATE_NOTIFICATION);

        domain.incoming(EVENT.ON.TOGGLE_UNHEALTHY_AQ_ALERT_NOTIFICATION).handle(() => ({
            notification
        }) => {
            return {
                notification: {
                    unhealthyAQAlert: !notification.unhealthyAQAlert
                }
            };
        }).relay(EVENT.DO.MUTATE_NOTIFICATION);

        domain.incoming(EVENT.ON.TOGGLE_SHOW_INTRO).handle(() => ({
            showIntro
        }) => {
            return {
                showIntro: !showIntro
            };
        }).relay(EVENT.DO.MUTATE_SHOW_INTRO);

        domain.incoming(EVENT.AS.NOTIFICATION_MUTATED).handle((notification) => {
            return {
                notification
            };
        }).relay(EVENT.REQUEST.WRITE_SETTING);
        domain.incoming(EVENT.AS.SHOW_INTRO_MUTATED).handle((showIntro) => {
            return {
                showIntro
            };
        }).relay(EVENT.REQUEST.WRITE_SETTING);

        domain.incoming(EVENT.RESPONSE.TO.WRITE_SETTING.OK).forward(EVENT.BROADCAST.SETTING_WRITTEN);

        domain.incoming(
            EVENT.RESPONSE.TO.READ_SETTING.NOT_FOUND,
            EVENT.RESPONSE.TO.READ_SETTING.ERROR
        ).handle(() => {
            return {
                visible: true,
                title: `App Storage`,
                message: `Unable To Read Data From Storage.`
            };
        }).relay(EVENT.BROADCAST.SETTING_ALERT);

        domain.incoming(
            EVENT.RESPONSE.TO.WRITE_SETTING.ERROR
        ).handle(() => {
            return {
                visible: true,
                title: `App Storage`,
                message: `Unable To Write Data To Storage.`
            };
        }).relay(EVENT.BROADCAST.SETTING_ALERT);

        done();
    },
    teardown (done) {
        done();
    }
});

export default SettingDomain;
