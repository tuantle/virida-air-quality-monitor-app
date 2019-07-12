/**
 * Copyright (c) 2017-present, Viria, Inc. All rights reserved.
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
 * @description - Viria client native app air quality regional monitor event ids.
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
        `refresh-aqr-feed-data`,
        `refresh-aqr-forecast-data`,
        `show-aq-actionable-tip-modal`,
        `close-aq-actionable-tip-modal`,
        `show-aq-whatis-modal`,
        `close-aq-whatis-modal`,
        `show-aq-forecast-discussion-modal`,
        `close-aq-forecast-discussion-modal`
    ],
    doEvents: [
        `monitor-reset`,
        `monitor-activation`,
        `device-coordinate-refresh`,
        `mutate-monitor-status`,
        `mutate-aqr-info`,
        `mutate-aqr-feeds`,
        `mutate-aqr-forecasts`,
        `mutate-aq-actionable-tip`,
        `mutate-aq-whatis`,
        `mutate-aq-forecast-discussion`,
        `mutate-notification-setting`
    ],
    broadcastEvents: [
        `run-mode`,
        `setting-written`,
        `device-online`,
        `device-geolocation-online`,
        `device-coordinate`,
        `monitor-alert`,
        `daily-aq-alert`,
        `unhealthy-aq-alert`
    ],
    requestEvents: [
        `aqicn-aqr-feed-data`,
        `air-now-aqr-feed-data`,
        `air-now-aqr-forecast-data`
    ]
});
