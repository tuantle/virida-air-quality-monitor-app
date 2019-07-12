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
 * @module StorageService
 * @description - Virida client-native app local storage service.
 *
 * @author Tuan Le (tuan.t.lei@gmail.com)
 *
 *------------------------------------------------------------------------
 * @format
 * @flow
 */
'use strict'; // eslint-disable-line

import { Hf } from 'hyperflow';

import AsyncStorage from '@react-native-community/async-storage';


import EVENT from '../events/storage-event';

const DEFAULT_BUNDLE = {
    virida: {
        setting: {
            ratingSubmitted: false,
            showIntro: true,
            mapTheme: `lite`,
            notification: {
                unhealthyAQAlert: true,
                dailyAQAlert: true
            }
        }
    }
};

const StorageService = Hf.Service.augment({
    composites: [
        Hf.Storage.ASyncStorageComposite
    ],
    getProvider () {
        return {
            storage: AsyncStorage
        };
    },
    setupStorageRead () {
        const service = this;

        service.incoming(EVENT.REQUEST.READ_SETTING).handle(() => {
            service.fetch(
                `virida.setting`
            ).read().then((results) => {
                if (Hf.isNonEmptyArray(results) && Hf.isObject(results[0])) {
                    return results[0];
                }
                service.outgoing(EVENT.RESPONSE.TO.READ_SETTING.NOT_FOUND).emit();
                Hf.log(`warn1`, `Setting data is not found in storage.`);
            }).then((setting) => {
                service.outgoing(EVENT.RESPONSE.TO.READ_SETTING.OK).emit(() => setting);
                Hf.log(`info1`, `Setting was read from storage.`);
            }).catch((error) => {
                service.outgoing(EVENT.RESPONSE.TO.READ_SETTING.ERROR).emit();
                Hf.log(`warn1`, `Unable to read from storage. ${error.message}.`);
            });
        });
    },
    setupStorageWrite () {
        const service = this;

        service.incoming(EVENT.REQUEST.WRITE_SETTING).handle((setting) => {
            service.fetch(
                `virida.setting`
            ).write({
                bundle: {
                    setting
                }
            }).then((results) => {
                if (Hf.isNonEmptyArray(results) && Hf.isObject(results[0])) {
                    return results[0];
                }
                service.outgoing(EVENT.RESPONSE.TO.WRITE_SETTING.ERROR).emit();
            }).then((result) => {
                service.outgoing(EVENT.RESPONSE.TO.WRITE_SETTING.OK).emit(() => result.setting);
                Hf.log(`info1`, `Setting data was written to storage.`);
            }).catch((error) => {
                service.outgoing(EVENT.RESPONSE.TO.WRITE_SETTING.ERROR).emit();
                Hf.log(`warn1`, `Unable to write to storage. ${error.message}.`);
            });
        });
    },
    setup (done) {
        const service = this;

        service.incoming(EVENT.DO.STORAGE_INITIALIZATION).handle(() => {
            service.fetch(
                `virida`
            ).write({
                bundle: DEFAULT_BUNDLE,
                touchRoot: true
            }).then(() => {
                service.outgoing(EVENT.AS.STORAGE_INITIALIZED).emit();
                Hf.log(`info1`, `Storage initialized.`);
            }).catch((error) => {
                Hf.log(`warn1`, `Unable to write to storage. ${error.message}.`);
            });
        });
        service.setupStorageRead();
        service.setupStorageWrite();
        done();
    },
    teardown (done) {
        done();
    }
});
export default StorageService;
