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
 * @description - Virida client native app setting event ids.
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
        `toggle-unhealthy-aq-alert-notification`,
        `toggle-daily-aq-alert-notification`,
        `toggle-show-intro`,
        `submit-rating`
    ],
    asEvents: [
        `notification-mutated`,
        `show-intro-mutated`,
        `rating-submission-mutated`
    ],
    doEvents: [
        `setting-reset`,
        `setting-activation`,
        `mutate-setting-status`,
        `mutate-notification`,
        `mutate-show-intro`,
        `mutate-rating-submission`
    ],
    broadcastEvents: [
        `setting-alert`,
        `run-mode`,
        `device-online`,
        `device-geolocation-online`,
        `setting-written`
    ],
    requestEvents: [
        `read-setting`,
        `write-setting`
    ]
});
