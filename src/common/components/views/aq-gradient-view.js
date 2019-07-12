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
 * @module AQGradientView
 * @description - Virida client-native app aq gradient view.
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

import Color from 'color';

import Theme from '../../theme';

import CONSTANT from '../../constant';

const {
    Component
} = React;

const {
    Animated
} = ReactNative;

export default class AQGradientView extends Component {
    static propTypes = {
        aqAlertIndex: PropTypes.number
    }
    static defaultProps = {
        aqAlertIndex: 0
    }
    constructor (props) {
        super(props);

        this.state = {
            animatedValue: new Animated.Value(0),
            prevAQAlertColor: Theme.color.aqAlerts[0],
            nextAQAlertColor: Theme.color.aqAlerts[0]
        };
    }
    componentDidMount () {
        const component = this;
        const {
            aqAlertIndex
        } = component.props;

        component.setState((prevState) => {
            return {
                prevAQAlertColor: prevState.nextAQAlertColor,
                nextAQAlertColor: Theme.color.aqAlerts[aqAlertIndex]
            };
        });
    }
    componentDidUpdate () {
        const component = this;
        const {
            animatedValue,
            prevAQAlertColor,
            nextAQAlertColor
        } = component.state;

        if (prevAQAlertColor !== nextAQAlertColor) {
            animatedValue.resetAnimation();
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 5000,
                useNativeDriver: false
            }).start();
        }
    }
    componentWillUnmount () {
        const component = this;
        const {
            animatedValue
        } = component.state;

        animatedValue.removeAllListeners();
    }
    render () {
        const component = this;
        const {
            children
        } = component.props;
        const {
            animatedValue,
            prevAQAlertColor,
            nextAQAlertColor
        } = component.state;
        const interpolatedColor = animatedValue.interpolate({
            inputRange: [ 0, 1 ],
            outputRange: [
                Color(prevAQAlertColor).rgb().string(),
                Color(nextAQAlertColor).rgb().string()
            ]
        });

        return (
            <Animated.View
                style = {{
                    flex: 1,
                    flexDirection: `column`,
                    justifyContent: `flex-start`,
                    alignItems: `flex-start`,
                    width: CONSTANT.GENERAL.DEVICE_WIDTH,
                    height: CONSTANT.GENERAL.DEVICE_HEIGHT,
                    backgroundColor: interpolatedColor
                }}
            >
                {
                    children
                }
            </Animated.View>
        );
    }
}
