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
 * @description - Virida client native app event ids.
 *
 * @author Tuan Le (tuan.t.lei@gmail.com)
 *
 *------------------------------------------------------------------------
 * @format
 * @flow
 */
'use strict'; // eslint-disable-line

import { Hf } from 'hyperflow';

export default Hf.Event.create({
    onEvents: [
        `go-to-monitor`,
        `go-to-map`,
        `go-to-setting`,
        `close-alert-modal`,
        `intro-finished`,
        `intro-skipped`
    ],
    asEvents: [
        `reset`,
        `storage-initialized`,
        `device-coordinate-refreshed`
    ],
    doEvents: [
        `reset`,
        `monitor-reset`,
        `map-reset`,
        `setting-reset`,
        `storage-initialization`,
        `monitor-activation`,
        `map-activation`,
        `setting-activation`,
        `device-coordinate-refresh`,
        `mutate-storage-initialized`,
        `mutate-alert`,
        `mutate-show-intro`,
        `mutate-run-mode`,
        `mutate-tab-bar-visibility`
    ],
    broadcastEvents: [
        `run-mode`,
        `setting-written`,
        `device-online`,
        `device-geolocation-online`,
        `device-coordinate`,
        `monitor-alert`,
        `map-alert`,
        `setting-alert`
    ],
    requestEvents: [
        `read-setting`,
        `write-setting`,
        `device-coordinate`
    ]
});
