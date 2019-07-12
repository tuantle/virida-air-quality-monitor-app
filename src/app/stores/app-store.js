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
 * @module AppStore
 * @description - Virida client-native app store.
 *
 * @author Tuan Le (tuan.t.lei@gmail.com)
 *
 *------------------------------------------------------------------------
 * @format
 * @flow
 */
'use strict'; // eslint-disable-line

import { Hf } from 'hyperflow';

import EVENT from '../events/app-event';

const AppStore = Hf.Store.augment({
    state: {
        alert: {
            visible: false,
            title: ``,
            message: ``
        },
        runMode: {
            value: `foreground-running`,
            oneOf: [
                `foreground-running`,
                `background-running`
            ]
        },
        storageInitialized: false,
        showIntro: true
    },
    setup (done) {
        const store = this;

        store.incoming(EVENT.DO.RESET).handle(() => {
            store.reconfig({
                alert: {
                    visible: false,
                    title: ``,
                    message: ``
                },
                runMode: `foreground-running`,
                showIntro: true
            }, {
                suppressMutationEvent: true
            });
            store.outgoing(EVENT.AS.RESET).emit();
        });

        store.incoming(EVENT.DO.MUTATE_STORAGE_INITIALIZED).handle((storageInitialized) => {
            store.reduce({
                storageInitialized
            });
        });

        store.incoming(EVENT.DO.MUTATE_SHOW_INTRO).handle((showIntro) => {
            store.reduce({
                showIntro
            });
        });

        store.incoming(EVENT.DO.MUTATE_RUN_MODE).handle((mutateRunMode) => {
            store.reduce(mutateRunMode);
        });

        store.incoming(EVENT.DO.MUTATE_ALERT).handle((alert) => {
            if ((!store.alert.visible && alert.visible) || (store.alert.visible && !alert.visible)) {
                store.reduce({
                    alert
                });
            }
        });

        done();
    },
    teardown (done) {
        done();
    }
});

export default AppStore;
