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
 * @module MapInterface
 * @description - Virida client-native app map interface.
 *
 * @author Tuan Le (tuan.t.lei@gmail.com)
 *
 *------------------------------------------------------------------------
 * @format
 * @flow
 */
'use strict'; // eslint-disable-line

import { Hf } from 'hyperflow';

import { Ht } from 'hypertoxin';

import moment from 'moment';

import React from 'react';

import ReactNative from 'react-native'; // eslint-disable-line

import GooglePlaces from 'react-native-google-places';

import AQRSiteMapView from '../components/views/aqr-site-map-view';

import AQActionableTipModal from '../../common/components/modals/aq-actionable-tip-modal';

import AQWhatisModal from '../../common/components/modals/aq-whatis-modal';

import Theme from '../../common/theme';

import CONSTANT from '../../common/constant';

import EVENT from '../events/map-event';

const {
    ActivityIndicator
} = ReactNative;

const {
    BodyScreen,
    RowLayout,
    ColumnLayout,
    SearchField,
    AreaButton,
    FlatButton,
    RaisedButton,
    IconImage,
    HeadlineText,
    TitleText,
    InfoText,
    CaptionText,
    VerticalDivider
} = Ht;

const MapInterface = Hf.Interface.augment({
    composites: [
        Hf.React.ComponentComposite
    ],
    setup (done) {
        done();
    },
    teardown (done) {
        done();
    },
    onPressGoToHomeRegionButton () {
        const component = this;
        const {
            aqr
        } = component.state;
        const [ aqrSiteMapViewRef ] = component.lookupComponentRefs(`aqr-site-map-view`);

        if (!Hf.isEmpty(aqr.selectedSiteCode)) {
            const [ aqrSiteCalloutPanelLayoutRef ] = component.lookupComponentRefs(`aqr-site-callout-panel-layout`);

            if (aqrSiteCalloutPanelLayoutRef !== null) {
                aqrSiteCalloutPanelLayoutRef.animate({
                    refName: `animated-container-view`,
                    transitions: [{
                        from: {
                            opacity: 1,
                            translateY: 0
                        },
                        to: {
                            opacity: 0,
                            translateY: 250
                        },
                        option: {
                            duration: 300
                        }
                    }],
                    onAnimationEnd: () => {
                        if (aqrSiteMapViewRef !== null) {
                            aqrSiteMapViewRef.goToHomeRegion();
                        }
                        component.outgoing(EVENT.ON.DESELECT_AQR_SITE).emit(() => ``);
                    }
                });
            }
        } else {
            if (aqrSiteMapViewRef !== null) {
                aqrSiteMapViewRef.goToHomeRegion();
            }
        }
    },
    onMapPress () {
        const component = this;
        const {
            aqr
        } = component.state;

        if (!Hf.isEmpty(aqr.selectedSiteCode)) {
            const [ aqrSiteCalloutPanelLayoutRef ] = component.lookupComponentRefs(`aqr-site-callout-panel-layout`);

            if (aqrSiteCalloutPanelLayoutRef !== null) {
                aqrSiteCalloutPanelLayoutRef.animate({
                    refName: `animated-container-view`,
                    transitions: [{
                        from: {
                            opacity: 1,
                            translateY: 0
                        },
                        to: {
                            opacity: 0,
                            translateY: 250
                        },
                        option: {
                            duration: 300
                        }
                    }],
                    onAnimationEnd: () => {
                        component.outgoing(EVENT.ON.DESELECT_AQR_SITE).emit(() => ``);
                    }
                });
            }
        }
    },
    onPressAQRSiteMarker (selectedAQRSiteCode) {
        const component = this;
        const {
            aqr
        } = component.state;

        if (Hf.isEmpty(aqr.selectedSiteCode)) {
            const [ aqrSiteCalloutPanelLayoutRef ] = component.lookupComponentRefs(`aqr-site-callout-panel-layout`);

            if (aqrSiteCalloutPanelLayoutRef !== null) {
                aqrSiteCalloutPanelLayoutRef.animate({
                    refName: `animated-container-view`,
                    transitions: [{
                        from: {
                            opacity: 0,
                            translateY: 250
                        },
                        to: {
                            opacity: 1,
                            translateY: 0
                        },
                        option: {
                            delay: 100,
                            duration: 300
                        }
                    }],
                    onAnimationBegin: () => {
                        component.outgoing(EVENT.ON.SELECT_AQR_SITE).emit(() => selectedAQRSiteCode);
                    }
                });
            }
        } else {
            component.outgoing(EVENT.ON.SELECT_AQR_SITE).emit(() => selectedAQRSiteCode);
        }
    },
    onPressQActionalbleTipButton (selectedAQRSite) {
        const component = this;

        component.outgoing(EVENT.ON.SHOW_AQ_ACTIONABLE_TIP_MODAL).emit(() => {
            return {
                visible: true,
                aqSample: {
                    aqParam: selectedAQRSite.aqSample.aqParam,
                    aqAlertMessage: selectedAQRSite.aqSample.aqAlertMessage,
                    aqAlertIndex: selectedAQRSite.aqSample.aqAlertIndex,
                    aqi: selectedAQRSite.aqSample.aqi
                }
            };
        });
    },
    onPressAQWhatisButton (selectedAQRSite) {
        const component = this;

        component.outgoing(EVENT.ON.SHOW_AQ_WHATIS_MODAL).emit(() => {
            return {
                visible: true,
                aqSample: {
                    aqParam: selectedAQRSite.aqSample.aqParam,
                    aqAlertIndex: selectedAQRSite.aqSample.aqAlertIndex,
                    aqi: selectedAQRSite.aqSample.aqi,
                    aqConcentration: selectedAQRSite.aqSample.aqConcentration,
                    aqUnit: selectedAQRSite.aqSample.aqUnit,
                    aqParamColor: selectedAQRSite.aqSample.aqParamColor
                }
            };
        });
    },
    onRefreshAQRSiteData () {
        const component = this;
        const {
            aqr
        } = component.state;

        if (!Hf.isEmpty(aqr.selectedSiteCode)) {
            const [ aqrSiteCalloutPanelLayoutRef ] = component.lookupComponentRefs(`aqr-site-callout-panel-layout`);

            if (aqrSiteCalloutPanelLayoutRef !== null) {
                aqrSiteCalloutPanelLayoutRef.animate({
                    refName: `animated-container-view`,
                    transitions: [{
                        from: {
                            opacity: 1,
                            translateY: 0
                        },
                        to: {
                            opacity: 0,
                            translateY: 250
                        },
                        option: {
                            duration: 300
                        }
                    }],
                    onAnimationEnd: () => {
                        component.outgoing(EVENT.ON.DESELECT_AQR_SITE).emit(() => ``);
                    }
                });
            }
        }

        component.outgoing(EVENT.ON.REFRESH_AQR_SITE_DATA).emit();
    },
    onCloseAQActionalbleTipModal () {
        const component = this;
        component.outgoing(EVENT.ON.CLOSE_AQ_ACTIONABLE_TIP_MODAL).emit();
    },
    onCloseAQWhatisModal () {
        const component = this;
        component.outgoing(EVENT.ON.CLOSE_AQ_WHATIS_MODAL).emit();
    },
    onRegionUpdated (newRegion) {
        const component = this;
        const {
            aqr
        } = component.state;

        component.outgoing(EVENT.ON.CHANGING_TO_NEW_REGION).emit(() => {
            return {
                aqrInfo: aqr.info,
                newRegion: {
                    ...newRegion,
                    timestamp: moment().format()
                }
            };
        });
    },
    onSearchCity (city) {
        const component = this;
        const {
            aqr
        } = component.state;

        if (!Hf.isEmpty(aqr.selectedSiteCode)) {
            const [ aqrSiteCalloutPanelLayoutRef ] = component.lookupComponentRefs(`aqr-site-callout-panel-layout`);

            if (aqrSiteCalloutPanelLayoutRef !== null) {
                aqrSiteCalloutPanelLayoutRef.animate({
                    refName: `animated-container-view`,
                    transitions: [{
                        from: {
                            opacity: 1,
                            translateY: 0
                        },
                        to: {
                            opacity: 0,
                            translateY: 250
                        },
                        option: {
                            duration: 300
                        }
                    }],
                    onAnimationEnd: () => {
                        component.outgoing(EVENT.ON.DESELECT_AQR_SITE).emit(() => ``);
                    }
                });
            }
        }

        if (!Hf.isEmpty(city)) {
            GooglePlaces.getAutocompletePredictions(city, {
                type: `cities`
            }).then((results) => {
                if (!Hf.isEmpty(results)) {
                    const {
                        placeID: cityId
                    } = results[0];
                    GooglePlaces.lookUpPlaceByID(cityId).then(({
                        location: coordinate
                    }) => {
                        const newRegion = {
                            latitude: coordinate.latitude,
                            longitude: coordinate.longitude,
                            latitudeDelta: CONSTANT.MAP.LATITUDE_DELTA,
                            longitudeDelta: CONSTANT.MAP.LONGITUDE_DELTA
                        };
                        const [ aqrSiteMapViewRef ] = component.lookupComponentRefs(`aqr-site-map-view`);

                        if (aqrSiteMapViewRef !== null) {
                            aqrSiteMapViewRef.goToNewRegion(newRegion);
                        }
                        component.outgoing(EVENT.ON.CHANGING_TO_NEW_REGION).emit(() => {
                            return {
                                aqrInfo: aqr.info,
                                newRegion: {
                                    ...newRegion,
                                    timestamp: moment().format()
                                }
                            };
                        });
                    }).catch((error) => {
                        Hf.log(`warn1`, `Unable to get city id lookup. ${error.message}.`);
                    });
                }
            }).catch((error) => {
                Hf.log(`warn1`, `Unable to get city autocompletions. ${error.message}.`);
            });
        }
    },
    onGetCityAutocompletions: async function onGetCityAutocompletions (city) {
        let results = [];
        if (!Hf.isEmpty(city)) {
            try {
                results = await GooglePlaces.getAutocompletePredictions(city, {
                    type: `cities`
                });
            } catch (error) {
                Hf.log(`warn1`, `Unable to get city autocompletions. ${error.message}.`);
            }
            if (Hf.isNonEmptyArray(results)) {
                return results.slice(0, 4).map((result) => result.fullText.replace(/,([^\s])/g, `, $1`));
            }
            return results;
        }
        return results;
    },
    renderCitySuggestionItem (item, onPressSelectAndSubmit) {
        let [
            city,
            stateOrProvince,
            country
        ] = Hf.stringToArray(item.value, `,`);

        city = Hf.isNonEmptyString(city) ? city.replace(/\s/g, ``) : ``;
        stateOrProvince = Hf.isNonEmptyString(stateOrProvince) ? stateOrProvince.replace(/\s/g, ``) : ``;
        country = Hf.isNonEmptyString(country) ? country.replace(/\s/g, ``) : ``;

        if (!Hf.isEmpty(stateOrProvince) && Hf.isEmpty(country)) {
            country = stateOrProvince;
            stateOrProvince = ``;
        } else if (!Hf.isEmpty(country)) {
            stateOrProvince = `${stateOrProvince}, `;
        }

        return (
            <AreaButton
                overlay = 'transparent'
                size = 'small'
                margin = {{
                    horizontal: 10
                }}
                onPress = {() => {
                    onPressSelectAndSubmit(item);
                }}
            >
                <ColumnLayout
                    room = 'content-left'
                    roomAlignment = 'center'
                >
                    <IconImage
                        room = 'content-left'
                        color = { item.suggestionType === `pin` || item.suggestionType === `history` ? `accent` : `primary` }
                        source = {(() => {
                            switch (item.suggestionType) { // eslint-disable-line
                            case `pin`:
                                return `star`;
                            case `history`:
                                return `history`;
                            case `autocompletion`:
                                return `search`;
                            default:
                                return null;
                            }
                        })()}
                        margin = {{
                            left: 10
                        }}
                    />
                    <InfoText
                        room = 'content-right'
                        color = { item.suggestionType === `pin` || item.suggestionType === `history` ? `accent` : `secondary` }
                        indentation = { 10 }
                    >{ `${city} ${stateOrProvince}${country}` }</InfoText>
                </ColumnLayout>
            </AreaButton>
        );
    },
    renderCitySeachAndGoHomeRegion () {
        const component = this;
        const {
            citySuggestionVisible,
            status
        } = component.state;

        if (status.online && status.geolocationOnline) {
            return (
                <RowLayout
                    room = 'content-top'
                    roomAlignment = 'stretch'
                    contentTopRoomAlignment = 'stretch'
                    contentMiddleRoomAlignment = 'start'
                    margin = {{
                        top: 50,
                        horizontal: 10
                    }}
                >
                    <SearchField
                        room = 'content-top'
                        overlay = 'opaque'
                        hint = 'Search City...'
                        autoFocus = { false }
                        suggestive = { true }
                        dropShadowed = { true }
                        // pinnedSuggestionValues = {[ `Tokyo, Japan`, `Delhi, India`, `Shanghai, China`, `São Paulo, Brazil`, `New York, US`, `Seattle, US` ]}
                        style = {{
                            container: {
                                overflow: `visible`
                            },
                            suggestion: {
                                left: -10,
                                marginTop: 5,
                                borderTopLeftRadius: 6,
                                borderTopRightRadius: 6
                            }
                        }}
                        onSearch = { component.onSearchCity }
                        onGetAutocompletionValues = { component.onGetCityAutocompletions }
                        onHideSuggestion = {() => {
                            const [ goToHomeRegionButtonRef ] = component.lookupComponentRefs(`go-to-home-region-button`);
                            if (goToHomeRegionButtonRef !== null) {
                                goToHomeRegionButtonRef.animate({
                                    refName: `animated-container-view`,
                                    transitions: [
                                        {
                                            from: {
                                                translateX: -CONSTANT.GENERAL.DEVICE_WIDTH,
                                                opacity: 0
                                            },
                                            to: {
                                                translateX: 0,
                                                opacity: 1
                                            },
                                            option: {
                                                duration: 300
                                            }
                                        }
                                    ]
                                });
                            }
                            component.outgoing(EVENT.ON.TOGGLE_CITY_SUGGESTION_VISIBILITY).emit();
                        }}
                        onShowSuggestion = {() => {
                            const [ goToHomeRegionButtonRef ] = component.lookupComponentRefs(`go-to-home-region-button`);
                            if (goToHomeRegionButtonRef !== null) {
                                goToHomeRegionButtonRef.animate({
                                    refName: `animated-container-view`,
                                    transitions: [
                                        {
                                            from: {
                                                translateX: 0,
                                                opacity: 1
                                            },
                                            to: {
                                                translateX: -CONSTANT.GENERAL.DEVICE_WIDTH,
                                                opacity: 0
                                            },
                                            option: {
                                                duration: 300
                                            }
                                        }
                                    ]
                                });
                            }
                            component.outgoing(EVENT.ON.TOGGLE_CITY_SUGGESTION_VISIBILITY).emit();
                        }}
                        renderSuggestionItem = { component.renderCitySuggestionItem }
                    >
                        <FlatButton
                            room = 'content-left'
                            action = { citySuggestionVisible ? `hide-suggestion` : `search` }
                            overlay = 'transparent'
                        >
                            <IconImage
                                ref = {(componentRef) => {
                                    component.searchFieldLeftIconRef = componentRef;
                                }}
                                room = 'content-middle'
                                source = { citySuggestionVisible ? `back` : `search` }
                            />
                        </FlatButton>
                        <FlatButton
                            room = 'content-right'
                            action = 'clear'
                            overlay = 'transparent'
                        >
                            <IconImage
                                room = 'content-middle'
                                exclusions = {[ `size` ]}
                                size = 'small'
                                source = 'close'
                            />
                        </FlatButton>
                    </SearchField>
                    <RaisedButton
                        ref = { component.assignComponentRef(`go-to-home-region-button`) }
                        room = 'content-middle'
                        color = { Theme.color.palette.white }
                        margin = {{
                            top: 10
                        }}
                        onPress = { component.onPressGoToHomeRegionButton }
                    >
                        <IconImage
                            room = 'content-middle'
                            exclusions = {[ `size`, `color` ]}
                            color = 'primary'
                            size = 'small'
                            source = 'current-location'
                        />
                    </RaisedButton>
                </RowLayout>
            );
        }
        return null;
    },
    renderAQRSiteMap () {
        const component = this;
        const {
            status,
            homeRegion,
            aqr
        } = component.state;

        if (status.online && status.geolocationOnline) {
            return (
                <AQRSiteMapView
                    ref = { component.assignComponentRef(`aqr-site-map-view`) }
                    room = 'content-top'
                    tracking = { aqr.info.status.loading }
                    aqrSites = { aqr.sites }
                    selectedAQRSiteCode = { aqr.selectedSiteCode }
                    homeRegion = {{
                        latitude: homeRegion.latitude,
                        longitude: homeRegion.longitude,
                        latitudeDelta: homeRegion.latitudeDelta,
                        longitudeDelta: homeRegion.longitudeDelta
                    }}
                    onPress = { component.onMapPress }
                    onPressAQRSiteMarker = { component.onPressAQRSiteMarker }
                    onRegionUpdated = { component.onRegionUpdated }
                />
            );
        }
        return null;
    },
    renderAQRSiteCalloutPanel () {
        const component = this;
        const {
            status,
            aqr
        } = component.state;

        if (!aqr.info.status.loading && status.online && status.geolocationOnline && aqr.info.status.availability.siteData) {
            const selectedAQRSite = aqr.sites.find((aqrSite) => aqrSite.info.code === aqr.selectedSiteCode);
            const lastUpdatedDurration = Hf.isObject(selectedAQRSite) ? moment().diff(moment(selectedAQRSite.info.timestamp), `minutes`) : 0;
            let lastUpdatedMessage = ``;

            if (lastUpdatedDurration <= 1) {
                lastUpdatedMessage = `Updated Just Now`;
            } else if (lastUpdatedDurration > 1 && lastUpdatedDurration <= 60) {
                lastUpdatedMessage = `Updated ${lastUpdatedDurration} Minutes Ago`;
            } else if (lastUpdatedDurration > 60 && lastUpdatedDurration <= 120) {
                lastUpdatedMessage = `Updated An Hour Ago`;
            } else if (lastUpdatedDurration > 120) {
                lastUpdatedMessage = `Updated ${Math.round(lastUpdatedDurration / 60)} Hours Ago`;
            }

            return (
                <RowLayout
                    ref = { component.assignComponentRef(`aqr-site-callout-panel-layout`) }
                    room = 'content-bottom'
                    roomAlignment = 'center'
                    contentTopRoomAlignment = 'center'
                    contentMiddleRoomAlignment = 'center'
                    contentBottomRoomAlignment = 'center'
                    overlay = 'opaque'
                    color = { Theme.color.palette.white }
                    corner = {{
                        topLeft: 6,
                        topRight: 6
                    }}
                    dropShadowed = { true }
                    padding = {{
                        top: 5,
                        bottom: 100,
                        horizontal: 5
                    }}
                    style = {{
                        container: {
                            transform: [{
                                translateY: 250
                            }]
                        }
                    }}
                >
                    { Hf.isObject(selectedAQRSite) ? ([
                        <ColumnLayout
                            key = 'column-layout-0'
                            room = 'content-top'
                            roomAlignment = 'stretch'
                            contentLeftRoomAlignment = 'center'
                            contentRightRoomAlignment = 'center'
                        >
                            <HeadlineText
                                room = 'content-left'
                                color = { Theme.color.aqAlerts[selectedAQRSite.aqSample.aqAlertIndex] }
                            >{ ` Air Quality Is ${selectedAQRSite.aqSample.aqAlertMessage} ` }</HeadlineText>
                            <FlatButton
                                room = 'content-right'
                                overlay = 'transparent'
                                size = 'small'
                                color = { Theme.color.aqAlerts[selectedAQRSite.aqSample.aqAlertIndex] }
                                onPress = {() => {
                                    component.onPressQActionalbleTipButton(selectedAQRSite);
                                }}
                            >
                                <IconImage room = 'content-middle' source = 'info'/>
                            </FlatButton>
                        </ColumnLayout>,
                        <ColumnLayout
                            key = 'column-layout-1'
                            room = 'content-middle'
                            roomAlignment = 'center'
                            contentLeftRoomAlignment = 'center'
                            contentMiddleRoomAlignment = 'stretch'
                            contentRightRoomAlignment = 'center'
                            margin = {{
                                bottom: 10
                            }}
                        >
                            <HeadlineText room = 'content-left' size = 'small' > AQI   </HeadlineText>
                            <TitleText
                                room = 'content-left'
                                size = 'small'
                                color = { Theme.color.aqAlerts[selectedAQRSite.aqSample.aqAlertIndex] }
                            >{ selectedAQRSite.aqSample.aqi }</TitleText>
                            <VerticalDivider
                                room = 'content-middle'
                                margin = {{
                                    horizontal: 10
                                }}
                            />
                            <HeadlineText
                                room = 'content-right'
                                size = 'small'
                            >{`${ selectedAQRSite.aqSample.aqParam.toUpperCase()}  `}</HeadlineText>
                            <TitleText
                                room = 'content-right'
                                size = 'small'
                                color = { Theme.color.aqAlerts[selectedAQRSite.aqSample.aqAlertIndex] }
                            >{ selectedAQRSite.aqSample.aqConcentration }</TitleText>
                            <InfoText
                                room = 'content-right'
                                indentation = { 6 }
                            >{ selectedAQRSite.aqSample.aqUnit }</InfoText>
                            <FlatButton
                                room = 'content-right'
                                overlay = 'transparent'
                                size = 'small'
                                onPress = {() => {
                                    component.onPressAQWhatisButton(selectedAQRSite);
                                }}
                            >
                                <IconImage room = 'content-middle' source = 'info'/>
                            </FlatButton>
                        </ColumnLayout>,
                        <CaptionText key = 'caption-text' room = 'content-bottom' size = 'small' >{ lastUpdatedMessage }</CaptionText>
                    ]) : null }
                </RowLayout>
            );
        }
        return null;
    },
    renderAQRSitesRefresh () {
        const component = this;
        const {
            status,
            aqr
        } = component.state;

        if (!aqr.info.status.loading && (!aqr.info.status.availability.siteData || !status.online || !status.geolocationOnline)) {
            return (
                <RowLayout
                    room = 'content-middle'
                    roomAlignment = 'center'
                    contentTopRoomAlignment = 'center'
                    contentMiddleRoomAlignment = 'center'
                    contentBottomRoomAlignment = 'stretch'
                    overlay = 'opaque'
                    corner = 'round'
                    dropShadowed = { true }
                    padding = { 10 }
                    margin = {{
                        horizontal: 5
                    }}
                >
                    <HeadlineText room = 'content-top' size = 'small' > Regional Air Quality </HeadlineText>
                    <HeadlineText room = 'content-middle' size = 'small' > Monitor Site Is Unavailable </HeadlineText>
                    <FlatButton
                        room = 'content-bottom'
                        label = 'REFRESH'
                        margin = {{
                            top: 20
                        }}
                        onPress = { component.onRefreshAQRSiteData }
                    />
                </RowLayout>
            );
        }
        return null;
    },
    renderLoadingIndicator () {
        const component = this;
        const {
            aqr
        } = component.state;

        if (aqr.info.status.loading) {
            return (
                <RowLayout
                    room = 'content-middle'
                    roomAlignment = 'center'
                    contentMiddleRoomAlignment = 'center'
                    contentBottomRoomAlignment = 'center'
                    overlay = 'opaque'
                    corner = 'round'
                    dropShadowed = { true }
                    padding = { 10 }
                    margin = {{
                        horizontal: 5
                    }}
                >
                    <ActivityIndicator room = 'content-middle' size = 'large' />
                    <HeadlineText room = 'content-bottom' size = 'small' > Please Wait... </HeadlineText>
                </RowLayout>
            );
        }
        return null;
    },
    render () {
        const component = this;
        const {
            aqActionableTip,
            aqWhatis
        } = component.state;

        return ([
            <BodyScreen
                key = 'body-screen'
                roomAlignment = 'stretch'
                contentTopRoomAlignment = 'stretch'
                contentMiddleRoomAlignment = 'center'
                contentBottomRoomAlignment = 'stretch'
            >
                {
                    component.renderAQRSiteMap()
                }
                {
                    component.renderCitySeachAndGoHomeRegion()
                }
                {
                    component.renderAQRSitesRefresh()
                }
                {
                    component.renderLoadingIndicator()
                }
                {
                    component.renderAQRSiteCalloutPanel()
                }
            </BodyScreen>,
            <AQActionableTipModal
                key = 'aq-actionable-tip-modal'
                { ...aqActionableTip }
                onClose = { component.onCloseAQActionalbleTipModal }
            />,
            <AQWhatisModal
                key = 'aq-whatis-modal'
                { ...aqWhatis }
                onClose = { component.onCloseAQWhatisModal }
            />
        ]);
    }
});
export default MapInterface;
