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
 * @module AQRSiteMapMarkersView
 * @description - Virida client-native app air quality region site map markers wrapper component.
 *
 * @author Tuan Le (tuan.t.lei@gmail.com)
 *
 *------------------------------------------------------------------------
 * @format
 * @flow
 */
'use strict'; // eslint-disable-line

import { Ht } from 'hypertoxin';

import React from 'react';

import ReactNative from 'react-native'; // eslint-disable-line

import PropTypes from 'prop-types';

import {
    Marker
} from 'react-native-maps';

import Theme from '../../../common/theme';

const {
    CoverImage,
    TitleText
} = Ht;

const aqAlertIndexMarkers = [
    require(`../../../../assets/images/marker-1.png`),
    require(`../../../../assets/images/marker-2.png`),
    require(`../../../../assets/images/marker-3.png`),
    require(`../../../../assets/images/marker-4.png`),
    require(`../../../../assets/images/marker-5.png`),
    require(`../../../../assets/images/marker-6.png`)
];

const AQRSiteMapMarkersView = (props) => {
    const {
        tracking,
        aqrSites,
        onPress
    } = props;

    return aqrSites.map((aqrSite, index) => {
        return (
            <Marker
                key = { `${index}` }
                identifier = { aqrSite.info.code }
                flat = { true }
                tracksViewChanges = { tracking }
                stopPropagation = { true }
                coordinate = {{
                    latitude: aqrSite.info.latitude,
                    longitude: aqrSite.info.longitude
                }}
                onPress = {() => {
                    onPress(aqrSite);
                }}
            >
                <CoverImage
                    room = 'content-middle'
                    width = { aqrSite.aqSample.aqi < 100 ? 60 : 80 }
                    height = { 45 }
                    resizeMode = 'stretch'
                    source = { aqAlertIndexMarkers[aqrSite.aqSample.aqAlertIndex] }
                    style = {{
                        paddingBottom: 5,
                        marginLeft: aqrSite.aqSample.aqi < 400 ? parseInt(0.675 * aqrSite.aqSample.aqi, 10) : 270,
                        shadowRadius: 1,
                        shadowOpacity: 0.2
                    }}
                >
                    <TitleText size = 'small' color = { Theme.color.palette.white }>{ aqrSite.aqSample.aqi }</TitleText>
                </CoverImage>
            </Marker>
        );
    });
};

AQRSiteMapMarkersView.propTypes = {
    tracking: PropTypes.bool,
    aqrSites: PropTypes.array,
    onPress: PropTypes.func
};

AQRSiteMapMarkersView.defaultProps = {
    tracking: false,
    aqrSites: [],
    onPress: () => null
};

export default AQRSiteMapMarkersView;
