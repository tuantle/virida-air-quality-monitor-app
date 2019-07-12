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
 * @module SettingInterface
 * @description - Virida client-native app setting interface.
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

import { createStackNavigator } from 'react-navigation';

import Rate, { AndroidMarket } from 'react-native-rate';

import NotificationSettingView from '../components/views/notification-setting-view';

import MiscSettingView from '../components/views/misc-setting-view';

import PolicyView from '../components/views/policy-view';

import AboutView from '../components/views/about-view';

import MovingWaveView from '../../common/components/views/moving-wave-view';

import Theme from '../../common/theme';

import CONSTANT from '../../common/constant';

import EVENT from '../events/setting-event';

const {
    BodyScreen,
    RowLayout,
    FlatButton,
    IconImage
} = Ht;

const SettingStackNavigator = createStackNavigator({
    main: {
        screen: ({
            screenProps,
            navigation
        }) => {
            const {
                component
            } = screenProps;
            const {
                status,
                ratingSubmitted
            } = component.state;

            return (
                <BodyScreen
                    coverImageSource = { require(`../../../assets/images/background-gradient.png`) }
                    contentTopRoomAlignment = 'stretch'
                    contentBottomRoomAlignment = 'stretch'
                    color = { Theme.color.aqAlerts[0] }
                >
                    <RowLayout
                        room = 'content-top'
                        contentTopRoomAlignment = 'stretch'
                        contentBottomRoomAlignment = 'stretch'
                        margin = {{
                            top: 100,
                            bottom: 15,
                            horizontal: 5
                        }}
                    >
                        <FlatButton
                            room = 'content-top'
                            label = 'NOTIFICATIONS'
                            onPress = {() => navigation.navigate(`notificationSetting`)}
                        >
                            <IconImage room = 'content-left' source = 'notification'/>
                        </FlatButton>
                        <FlatButton
                            room = 'content-top'
                            label = 'MISC'
                            onPress = {() => navigation.navigate(`miscSetting`)}
                        />
                        <FlatButton
                            room = 'content-top'
                            label = 'ABOUT'
                            onPress = {() => navigation.navigate(`about`)}
                        >
                            <IconImage room = 'content-left' source = 'info'/>
                        </FlatButton>
                        {
                            ratingSubmitted ? null : <FlatButton
                                room = 'content-top'
                                label = 'RATE THIS APP'
                                onPress = { component.onPressSummitRatingButton }
                            >
                                <IconImage room = 'content-left' source = 'favorite'/>
                            </FlatButton>
                        }
                    </RowLayout>
                    {
                        status.active && !status.idle ? <MovingWaveView
                            room = 'content-bottom'
                            waves = {[{
                                color: Theme.color.palette.cyan,
                                opacity: 0.2,
                                lineThickness: 6,
                                amplitude: 50,
                                phase: 45,
                                verticalOffset: 5
                            }, {
                                color: Theme.color.palette.teal,
                                opacity: 0.15,
                                lineThickness: 3,
                                amplitude: 40,
                                phase: 90,
                                verticalOffset: 15
                            }, {
                                color: Theme.color.palette.deepBlue,
                                opacity: 0.1,
                                lineThickness: 10,
                                amplitude: 30,
                                phase: 120,
                                verticalOffset: 20
                            }]}
                        /> : null
                    }
                </BodyScreen>
            );
        },
        navigationOptions: () => {
            return {
                header: {
                    visible: false
                }
            };
        }
    },
    notificationSetting: {
        screen: ({
            screenProps,
            navigation
        }) => {
            const {
                component
            } = screenProps;
            const {
                notification
            } = component.state;

            return (
                <NotificationSettingView
                    navigation = { navigation }
                    // mapTheme = { mapTheme }
                    notification = { notification }
                    onChange = {({
                        notification: _notification
                    }) => {
                        if (_notification.unhealthyAQAlert !== null) {
                            component.outgoing(EVENT.ON.TOGGLE_UNHEALTHY_AQ_ALERT_NOTIFICATION).emit();
                        }
                        if (_notification.dailyAQAlert !== null) {
                            component.outgoing(EVENT.ON.TOGGLE_DAILY_AQ_ALERT_NOTIFICATION).emit();
                        }
                    }}
                />
            );
        },
        navigationOptions: () => {
            return {
                header: {
                    visible: false
                }
            };
        }
    },
    miscSetting: {
        screen: ({
            screenProps,
            navigation
        }) => {
            const {
                component
            } = screenProps;
            const {
                showIntro
                // mapTheme
            } = component.state;

            return (
                <MiscSettingView
                    navigation = { navigation }
                    // mapTheme = { mapTheme }
                    showIntro = { showIntro }
                    onChange = {({
                        showIntro: _showIntro
                    }) => {
                        if (_showIntro !== null) {
                            component.outgoing(EVENT.ON.TOGGLE_SHOW_INTRO).emit();
                        }
                    }}
                />
            );
        },
        navigationOptions: () => {
            return {
                header: {
                    visible: false
                }
            };
        }
    },
    policy: {
        screen: ({
            screenProps, // eslint-disable-line
            navigation
        }) => {
            return (
                <PolicyView navigation = { navigation }/>
            );
        },
        navigationOptions: () => {
            return {
                header: {
                    visible: false
                }
            };
        }
    },
    about: {
        screen: ({
            screenProps, // eslint-disable-line
            navigation
        }) => {
            return (
                <AboutView navigation = { navigation }/>
            );
        },
        navigationOptions: () => {
            return {
                header: {
                    visible: false
                }
            };
        }
    }
}, {
    initialRouteName: `main`,
    mode: `card`,
    headerMode: `none`,
    lazy: true,
    cardStyle: {
        backgroundColor: `transparent`
    }
});

const SettingInterface = Hf.Interface.augment({
    composites: [
        Hf.React.ComponentComposite
    ],
    static: {
        router: SettingStackNavigator.router
    },
    setup (done) {
        done();
    },
    teardown (done) {
        done();
    },
    onPressSummitRatingButton () {
        const component = this;

        Rate.rate({
            AppleAppID: CONSTANT.APPLE_APP_ID,
            preferredAndroidMarket: AndroidMarket.Google,
            preferInApp: true,
            openAppStoreIfInAppFails: true
        }, (success) => {
            component.outgoing(EVENT.ON.SUBMIT_RATING).emit(() => success);
        });
    },
    render () {
        const component = this;
        const {
            navigation
        } = component.props;

        return (
            <SettingStackNavigator
                screenProps = {{
                    component
                }}
                navigation = { navigation }
                onNavigationStateChange = {(prevState, currentState) => {
                    if (currentState.index === 0) {
                        navigation.setParams({
                            tabBarVisible: true
                        });
                    } else {
                        navigation.setParams({
                            tabBarVisible: false
                        });
                    }
                    return null;
                }}
            />
        );
    }
});

export default SettingInterface;
