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
 * @description - Boki client native app map event ids.
 *
 * @author Tuan Le (tuan.t.lei@gmail.com)
 *
 *------------------------------------------------------------------------
 * @format
 * @flow
 */
'use strict'; // eslint-disable-line

import { Hf } from 'hyperflow';

const mapEventMap = {
    onEvents: [
        `toggle-city-suggestion-visibility`,
        `changing-to-new-region`,
        `refresh-aqr-site-data`,
        `select-aqr-site`,
        `deselect-aqr-site`,
        `show-aq-actionable-tip-modal`,
        `close-aq-actionable-tip-modal`,
        `show-aq-whatis-modal`,
        `close-aq-whatis-modal`
    ],
    asEvents: [
        `home-region-mutated`
    ],
    doEvents: [
        `map-reset`,
        `device-coordinate-refresh`,
        `map-activation`,
        `mutate-home-region`,
        `mutate-map-status`,
        `mutate-aqr-info`,
        `mutate-aqr-sites`,
        `mutate-selected-aqr-site`,
        `mutate-aq-actionable-tip`,
        `mutate-aq-whatis`,
        `mutate-city-suggestion-visibility`
    ],
    broadcastEvents: [
        `run-mode`,
        `device-online`,
        `device-geolocation-online`,
        `device-coordinate`,
        `map-alert`
    ],
    requestEvents: [
        `aqicn-aqr-site-data`,
        `air-now-aqr-site-data`
    ]
};

export default Hf.Event.create(mapEventMap);
