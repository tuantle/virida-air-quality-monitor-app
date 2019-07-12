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
 * @module SettingStore
 * @description - Virida client-native app setting store.
 *
 * @author Tuan Le (tuan.t.lei@gmail.com)
 *
 *------------------------------------------------------------------------
 * @format
 * @flow
 */
'use strict'; // eslint-disable-line

import { Hf } from 'hyperflow';

import EVENT from '../events/setting-event';

const SettingStore = Hf.Store.augment({
    state: {
        status: {
            active: false,
            idle: false,
            online: true,
            geolocationOnline: true
        },
        ratingSubmitted: true,
        showIntro: true,
        // mapTheme: {
        //     value: `flat`,
        //     oneOf: [ `lite`, `flat`, `retro` ]
        // },
        notification: {
            unhealthyAQAlert: true,
            dailyAQAlert: true
        }
    },
    setup (done) {
        const store = this;

        store.incoming(EVENT.DO.SETTING_RESET).handle(() => {
            store.reconfig({
                status: {
                    active: false,
                    idle: false,
                    online: true,
                    geolocationOnline: true
                },
                showIntro: true,
                // mapTheme: `flat`,
                notification: {
                    dailyAQAlert: true,
                    unhealthyAQAlert: true
                }
            }, {
                suppressMutationEvent: true
            });
        });

        store.incoming(EVENT.DO.MUTATE_SETTING_STATUS).handle((status) => {
            store.reduce({
                status
            });
        });

        store.incoming(EVENT.DO.MUTATE_RATING_SUBMISSION).handle((ratingSubmitted) => {
            if (store.reduce({
                ratingSubmitted
            })) {
                store.outgoing(EVENT.AS.RATING_SUBMISSION_MUTATED).emit(() => store.ratingSubmitted);
            }
        });

        store.incoming(EVENT.DO.MUTATE_SHOW_INTRO).handle((mutateShowIntro) => {
            if (store.reduce(mutateShowIntro, {
                suppressMutationEvent: !store.status.active || store.status.idle
            })) {
                store.outgoing(EVENT.AS.SHOW_INTRO_MUTATED).emit(() => store.showIntro);
            }
        });

        store.incoming(EVENT.DO.MUTATE_NOTIFICATION).handle((mutateNotification) => {
            if (store.reduce(mutateNotification, {
                suppressMutationEvent: !store.status.active || store.status.idle
            })) {
                store.outgoing(EVENT.AS.NOTIFICATION_MUTATED).emit(() => store.notification);
            }
        });

        done();
    },
    teardown (done) {
        done();
    }
});

export default SettingStore;
