/**
 * Copyright (c) 2016-present, Virida, Org. All rights reserved.
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
 * @description - Virida app entry point for ios and android.
 *
 * @author Tuan Le (tuan.t.lei@gmail.com)
 *
 *------------------------------------------------------------------------
 * @format
 * @flow
 */
'use strict'; //eslint-disable-line
/* eslint quotes: 0 */

window.TARGET = `client-native`;

window.NODE_ENV = `production`;
window.LOGGING_INFO0 = false;
window.LOGGING_INFO1 = false;
window.LOGGING_WARN0 = false;
window.LOGGING_WARN1 = false;

// window.NODE_ENV = `development`;
// window.LOGGING_INFO0 = true;
// window.LOGGING_INFO1 = true;
// window.LOGGING_WARN0 = false;
// window.LOGGING_WARN1 = true;
//
// require(`react-devtools-core`).connectToDevTools({
//     host: `192.168.1.1`,
//     port: `8097`
// });

require('./src/app/virida-app').default.start();
