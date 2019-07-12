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
 * @module MiscSettingView
 * @description - Virida client-native app misc setting view component.
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

export default class MiscSettingView extends Component {
    static propTypes = {
        navigation: PropTypes.object,
        showIntro: PropTypes.bool,
        // mapTheme: PropTypes.oneOf([ `lite`, `flat`, `retro` ]),
        onChange: PropTypes.func
    }
    static defaultProps = {
        navigation: {},
        showIntro: true,
        // mapTheme: `lite`,
        onChange: () => null
    }
    constructor (props) {
        super(props);

        this.headerScreenRef = null;
        this.showInfoSwitchViewRef = null;
    }
    onPressGoBackButton = () => {
        const component = this;
        const {
            navigation,
            showIntro,
            // mapTheme,
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
                    if (component.showInfoSwitchViewRef !== null) {
                        onChange({
                            showIntro: showIntro !== component.showInfoSwitchViewRef.value() ? component.showInfoSwitchViewRef.value() : null
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
            showIntro
            // mapTheme
        } = component.props;
        return ([
            <HeaderScreen
                key = 'header-screen'
                ref = {(componentRef) => {
                    component.headerScreenRef = componentRef;
                }}
                label = 'Misc Settings'
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
                        component.showInfoSwitchViewRef = componentRef;
                    }}
                    initialValue = { showIntro }
                    title = 'Show Intro'
                    info = 'Always show the introduction slides during startup'
                    marginTop = { 100 }
                />
            </BodyScreen>
        ]);
    }
}
