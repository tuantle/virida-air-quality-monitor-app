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
 * @module MonitorInterface
 * @description - Virida client-native app air quality regional monitor (dust concentration PM25 and other pollutants) interface.
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

import { StackedBarChart, XAxis } from 'react-native-svg-charts';

import { Text as SvgText } from 'react-native-svg';

import AQActionableTipModal from '../../common/components/modals/aq-actionable-tip-modal';

import AQWhatisModal from '../../common/components/modals/aq-whatis-modal';

import AQGradientView from '../../common/components/views/aq-gradient-view';

import AQForecastDisscussionModal from '../../common/components/modals/aq-forecast-discussion-modal';

import MovingWaveView from '../../common/components/views/moving-wave-view';

import Theme from '../../common/theme';

import CONSTANT from '../../common/constant';

import EVENT from '../events/monitor-event';

const {
    ActivityIndicator,
    Linking
} = ReactNative;

const {
    BodyScreen,
    RowLayout,
    ColumnLayout,
    FlatButton,
    HeadlineText,
    TitleText,
    SubtitleText,
    InfoText,
    CaptionText,
    IconImage,
    CoverImage,
    HorizontalDivider
} = Ht;

const aqGradientScale = require(`../../../assets/images/aq-gradient-scale.png`);
const aqAlertIndexMarkers = [
    require(`../../../assets/images/marker-1.png`),
    require(`../../../assets/images/marker-2.png`),
    require(`../../../assets/images/marker-3.png`),
    require(`../../../assets/images/marker-4.png`),
    require(`../../../assets/images/marker-5.png`),
    require(`../../../assets/images/marker-6.png`)
];

const MonitorInterface = Hf.Interface.augment({
    composites: [
        Hf.React.ComponentComposite
    ],
    setup (done) {
        done();
    },
    teardown (done) {
        done();
    },
    onRefreshAQRFeedData () {
        const component = this;
        component.outgoing(EVENT.ON.REFRESH_AQR_FEED_DATA).emit();
    },
    onRefreshAQRForecastData () {
        const component = this;
        component.outgoing(EVENT.ON.REFRESH_AQR_FORECAST_DATA).emit();
    },
    onCloseAQActionalbleTipModal () {
        const component = this;
        component.outgoing(EVENT.ON.CLOSE_AQ_ACTIONABLE_TIP_MODAL).emit();
    },
    onCloseAQWhatisModal () {
        const component = this;
        component.outgoing(EVENT.ON.CLOSE_AQ_WHATIS_MODAL).emit();
    },
    onCloseAQForecastDiscussionModal () {
        const component = this;
        component.outgoing(EVENT.ON.CLOSE_AQ_FORECAST_DISCUSSION_MODAL).emit();
    },
    onPressQActionalbleTipButton (aqSummary) {
        const component = this;

        component.outgoing(EVENT.ON.SHOW_AQ_ACTIONABLE_TIP_MODAL).emit(() => {
            return {
                visible: true,
                aqSample: {
                    aqParam: aqSummary.aqParam,
                    aqAlertMessage: aqSummary.aqAlertMessage,
                    aqAlertIndex: aqSummary.aqAlertIndex,
                    aqi: aqSummary.aqi
                }
            };
        });
    },
    onPressAQWhatisButton (aqSample) {
        const component = this;

        component.outgoing(EVENT.ON.SHOW_AQ_WHATIS_MODAL).emit(() => {
            return {
                visible: true,
                aqSample: {
                    aqParam: aqSample.aqParam,
                    aqAlertIndex: aqSample.aqAlertIndex,
                    aqi: aqSample.aqi,
                    aqConcentration: aqSample.aqConcentration,
                    aqUnit: aqSample.aqUnit,
                    aqParamColor: aqSample.aqParamColor
                }
            };
        });
    },
    onPressAQForecastDiscussionButton (aqForecastDiscussionMessage) {
        const component = this;

        component.outgoing(EVENT.ON.SHOW_AQ_FORECAST_DISCUSSION_MODAL).emit(() => {
            return {
                visible: true,
                message: aqForecastDiscussionMessage
            };
        });
    },
    onPressGoToYEAFBButton () {
        Linking.canOpenURL(CONSTANT.URL.YEA_FB1).then((supported) => {
            if (supported) {
                return Linking.openURL(CONSTANT.URL.YEA_FB1);
            }
            return Linking.openURL(CONSTANT.URL.YEA_FB2);
        }).catch(() => {
            Hf.log(`warn1`, `AboutViewInterface - Unable to open Y.E.A app or website at ${CONSTANT.URL.YEA_ABOUT}.`);
        });
    },
    onPressGoToAboutYEAInstagramButton () {
        Linking.openURL(CONSTANT.URL.YEA_INSTAGRAM).catch(() => {
            Hf.log(`warn1`, `AboutViewInterface - Unable to open Y.E.A Instagram app or website at ${CONSTANT.URL.YEA_INSTAGRAM}.`);
        });
    },
    // onPressDonateToYEAButton () {
    //     Linking.openURL(CONSTANT.URL.YEA_DONATION).catch(() => {
    //         Hf.log(`warn1`, `AboutViewInterface - Unable to open Y.E.A donation at ${CONSTANT.URL.YEA_DONATION}.`);
    //     });
    // },
    renderAQRFeedDataRefresh () {
        const component = this;
        const {
            status,
            aqr
        } = component.state;

        if (!aqr.info.status.loading && (!aqr.info.status.availability.feedData || !status.online || !status.geolocationOnline)) {
            return (
                <RowLayout
                    room = 'content-middle'
                    roomAlignment = 'center'
                    contentTopRoomAlignment = 'center'
                    contentMiddleRoomAlignment = 'center'
                    contentBottomRoomAlignment = 'stretch'
                    overlay = 'opaque'
                    corner = 'round'
                    padding = { 10 }
                    margin = {{
                        top: 250,
                        horizontal: 5
                    }}
                >
                    <HeadlineText room = 'content-top' size = 'small' > Regional Air Quality </HeadlineText>
                    <HeadlineText room = 'content-middle' size = 'small' > Feed Data Is Unavailable </HeadlineText>
                    <FlatButton
                        room = 'content-bottom'
                        label = 'REFRESH'
                        margin = {{
                            top: 20
                        }}
                        onPress = { component.onRefreshAQRFeedData }
                    />
                </RowLayout>
            );
        }
        return null;
    },
    renderAQRForecastDataRefresh () {
        const component = this;
        const {
            status,
            aqr
        } = component.state;

        if (!aqr.info.status.loading && (!aqr.info.status.availability.forecastData || !status.online || !status.geolocationOnline)) {
            return (
                <RowLayout
                    room = 'content-middle'
                    roomAlignment = 'center'
                    contentTopRoomAlignment = 'center'
                    contentMiddleRoomAlignment = 'center'
                    contentBottomRoomAlignment = 'stretch'
                    padding = { 10 }
                    margin = {{
                        horizontal: 5
                    }}
                >
                    <HeadlineText room = 'content-top' size = 'small' > Regional Air Quality </HeadlineText>
                    <HeadlineText room = 'content-middle' size = 'small' > Forecast Data Is Unavailable </HeadlineText>
                    <FlatButton
                        room = 'content-bottom'
                        label = 'REFRESH'
                        margin = {{
                            top: 20
                        }}
                        onPress = { component.onRefreshAQRForecastData }
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
                    padding = { 10 }
                    margin = {{
                        top: 250
                    }}
                >
                    <ActivityIndicator room = 'content-middle' size = 'large' />
                    <HeadlineText room = 'content-bottom' size = 'small' > Please Wait... </HeadlineText>
                </RowLayout>
            );
        }
        return null;
    },
    renderAQMonitors (aqSummary) {
        const component = this;
        const {
            status,
            aqr
        } = component.state;

        if (!aqr.info.status.loading && status.online && status.geolocationOnline && aqr.info.status.availability.feedData) {
            const aqForecastDiscussionMessage = Hf.isEmpty(aqr.forecasts) ? `` : aqr.forecasts[0].aqDissusionMessage;
            const aqForecastDataPts = aqr.forecasts.map((aqForecast) => {
                let good = 0;
                let moderate = 0;
                let unhealthy = 0;
                let harmful = 0;
                let deadly = 0;

                if (aqForecast.aqi >= 0 && aqForecast.aqi <= 50) {
                    good = aqForecast.aqi;
                } else if (aqForecast.aqi > 50 && aqForecast.aqi <= 100) {
                    good = 50;
                    moderate = aqForecast.aqi - good;
                } else if (aqForecast.aqi > 100 && aqForecast.aqi <= 200) {
                    good = 50;
                    moderate = 50;
                    unhealthy = aqForecast.aqi - (good + moderate);
                } else if (aqForecast.aqi > 200 && aqForecast.aqi <= 300) {
                    good = 50;
                    moderate = 50;
                    unhealthy = 100;
                    harmful = aqForecast.aqi - (good + moderate + unhealthy);
                } else if (aqForecast.aqi > 300) {
                    good = 50;
                    moderate = 50;
                    unhealthy = 100;
                    harmful = 100;
                    deadly = aqForecast.aqi - (good + moderate + unhealthy + harmful);
                }

                return {
                    xLabel: aqForecast.day,
                    aqi: aqForecast.aqi,
                    aqAlertIndex: aqForecast.aqAlertIndex,
                    good,
                    moderate,
                    unhealthy,
                    harmful,
                    deadly
                };
            });
            const AQRForecastDataPtStackedBarLabels = ({
                x,
                y,
                data: _aqForecastDataPts
            }) => {
                return _aqForecastDataPts.map((aqForecastDataPt, index) => {
                    const _x = x(index) + 10;
                    const _y = y(aqForecastDataPt.aqi) - 10;

                    if (aqForecastDataPt.aqi > 0) {
                        return (
                            <SvgText
                                key = { index }
                                x = { _x }
                                y = { _y }
                                fontSize = { 12 }
                                fontWeight = 'bold'
                                fill = { Theme.color.aqAlerts[aqForecastDataPt.aqAlertIndex] }
                                alignmentBaseline = 'center'
                            >{ aqForecastDataPt.aqi }</SvgText>
                        );
                    }
                    return null;
                });
            };

            return ([
                <RowLayout
                    key = 'aqi-monitor-view'
                    room = 'content-bottom'
                    contentTopRoomAlignment = 'center'
                    contentMiddleRoomAlignment = 'start'
                    contentBottomRoomAlignment = 'stretch'
                    overlay = 'translucent'
                    corner = 'round'
                    color = { Theme.color.palette.white }
                    padding = { 5 }
                    margin = { 5 }
                >
                    <SubtitleText room = 'content-top' size = 'small' > Regional Air Quality Is </SubtitleText>
                    <ColumnLayout
                        room = 'content-top'
                        roomAlignment = 'stretch'
                        contentLeftRoomAlignment = 'center'
                        contentRightRoomAlignment = 'center'
                    >
                        <TitleText room = 'content-left' size = 'large' color = { Theme.color.aqAlerts[aqSummary.aqAlertIndex] }>{ aqSummary.aqAlertMessage }</TitleText>
                        <FlatButton
                            room = 'content-right'
                            overlay = 'transparent'
                            size = 'large'
                            color = { Theme.color.aqAlerts[aqSummary.aqAlertIndex] }
                            onPress = {() => {
                                component.onPressQActionalbleTipButton(aqSummary);
                            }}
                        >
                            <IconImage room = 'content-middle' source = 'info'/>
                        </FlatButton>
                    </ColumnLayout>
                    <CoverImage
                        room = 'content-middle'
                        width = { aqSummary.aqi < 100 ? 60 : 80 }
                        height = { 45 }
                        resizeMode = 'stretch'
                        dropShadowed = { true }
                        source = { aqAlertIndexMarkers[aqSummary.aqAlertIndex] }
                        style = {{
                            paddingBottom: 5,
                            marginLeft: aqSummary.aqi < 400 ? parseInt(0.675 * aqSummary.aqi, 10) + 10 : 295,
                            shadowOffset: {
                                width: 0,
                                height: 0
                            },
                            shadowRadius: 1,
                            shadowOpacity: 0.1
                        }}
                    >
                        <TitleText size = 'small' color = { Theme.color.palette.white }>{ aqSummary.aqi }</TitleText>
                    </CoverImage>
                    <CoverImage
                        room = 'content-middle'
                        width = { CONSTANT.GENERAL.DEVICE_WIDTH - 80 }
                        height = { 50 }
                        resizeMode = 'stretch'
                        margin = {{
                            top: 5,
                            left: 35
                        }}
                        source = { aqGradientScale }
                    />
                    <RowLayout
                        room = 'content-bottom'
                        roomAlignment = 'stretch'
                        contentTopRoomAlignment = 'center'
                        contentBottomRoomAlignment = 'center'
                        margin = {{
                            top: 10
                        }}
                    >
                        {
                            aqr.info.status.availability.forecastData ? [
                                <ColumnLayout
                                    key = 'forecast-chart-label-layout'
                                    room = 'content-top'
                                    roomAlignment = 'stretch'
                                    contentLeftRoomAlignment = 'center'
                                    contentRightRoomAlignment = 'center'
                                >
                                    <SubtitleText key = 'subtitle-text' room = 'content-left' size = 'small' > 5 Days Forecast </SubtitleText>
                                    {
                                        Hf.isEmpty(aqForecastDiscussionMessage) ? null : <FlatButton
                                            room = 'content-right'
                                            overlay = 'transparent'
                                            size = 'small'
                                            onPress = {() => {
                                                component.onPressAQForecastDiscussionButton(aqForecastDiscussionMessage);
                                            }}
                                        >
                                            <IconImage room = 'content-middle' source = 'info'/>
                                        </FlatButton>
                                    }
                                </ColumnLayout>,
                                <StackedBarChart
                                    key = 'stacked-bar-chart'
                                    room = 'content-top'
                                    spacingInner = { 0.35 }
                                    spacingOuter = { 0.35 }
                                    keys = {[
                                        `good`,
                                        `moderate`,
                                        `unhealthy`,
                                        `harmful`,
                                        `deadly`
                                    ]}
                                    colors = { Theme.color.aqAlerts }
                                    data = { aqForecastDataPts }
                                    showGrid = { false }
                                    contentInset = {{
                                        top: 15,
                                        bottom: 0,
                                        left: 10,
                                        right: 10
                                    }}
                                    style = {{
                                        width: CONSTANT.GENERAL.DEVICE_WIDTH - 20,
                                        height: 80
                                    }}
                                >
                                    <AQRForecastDataPtStackedBarLabels/>
                                </StackedBarChart>,
                                <HorizontalDivider key = 'horizontal-divider' room = 'content-bottom' />,
                                <XAxis
                                    key = 'x-axis'
                                    room = 'content-bottom'
                                    data = { aqForecastDataPts }
                                    formatLabel = { (index) => aqForecastDataPts[index].xLabel }
                                    contentInset = {{
                                        left: 15,
                                        right: 15
                                    }}
                                    svg = {{
                                        ...Theme.font.thinSmaller,
                                        fill: Theme.color.light.secondary
                                    }}
                                    style = {{
                                        width: CONSTANT.GENERAL.DEVICE_WIDTH - 100
                                    }}
                                />
                            ] : component.renderAQRForecastDataRefresh()
                        }
                    </RowLayout>
                </RowLayout>,
                ...aqr.feeds.sort((aqSampleA, aqSampleB) => aqSampleB.aqi - aqSampleA.aqi).map((aqSample, index) => {
                    return (
                        <RowLayout
                            key = { `${index}` }
                            room = 'content-bottom'
                            contentTopRoomAlignment = 'stretch'
                            contentMiddleRoomAlignment = 'start'
                            contentBottomRoomAlignment = 'center'
                            overlay = 'translucent'
                            corner = 'round'
                            color = { aqSample.aqParamColor }
                            padding = {{
                                horizontal: 5
                            }}
                            margin = { 5 }
                        >
                            <ColumnLayout
                                room = 'content-top'
                                roomAlignment = 'stretch'
                                contentLeftRoomAlignment = 'center'
                                contentRightRoomAlignment = 'center'
                            >
                                <TitleText room = 'content-left' size = 'small' color = { Theme.color.palette.white }>{ aqSample.aqParam.toUpperCase() }</TitleText>
                                <SubtitleText
                                    room = 'content-left'
                                    size = 'small'
                                    color = { Theme.color.palette.white }
                                >{ `  ${aqSample.aqAlertMessage} @ ` }</SubtitleText>
                                <SubtitleText
                                    room = 'content-left'
                                    size = 'small'
                                    color = { Theme.color.palette.white }
                                >{ `  ${aqSample.aqConcentration} ` }</SubtitleText>
                                <InfoText room = 'content-left' size = 'small' indentation = { 6 } color = { Theme.color.palette.white } >{ aqSample.aqUnit }</InfoText>
                                <FlatButton
                                    room = 'content-right'
                                    overlay = 'transparent'
                                    size = 'small'
                                    color = { Theme.color.palette.white }
                                    onPress = {() => {
                                        component.onPressAQWhatisButton(aqSample);
                                    }}
                                >
                                    <IconImage room = 'content-middle' source = 'info'/>
                                </FlatButton>
                            </ColumnLayout>
                        </RowLayout>
                    );
                })
            ]);
        }
        return null;
    },
    render () {
        const component = this;
        const {
            status,
            aqr,
            aqActionableTip,
            aqWhatis,
            aqForecastDiscussion
        } = component.state;
        const aqSummary = aqr.feeds.reduce((_aqSummary, aqSample) => {
            if (_aqSummary.aqi <= aqSample. aqi) {
                return {
                    aqi: aqSample.aqi,
                    aqParam: aqSample.aqParam,
                    aqAlertIndex: aqSample.aqAlertIndex,
                    aqAlertMessage: aqSample.aqAlertMessage
                };
            }
            return _aqSummary;
        }, {
            aqi: 0,
            aqParam: ``,
            aqAlertIndex: 0,
            aqAlertMessage: ``
        });
        const lastUpdatedDurration = moment().diff(moment(aqr.info.timestamp), `minutes`);
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

        return ([
            <AQGradientView
                key = 'aq-gradient-screen'
                aqAlertIndex = { aqSummary.aqAlertIndex }
            >
                <BodyScreen
                    overlay = 'transparent'
                    coverImageSource = { require(`../../../assets/images/background-gradient.png`) }
                    contentTopRoomAlignment = 'stretch'
                    contentMiddleRoomAlignment = 'center'
                    contentBottomRoomAlignment = 'stretch'
                >
                    <ColumnLayout
                        room = 'content-top'
                        roomAlignment = 'stretch'
                        contentLeftRoomAlignment = 'end'
                        contentRightRoomAlignment = 'end'
                    >
                        <FlatButton
                            room = 'content-left'
                            overlay = 'transparent'
                            size = 'small'
                            onPress = { component.onPressGoToYEAFBButton }
                        >
                            <CoverImage
                                room = 'content-middle'
                                width = { 27 }
                                height = { 27 }
                                source = { require(`../../../assets/logos/fb-logo.png`) }
                            />
                        </FlatButton>
                        <FlatButton
                            room = 'content-left'
                            overlay = 'transparent'
                            size = 'small'
                            onPress = { component.onPressGoToAboutYEAInstagramButton }
                        >
                            <CoverImage
                                room = 'content-middle'
                                width = { 27 }
                                height = { 27 }
                                source = { require(`../../../assets/logos/instagram-logo.png`) }
                            />
                        </FlatButton>
                        <RowLayout
                            room = 'content-right'
                            contentTopRoomAlignment = 'end'
                            contentBottomRoomAlignment = 'end'
                            margin = {{
                                top: 35,
                                bottom: 5,
                                horizontal: 5
                            }}
                        >
                            <InfoText room = 'content-top' size = 'large' >{ aqr.info.name }</InfoText>
                            <CaptionText room = 'content-bottom' size = 'small' >{ lastUpdatedMessage }</CaptionText>
                        </RowLayout>
                    </ColumnLayout>
                    {
                        status.active && !status.idle ? <MovingWaveView
                            room = 'content-bottom'
                            waves = {[{
                                color: Theme.color.palette.cyan,
                                opacity: 0.35,
                                lineThickness: 6,
                                amplitude: 50,
                                phase: 45,
                                verticalOffset: 5
                            }, {
                                color: Theme.color.palette.teal,
                                opacity: 0.3,
                                lineThickness: 3,
                                amplitude: 40,
                                phase: 90,
                                verticalOffset: 15
                            }, {
                                color: Theme.color.palette.deepBlue,
                                opacity: 0.25,
                                lineThickness: 10,
                                amplitude: 30,
                                phase: 120,
                                verticalOffset: 20
                            }]}
                        /> : null
                    }
                    {
                        component.renderAQMonitors(aqSummary)
                    }
                    {
                        component.renderAQRFeedDataRefresh()
                    }
                    {
                        component.renderLoadingIndicator()
                    }
                </BodyScreen>
            </AQGradientView>,
            <AQActionableTipModal
                key = 'aq-actionable-tip-modal'
                { ...aqActionableTip }
                onClose = { component.onCloseAQActionalbleTipModal }
            />,
            <AQWhatisModal
                key = 'aq-whatis-modal'
                { ...aqWhatis }
                onClose = { component.onCloseAQWhatisModal }
            />,
            <AQForecastDisscussionModal
                key = 'aq-forecast-discussion-modal'
                { ...aqForecastDiscussion }
                onClose = { component.onCloseAQForecastDiscussionModal }
            />
        ]);
    }
});
export default MonitorInterface;
