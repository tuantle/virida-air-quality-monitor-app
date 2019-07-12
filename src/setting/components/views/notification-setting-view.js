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
 * @module NotificationSettingView
 * @description - Virida client-native app notification setting view component.
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

import SwitchView from '../../../common/components/views/switch-view';

import Theme from '../../../common/theme';

import CONSTANT from '../../../common/constant';

const {
    Component
} = React;

const {
    HeaderScreen,
    BodyScreen,
    FlatButton,
    IconImage
} = Ht;

export default class NotificationSettingView extends Component {
    static propTypes = {
        navigation: PropTypes.object,
        // mapTheme: PropTypes.oneOf([ `lite`, `flat`, `retro` ]),
        notification: PropTypes.shape({
            unhealthyAQAlert: PropTypes.bool,
            dailyAQAlert: PropTypes.bool
        }),
        onChange: PropTypes.func
    }
    static defaultProps = {
        navigation: {},
        // mapTheme: `lite`,
        notification: {
            unhealthyAQAlert: true,
            dailyAQAlert: true
        },
        onChange: () => null
    }
    constructor (props) {
        super(props);

        this.headerScreenRef = null;
        this.dailyAQAlertSwitchViewRef = null;
        this.unhealthyAQAlertSwitchViewRef = null;
    }
    onPressGoBackButton = () => {
        const component = this;
        const {
            navigation,
            // mapTheme,
            notification,
            onChange
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
                onAnimationBegin: () => {
                    if (component.unhealthyAQAlertSwitchViewRef !== null && component.dailyAQAlertSwitchViewRef !== null) {
                        onChange({
                            notification: {
                                unhealthyAQAlert: notification.unhealthyAQAlert !== component.unhealthyAQAlertSwitchViewRef.value() ? component.unhealthyAQAlertSwitchViewRef.value() : null,
                                dailyAQAlert: notification.dailyAQAlert !== component.dailyAQAlertSwitchViewRef.value() ? component.dailyAQAlertSwitchViewRef.value() : null
                            }
                        });
                    }
                },
                onAnimationEnd: () => {
                    navigation.goBack();
                }
            });
        }
    }
    render () {
        const component = this;
        const {
            // mapTheme,
            notification
        } = component.props;
        return ([
            <HeaderScreen
                key = 'header-screen'
                ref = {(componentRef) => {
                    component.headerScreenRef = componentRef;
                }}
                label = 'Notification Settings'
            >
                <FlatButton
                    room = 'content-left'
                    overlay = 'transparent'
                    onPress = { component.onPressGoBackButton }
                >
                    <IconImage room = 'content-middle' source = 'back' />
                </FlatButton>
            </HeaderScreen>,
            <BodyScreen
                key = 'body-screen'
                contentTopRoomAlignment = 'stretch'
                contentMiddleRoomAlignment = 'stretch'
                contentBottomRoomAlignment = 'stretch'
                color = { Theme.color.palette.blueGrey }
            >
                <SwitchView
                    room = 'content-top'
                    ref = {(componentRef) => {
                        component.dailyAQAlertSwitchViewRef = componentRef;
                    }}
                    initialValue = { notification.dailyAQAlert }
                    title = 'Daily Air Quality Level Alert'
                    info = 'Occasionally notify air quality level in morning'
                    marginTop = { 100 }
                />
                <SwitchView
                    room = 'content-middle'
                    ref = {(componentRef) => {
                        component.unhealthyAQAlertSwitchViewRef = componentRef;
                    }}
                    initialValue = { notification.unhealthyAQAlert }
                    title = 'Unhealthy Air Quality Level Alert'
                    info = 'Notify unhealthy air quality level when AQI > 100 while in motion or AQI > 150 while stationary'
                />
            </BodyScreen>
        ]);
    }
}
