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
 * @module AboutView
 * @description - Virida client-native app about view component.
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

import React from 'react';

import ReactNative from 'react-native'; // eslint-disable-line

import PropTypes from 'prop-types';

import FBLikeWebView from '../../../common/components/views/fb-like-webview';

import Theme from '../../../common/theme';

import CONSTANT from '../../../common/constant';

const {
    Component
} = React;

const {
    Linking
} = ReactNative;

const {
    HeaderScreen,
    BodyScreen,
    RowLayout,
    ColumnLayout,
    AreaButton,
    FlatButton,
    IconImage,
    AvatarImage,
    CoverImage,
    SubtitleText,
    InfoText
} = Ht;

export default class PolicyView extends Component {
    static propTypes = {
        navigation: PropTypes.object
    }
    static defaultProps = {
        navigation: {}
    }
    constructor (props) {
        super(props);

        this.headerScreenRef = null;
    }
    onPressGoBackButton = () => {
        const component = this;
        const {
            navigation
        } = component.props;

        if (component.headerScreenRef !== null) {
            component.headerScreenRef.animate({
                refName: `animated-navigation-content-middle-room-view`,
                transitions: [
                    {
                        from: {
                            translateX: 0,
                            opacity: 1
                        },
                        to: {
                            translateX: CONSTANT.GENERAL.DEVICE_WIDTH,
                            opacity: 0
                        },
                        option: {
                            duration: 300
                        }
                    }
                ],
                onAnimationEnd: () => {
                    navigation.goBack();
                }
            });
        }
    }
    onPressGoToAboutProjectViridaButton = () => {
        Linking.openURL(CONSTANT.URL.YEA_PROJECT_VIRIDA).catch(() => {
            Hf.log(`warn1`, `Unable to open Project Virida website at ${CONSTANT.URL.YEA_PROJECT_VIRIDA}.`);
        });
    }
    onPressGoToAboutYEAButton = () => {
        Linking.openURL(CONSTANT.URL.YEA_ABOUT).catch(() => {
            Hf.log(`warn1`, `Unable to open Y.E.A website at ${CONSTANT.URL.YEA_ABOUT}.`);
        });
    }
    onPressGoToAboutAirNowButton = () => {
        Linking.openURL(CONSTANT.URL.AIR_NOW_ABOUT).catch(() => {
            Hf.log(`warn1`, `Unable to open AirNow website at ${CONSTANT.URL.AIR_NOW_ABOUT}.`);
        });
    }
    onPressGoToAboutAQICNButton = () => {
        Linking.openURL(CONSTANT.URL.AQICN_ABOUT).catch(() => {
            Hf.log(`warn1`, `Unable to open AQICN website at ${CONSTANT.URL.AQICN_ABOUT}.`);
        });
    }
    onPressGoToYEAFBButton = () => {
        Linking.canOpenURL(CONSTANT.URL.YEA_FB1).then((supported) => {
            if (supported) {
                return Linking.openURL(CONSTANT.URL.YEA_FB1);
            }
            return Linking.openURL(CONSTANT.URL.YEA_FB2);
        }).catch(() => {
            Hf.log(`warn1`, `Unable to open Y.E.A app or website at ${CONSTANT.URL.YEA_ABOUT}.`);
        });
    }
    onPressGoToAboutYEAInstagramButton = () => {
        Linking.openURL(CONSTANT.URL.YEA_INSTAGRAM).catch(() => {
            Hf.log(`warn1`, `Unable to open Y.E.A Instagram app or website at ${CONSTANT.URL.YEA_INSTAGRAM}.`);
        });
    }
    onPressDonateToYEAButton = () => {
        Linking.openURL(CONSTANT.URL.YEA_DONATION).catch(() => {
            Hf.log(`warn1`, `Unable to open Y.E.A donation at ${CONSTANT.URL.YEA_DONATION}.`);
        });
    }
    // onPressGoToYEAContactButton = () => {
    //     Linking.openURL(CONSTANT.URL.YEA_CONTACT).catch(() => {
    //         Hf.log(`warn1`, `Unable to open Y.E.A contact link at ${CONSTANT.URL.YEA_CONTACT}.`);
    //     });
    // },
    onPressGoToPolicyButton = () => {
        const component = this;
        const {
            navigation
        } = component.props;

        navigation.navigate(`policy`);
    }
    render () {
        const component = this;

        return ([
            <HeaderScreen
                key = 'header-screen'
                ref = {(componentRef) => {
                    component.headerScreenRef = componentRef;
                }}
                label = 'About'
            >
                <FlatButton
                    room = 'content-left'
                    overlay = 'transparent'
                    onPress = { component.onPressGoBackButton }
                >
                    <IconImage
                        room = 'content-middle'
                        source = 'back'
                    />
                </FlatButton>
            </HeaderScreen>,
            <BodyScreen
                key = 'body-screen'
                contentTopRoomAlignment = 'stretch'
                contentMiddleRoomAlignment = 'stretch'
                contentBottomRoomAlignment = 'stretch'
                color = { Theme.color.palette.blueGrey }
                margin = {{
                    bottom: 50
                }}
            >
                <RowLayout
                    room = 'content-top'
                    overlay = 'opaque'
                    roomAlignment = 'stretch'
                    contentTopRoomAlignment = 'stretch'
                    contentMiddleRoomAlignment = 'center'
                    contentBottomRoomAlignment = 'stretch'
                    margin = {{
                        top: 100,
                        bottom: 5
                    }}
                >
                    <AreaButton
                        room = 'content-top'
                        onPress = { component.onPressGoToAboutProjectViridaButton }
                        margin = {{
                            horizontal: 5
                        }}
                    >
                        <SubtitleText room = 'content-left' exclusions = {[ `size` ]} size = 'small' > About Project Virida </SubtitleText>
                        <FlatButton
                            room = 'content-right'
                            overlay = 'transparent'
                            onPress = { component.onPressGoToAboutProjectViridaButton }
                        >
                            <IconImage
                                room = 'content-middle'
                                source = 'forward'
                                size = 'large'
                            />
                        </FlatButton>
                    </AreaButton>
                    <AreaButton
                        room = 'content-top'
                        onPress = { component.onPressGoToAboutYEAButton }
                        margin = {{
                            horizontal: 5
                        }}
                    >
                        <ColumnLayout room = 'content-left' roomAlignment = 'center' >
                            <SubtitleText room = 'content-left' size = 'small' > About Y.E.A </SubtitleText>
                            <AvatarImage
                                room = 'content-right'
                                size = 'small'
                                source = { require(`../../../../assets/logos/yea-logo.png`) }
                            />
                        </ColumnLayout>
                        <FlatButton
                            room = 'content-right'
                            overlay = 'transparent'
                            onPress = { component.onPressGoToAboutYEAButton }
                        >
                            <IconImage
                                room = 'content-middle'
                                source = 'forward'
                                size = 'large'
                            />
                        </FlatButton>
                    </AreaButton>
                    <AreaButton
                        room = 'content-top'
                        onPress = { component.onPressGoToAboutAirNowButton }
                        margin = {{
                            horizontal: 5
                        }}
                    >
                        <SubtitleText room = 'content-left' exclusions = {[ `size` ]} size = 'small' > About AirNow </SubtitleText>
                        <FlatButton
                            room = 'content-right'
                            overlay = 'transparent'
                            onPress = { component.onPressGoToAboutAirNowButton }
                        >
                            <IconImage
                                room = 'content-middle'
                                source = 'forward'
                                size = 'large'
                            />
                        </FlatButton>
                    </AreaButton>
                    <AreaButton
                        room = 'content-top'
                        onPress = { component.onPressGoToAboutAQICNButton }
                        margin = {{
                            horizontal: 5
                        }}
                    >
                        <SubtitleText room = 'content-left' exclusions = {[ `size` ]} size = 'small' > About AQICN </SubtitleText>
                        <FlatButton
                            room = 'content-right'
                            overlay = 'transparent'
                            onPress = { component.onPressGoToAboutAQICNButton }
                        >
                            <IconImage
                                room = 'content-middle'
                                source = 'forward'
                                size = 'large'
                            />
                        </FlatButton>
                    </AreaButton>
                </RowLayout>
                <RowLayout
                    room = 'content-middle'
                    overlay = 'opaque'
                    roomAlignment = 'stretch'
                    contentTopRoomAlignment = 'center'
                    contentMiddleRoomAlignment = 'center'
                    contentBottomRoomAlignment = 'stretch'
                    padding = {{
                        top: 10
                    }}
                    margin = {{
                        vertical: 5
                    }}
                >
                    <InfoText room = 'content-top' > Please Like Us On Facebook </InfoText>
                    <FBLikeWebView room = 'content-top' />
                    <InfoText room = 'content-top' > Or Check Us Out On Facebook Or Instagram </InfoText>
                    <ColumnLayout
                        room = 'content-top'
                        roomAlignment = 'center'
                        contentLeftRoomAlignment = 'center'
                        contentRightRoomAlignment = 'center'
                    >
                        <FlatButton
                            room = 'content-left'
                            overlay = 'transparent'
                            size = 'large'
                            onPress = { component.onPressGoToYEAFBButton }
                        >
                            <CoverImage
                                room = 'content-middle'
                                width = { 36 }
                                height = { 36 }
                                source = { require(`../../../../assets/logos/fb-logo.png`) }
                            />
                        </FlatButton>
                        <FlatButton
                            room = 'content-right'
                            overlay = 'transparent'
                            size = 'large'
                            onPress = { component.onPressGoToAboutYEAInstagramButton }
                        >
                            <CoverImage
                                room = 'content-middle'
                                width = { 36 }
                                height = { 36 }
                                source = { require(`../../../../assets/logos/instagram-logo.png`) }
                            />
                        </FlatButton>
                    </ColumnLayout>
                    <FlatButton
                        room = 'content-bottom'
                        label = 'DONATE TO Y.E.A'
                        color = { Theme.color.palette.pink }
                        margin = {{
                            bottom: 10,
                            horizontal: 5
                        }}
                        onPress = { component.onPressDonateToYEAButton }
                    />
                </RowLayout>
                <RowLayout
                    room = 'content-bottom'
                    overlay = 'opaque'
                    roomAlignment = 'stretch'
                    contentTopRoomAlignment = 'stretch'
                    margin = {{
                        vertical: 5
                    }}
                >
                    <AreaButton
                        room = 'content-top'
                        onPress = { component.onPressGoToPolicyButton }
                        margin = {{
                            horizontal: 5
                        }}
                    >
                        <SubtitleText room = 'content-left' exclusions = {[ `size` ]} size = 'small' > Privacy Policy </SubtitleText>
                        <FlatButton
                            room = 'content-right'
                            overlay = 'transparent'
                            onPress = { component.onPressGoToPolicyButton }
                        >
                            <IconImage
                                room = 'content-middle'
                                source = 'forward'
                                size = 'large'
                            />
                        </FlatButton>
                    </AreaButton>
                </RowLayout>
                <RowLayout
                    room = 'content-bottom'
                    overlay = 'opaque'
                    roomAlignment = 'stretch'
                    contentTopRoomAlignment = 'stretch'
                    margin = {{
                        vertical: 5
                    }}
                >
                    <ColumnLayout
                        room = 'content-top'
                        roomAlignment = 'stretch'
                        contentLeftRoomAlignment = 'start'
                        contentRightRoomAlignment = 'end'
                        margin = {{
                            horizontal: 5,
                            vertical: 5
                        }}
                    >
                        <SubtitleText room = 'content-left' size = 'small' > Version </SubtitleText>
                        <InfoText room = 'content-right' >{ ` v${CONSTANT.VERSION}.${CONSTANT.CODE_PUSH_BUILD} ` }</InfoText>
                    </ColumnLayout>
                </RowLayout>
            </BodyScreen>
        ]);
    }
}
