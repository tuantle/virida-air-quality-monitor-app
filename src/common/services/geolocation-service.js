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
 * @module GeolocationService
 * @description - Virida client-native app geolocation service.
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

import BackgroundGeolocation from 'react-native-background-geolocation';

import EVENT from '../events/geolocation-event';

const GeolocationService = Hf.Service.augment({
    setup (done) {
        const service = this;

        BackgroundGeolocation.on(`location`, ({
            coords: coordinate
        }) => {
            service.outgoing(EVENT.AS.DEVICE_COORDINATE_REFRESHED).emit(() => coordinate);
        }, (error) => {
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
            service.outgoing(EVENT.RESPONSE.TO.DEVICE_COORDINATE.ERROR).emit();
        });

        service.incoming(EVENT.REQUEST.DEVICE_COORDINATE).handle(() => {
            BackgroundGeolocation.getCurrentPosition({
                samples: 1,
                persist: false
            }).then(({
                coords: coordinate
            }) => {
                service.outgoing(EVENT.RESPONSE.TO.DEVICE_COORDINATE.OK).emit(() => coordinate);
            }).catch((error) => {
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
                service.outgoing(EVENT.RESPONSE.TO.DEVICE_COORDINATE.ERROR).emit();
            });
        });

        done();
    },
    teardown (done) {
        done();
    }
});
export default GeolocationService;
