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
 * @module AQRSiteMapView
 * @description - Virida client-native app air quality region site map view wrapper component.
 *
 * @author Tuan Le (tuan.t.lei@gmail.com)
 *
 *------------------------------------------------------------------------
 * @format
 * @flow
 */
'use strict'; // eslint-disable-line

import React from 'react';

import ReactNative from 'react-native'; // eslint-disable-line

import PropTypes from 'prop-types';

import SuperCluster from 'supercluster';

import MapView from 'react-native-maps';

import AQRSiteMapMarkersView from './aqr-site-map-markers-view';

import MapUtilsComposite from '../../composites/map-utils-composite';

import AQAlertComposite from '../../../common/composites/aq-alert-composite';

import GoogleMapTheme from '../../../common/google-map-theme';

import CONSTANT from '../../../common/constant';

const {
    Component
} = React;

const {
    getRegionBBox
} = MapUtilsComposite.getTemplate();

const {
    getAQIAlert
} = AQAlertComposite.getTemplate();

let aqrSiteSuperCluster = null;

if (CONSTANT.MAP.MARKER_CLUSTERING.ENABLED) {
    aqrSiteSuperCluster = new SuperCluster({
        minZoom: CONSTANT.MAP.MIN_ZOOM_LEVEL,
        maxZoom: CONSTANT.MAP.MAX_ZOOM_LEVEL,
        radius: CONSTANT.MAP.MARKER_CLUSTERING.RADIUS_PIXEL,
        extent: CONSTANT.MAP.MARKER_CLUSTERING.EXTENT,
        nodeSize: CONSTANT.MAP.MARKER_CLUSTERING.NODE_SIZE,
        initial: () => {
            return {
                info: {
                    code: ``,
                    name: ``,
                    clusterCount: 0,
                    latitude: 0,
                    longitude: 0
                },
                aqSample: {
                    aqParam: ``,
                    aqUnit: ``,
                    aqi: 0,
                    aqiSum: 0,
                    aqConcentration: 0,
                    aqConcentrationSum: 0,
                    aqParamColor: ``
                }
            };
        },
        reduce: (aqrSiteAccumulated, aqrSite) => {
            aqrSiteAccumulated.info.clusterCount++;
            if (aqrSiteAccumulated.info.clusterCount > 1) {
                if (aqrSiteAccumulated.info.code.indexOf(aqrSite.info.code) === -1) {
                    aqrSiteAccumulated.info.code = `${aqrSite.info.code}-${aqrSiteAccumulated.info.code}`;
                    aqrSiteAccumulated.info.name = `${aqrSite.info.name},\n${aqrSiteAccumulated.info.name}`;
                }
                aqrSiteAccumulated.aqSample.aqiSum += aqrSite.aqSample.aqi;
                aqrSiteAccumulated.aqSample.aqConcentrationSum += aqrSite.aqSample.aqConcentration;
                aqrSiteAccumulated.aqSample.aqi = parseInt(Math.round(aqrSiteAccumulated.aqSample.aqiSum / aqrSiteAccumulated.info.clusterCount), 10);
                aqrSiteAccumulated.aqSample.aqConcentration = aqrSiteAccumulated.aqSample.aqConcentrationSum / aqrSiteAccumulated.info.clusterCount;
            } else {
                aqrSiteAccumulated.info.code = aqrSite.info.code;
                aqrSiteAccumulated.info.name = aqrSite.info.name;
                aqrSiteAccumulated.aqSample.aqi = aqrSite.aqSample.aqi;
                aqrSiteAccumulated.aqSample.aqiSum = aqrSite.aqSample.aqi;
                aqrSiteAccumulated.aqSample.aqConcentration = aqrSite.aqSample.aqConcentration;
                aqrSiteAccumulated.aqSample.aqConcentrationSum = aqrSite.aqSample.aqConcentration;
            }
            aqrSiteAccumulated.aqSample.aqParam = aqrSite.aqSample.aqParam;
            aqrSiteAccumulated.aqSample.aqUnit = aqrSite.aqSample.aqUnit;
        }
    });
}

export default class AQRSiteMapView extends Component {
    static propTypes = {
        tracking: PropTypes.bool,
        homeRegion: PropTypes.shape({
            latitude: PropTypes.number,
            longitude: PropTypes.number,
            latitudeDelta: PropTypes.number,
            longitudeDelta: PropTypes.number
        }),
        aqrSites: PropTypes.array,
        selectedAQRSiteCode: PropTypes.string,
        onPress: PropTypes.func,
        onPressAQRSiteMarker: PropTypes.func,
        onRegionUpdated: PropTypes.func
    }
    static defaultProps = {
        tracking: false,
        homeRegion: {
            latitude: 0,
            longitude: 0,
            latitudeDelta: 0,
            longitudeDelta: 0
        },
        aqrSites: [],
        selectedAQRSiteCode: ``,
        onPress: () => null,
        onPressAQRSiteMarker: () => null,
        onRegionUpdated: () => null
    }
    constructor (props) {
        super(props);

        this.mapViewRef = null;

        if (CONSTANT.MAP.MARKER_CLUSTERING.ENABLED) {
            this.aqrSiteClusterIndex = aqrSiteSuperCluster.load(props.aqrSites.map((aqrSite) => {
                return {
                    type: `Feature`,
                    geometry: {
                        type: `Point`,
                        coordinates: [
                            aqrSite.info.longitude,
                            aqrSite.info.latitude
                        ]
                    },
                    properties: {
                        info: {
                            ...aqrSite.info,
                            clusterCount: 0
                        },
                        aqSample: {
                            ...aqrSite.aqSample,
                            aqiSum: 0,
                            aqConcentrationSum: 0
                        }
                    }
                };
            }));
            this.state = {
                ready: false,
                aqrClusteredSites: []
            };
        } else {
            this.aqrSiteClusterIndex = null;
            this.state = {
                ready: false
            };
        }
    }
    getAQRClusteredSiteMapMarkers = (region) => {
        const component = this;
        if (CONSTANT.MAP.MARKER_CLUSTERING.ENABLED && component.aqrSiteClusterIndex !== null) {
            const clusterRegionBBox = getRegionBBox(region, CONSTANT.MAP.MARKER_CLUSTERING.BBOX_DELTA_PADDING, true);
            return component.aqrSiteClusterIndex.getClusters([
                clusterRegionBBox.swCoordinate.longitude,
                clusterRegionBBox.swCoordinate.latitude,
                clusterRegionBBox.neCoordinate.longitude,
                clusterRegionBBox.neCoordinate.latitude
            ], clusterRegionBBox.zoomLvl).map((aqrClusteredSite) => {
                const [
                    aqrSiteLongitude,
                    aqrSiteLatitude
                ] = aqrClusteredSite.geometry.coordinates;
                const aqrSite = aqrClusteredSite.properties;
                const aqAlert = getAQIAlert(aqrSite.aqSample.aqi);
                return {
                    info: {
                        ...aqrSite.info,
                        latitude: aqrSiteLatitude,
                        longitude: aqrSiteLongitude
                    },
                    aqSample: {
                        ...aqrSite.aqSample,
                        aqAlertIndex: aqAlert.index,
                        aqAlertMessage: aqAlert.message
                    }
                };
            });
        }
        return [];
    }
    onMapReady = () => {
        const component = this;
        const {
            ready
        } = component.state;

        if (!ready) {
            setTimeout(() => {
                component.setState(() => {
                    return {
                        ready: true
                    };
                });
            }, CONSTANT.MAP.READY_DELAY_MS);
        }
    }
    onRegionChangeComplete = (newRegion) => {
        const component = this;
        const {
            tracking,
            onRegionUpdated
        } = component.props;
        const {
            ready
        } = component.state;

        if (ready && !tracking) {
            if (CONSTANT.MAP.MARKER_CLUSTERING.ENABLED && component.aqrSiteClusterIndex !== null) {
                component.setState(() => {
                    return {
                        aqrClusteredSites: component.getAQRClusteredSiteMapMarkers(newRegion)
                    };
                }, () => {
                    onRegionUpdated(newRegion);
                });
            } else {
                onRegionUpdated(newRegion);
            }
        }
    }
    onAQRSiteMapMarkerPress = (selectedAQRSite) => {
        const component = this;
        const {
            onPressAQRSiteMarker
        } = component.props;

        if (component.mapViewRef !== null) {
            const selectedAQRSiteCode = selectedAQRSite.info.code;

            component.mapViewRef.animateToRegion({
                longitude: selectedAQRSite.info.longitude,
                latitude: selectedAQRSite.info.latitude
            });

            onPressAQRSiteMarker(selectedAQRSiteCode);
        }
    }
    goToHomeRegion = () => {
        const component = this;
        const {
            homeRegion
        } = component.props;

        if (component.mapViewRef !== null) {
            component.mapViewRef.animateToRegion(homeRegion);
        }
    }
    goToNewRegion = (newRegion) => {
        const component = this;

        if (component.mapViewRef !== null) {
            component.mapViewRef.animateToRegion(newRegion);
        }
    }
    componentDidMount () {
        const component = this;
        const {
            homeRegion
        } = component.props;

        if (CONSTANT.MAP.MARKER_CLUSTERING.ENABLED) {
            component.setState(() => {
                return {
                    aqrClusteredSites: component.getAQRClusteredSiteMapMarkers(homeRegion)
                };
            });
        }
    }
    componentDidUpdate () {
        const component = this;
        const {
            aqrSites
        } = component.props;

        if (CONSTANT.MAP.MARKER_CLUSTERING.ENABLED) {
            component.aqrSiteClusterIndex = aqrSiteSuperCluster.load(aqrSites.map((aqrSite) => {
                return {
                    type: `Feature`,
                    geometry: {
                        type: `Point`,
                        coordinates: [
                            aqrSite.info.longitude,
                            aqrSite.info.latitude
                        ]
                    },
                    properties: {
                        info: {
                            ...aqrSite.info,
                            clusterCount: 0
                        },
                        aqSample: {
                            ...aqrSite.aqSample,
                            aqiSum: 0,
                            aqConcentrationSum: 0
                        }
                    }
                };
            }));
        }
    }
    componentWillUnmount () {
        const component = this;
        component.mapViewRef = null;
        component.aqrSiteClusterIndex = null;
    }
    renderAQRSiteMapMarkers () {
        const component = this;
        const {
            tracking,
            aqrSites
        } = component.props;
        const {
            ready
        } = component.state;

        if (ready) {
            if (CONSTANT.MAP.MARKER_CLUSTERING.ENABLED) {
                const {
                    aqrClusteredSites
                } = component.state;

                return (
                    <AQRSiteMapMarkersView
                        tracking = { tracking }
                        aqrSites = { aqrClusteredSites }
                        onPress = { component.onAQRSiteMapMarkerPress }
                    />
                );
            }
            return (
                <AQRSiteMapMarkersView
                    tracking = { tracking }
                    aqrSites = { aqrSites }
                    onPress = { component.onAQRSiteMapMarkerPress }
                />
            );
        }
        return null;
    }
    render () {
        const component = this;
        const {
            tracking,
            homeRegion,
            onPress
        } = component.props;
        const {
            ready
        } = component.state;

        return (
            <MapView
                ref = {(componentRef) => {
                    component.mapViewRef = componentRef;
                }}
                style = {{
                    position: `absolute`,
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: -30,
                    height: CONSTANT.GENERAL.DEVICE_HEIGHT + 28
                }}
                mapPadding = {{
                    top: 5,
                    right: 5,
                    bottom: 5,
                    left: 5
                }}
                customMapStyle = { GoogleMapTheme.lite }
                showsUserLocation = { false }
                showsMyLocationButton = { false }
                followsUserLocation = { false }
                cacheEnabled = { false }
                showsIndoors = { false }
                toolbarEnabled = { false }
                pitchEnabled = { false }
                rotateEnabled = { false }
                scrollEnabled = { !ready || !tracking }
                zoomEnabled = { !ready || !tracking }
                minZoomLevel = { CONSTANT.MAP.MIN_ZOOM_LEVEL }
                maxZoomLevel = { CONSTANT.MAP.MAX_ZOOM_LEVEL }
                provider = { MapView.PROVIDER_GOOGLE }
                mapType = 'standard'
                initialRegion = { homeRegion }
                onPress = { onPress }
                onMapReady = { component.onMapReady }
                onRegionChangeComplete = { component.onRegionChangeComplete }
            >
                {
                    component.renderAQRSiteMapMarkers()
                }
            </MapView>
        );
    }
}
