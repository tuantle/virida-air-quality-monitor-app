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
 * @module MapUtilsComposite
 * @description - Virida client-native map utils composite.
 *
 * @author Tuan Le (tuan.t.lei@gmail.com)
 *
 *------------------------------------------------------------------------
 * @format
 * @flow
 */
'use strict'; // eslint-disable-line

import { Hf } from 'hyperflow';

export default Hf.Composite({
    template: {
        isInsideRegionBBox (regionBBox, coordinate) {
            let longRange = false;
            if (regionBBox.neCoordinate.longitude < regionBBox.swCoordinate.longitude) {
                longRange = coordinate.longitude >= regionBBox.swCoordinate.longitude || coordinate.longitude <= regionBBox.neCoordinate.longitude;
            } else {
                longRange = coordinate.longitude >= regionBBox.swCoordinate.longitude && coordinate.longitude <= regionBBox.neCoordinate.longitude;
            }
            return coordinate.latitude >= regionBBox.swCoordinate.latitude && coordinate.latitude <= regionBBox.neCoordinate.latitude && longRange;
        },
        getRegionZoomLevel (regionLongitudeDelta) {
            return Math.round(Math.log(360 / regionLongitudeDelta) / Math.LN2);
        },
        getRegionBBox (region, deltaPadding = 0, returnIncludesDeltas = false) {
            const latitudeDelta = region.latitudeDelta + deltaPadding;
            const longitudeDelta = region.longitudeDelta < 0 ? region.longitudeDelta + deltaPadding + 360 : region.longitudeDelta + deltaPadding;
            if (returnIncludesDeltas) {
                return {
                    neCoordinate: {
                        latitude: region.latitude + latitudeDelta + deltaPadding,
                        longitude: region.longitude + longitudeDelta + deltaPadding
                    },
                    swCoordinate: {
                        latitude: region.latitude - latitudeDelta,
                        longitude: region.longitude - longitudeDelta
                    },
                    zoomLvl: Math.round(Math.log(360 / longitudeDelta) / Math.LN2),
                    latitudeDelta,
                    longitudeDelta
                };
            }
            return {
                neCoordinate: {
                    latitude: region.latitude + latitudeDelta,
                    longitude: region.longitude + longitudeDelta
                },
                swCoordinate: {
                    latitude: region.latitude - latitudeDelta,
                    longitude: region.longitude - longitudeDelta
                }
            };
        }
    }
});
