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
 * @module PolicyView
 * @description - Virida client-native app policy view component.
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
    FlatButton,
    IconImage,
    SubtitleText,
    InfoText,
    HorizontalDivider
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
    onPressGoToYEAContactButton = () => {
        Linking.openURL(CONSTANT.URL.YEA_CONTACT).catch(() => {
            Hf.log(`warn1`, `Unable to open Y.E.A contact link at ${CONSTANT.URL.YEA_CONTACT}.`);
        });
    }
    render () {
        const component = this;

        return ([
            <HeaderScreen
                key = 'header-screen'
                ref = {(componentRef) => {
                    component.headerScreenRef = componentRef;
                }}
                label = 'Privacy Policy'
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
                contentTopRoomAlignment = 'start'
                contentMiddleRoomAlignment = 'start'
                contentBottomRoomAlignment = 'start'
                scrollable = { true }
                margin = {{
                    bottom: 50
                }}
                // onScroll = {(scrollEvent) => {
                //     if (component.headerScreenRef !== null) {
                //         if (scrollEvent.direction === -1 && component.headerScreenRef.isNavigationVisible()) {
                //             component.headerScreenRef.hideNavigation();
                //         }
                //         if (scrollEvent.direction === 1 && !component.headerScreenRef.isNavigationVisible()) {
                //             component.headerScreenRef.showNavigation();
                //         }
                //     }
                // }}
            >
                <RowLayout
                    room = 'content-top'
                    contentTopRoomAlignment = 'center'
                    contentMiddleRoomAlignment = 'start'
                    margin = {{
                        top: 100,
                        horizontal: 5
                    }}
                >
                    <SubtitleText room = 'content-top' size = 'small' > Privacy Policy </SubtitleText>
                    <InfoText
                        room = 'content-middle'
                        alignment = 'left'
                        indentation = { 5 }
                    >   Y.E.A built the Viria app as a Free app. This SERVICE is provided by Y.E.A at no cost and is intended for use as is.
                    This page is used to inform website visitors regarding our policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Service.
                    If you choose to use our Service, then you agree to the collection and use of information in relation to this policy. The Personal Information that we collect is used for providing and improving the Service.
                    We will not use or share your information with anyone except as described in this Privacy Policy.
                    The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which is accessible at Virida unless otherwise defined in this Privacy Policy. </InfoText>
                </RowLayout>
                <HorizontalDivider room = 'content-middle' />
                <RowLayout
                    room = 'content-middle'
                    contentTopRoomAlignment = 'center'
                    contentMiddleRoomAlignment = 'start'
                    margin = {{
                        horizontal: 5
                    }}
                >
                    <SubtitleText room = 'content-top' size = 'small' > Determining and Sharing Location </SubtitleText>
                    <InfoText
                        room = 'content-middle'
                        alignment = 'left'
                        indentation = { 5 }
                    >   Some features and functionality in Virida app may require that you provide your location.
                    Virida app may use your location data to make request to airnow.gov and aqicn.org and retrieve air quality data in your region for display. </InfoText>
                </RowLayout>
                <HorizontalDivider room = 'content-middle' />
                <RowLayout
                    room = 'content-middle'
                    contentTopRoomAlignment = 'center'
                    contentMiddleRoomAlignment = 'start'
                    margin = {{
                        horizontal: 5
                    }}
                >
                    <SubtitleText room = 'content-top' size = 'small' > Changes to This Privacy Policy </SubtitleText>
                    <InfoText
                        room = 'content-middle'
                        alignment = 'left'
                        indentation = { 5 }
                    >   We may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes.
                    We will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately after they are posted on this page. </InfoText>
                </RowLayout>
                <HorizontalDivider room = 'content-bottom' />
                <RowLayout
                    room = 'content-bottom'
                    contentTopRoomAlignment = 'center'
                    contentMiddleRoomAlignment = 'start'
                    contentBottomRoomAlignment = 'center'
                    margin = {{
                        horizontal: 5
                    }}
                >
                    <SubtitleText room = 'content-top' size = 'small' > Contact Us </SubtitleText>
                    <InfoText
                        room = 'content-middle'
                        alignment = 'left'
                        indentation = { 5 }
                    >   If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us. </InfoText>
                    <FlatButton
                        room = 'content-bottom'
                        overlay = 'transparent'
                        label = 'CONTACT Y.E.A'
                        onPress = { component.onPressGoToYEAContactButton }
                    />
                </RowLayout>
            </BodyScreen>
        ]);
    }
}
