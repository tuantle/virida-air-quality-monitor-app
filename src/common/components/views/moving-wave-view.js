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
 * @module MovingWaveView
 * @description - Virida client-native app decorative moving wave component.
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

import Svg, { Path } from 'react-native-svg';

import CONSTANT from '../../constant';

const {
    View
} = ReactNative;

const sineCurveSegments = Array.from(Array(20), (x, index) => index * 0.5).map((index) => {
    return {
        x: index * 50,
        y: 0
    };
});

export default class MovingWaveView extends React.Component {
    static propTypes = {
        waves: PropTypes.arrayOf(PropTypes.shape({
            color: PropTypes.string,
            opacity: PropTypes.number,
            lineThickness: PropTypes.number,
            amplitude: PropTypes.number,
            phase: PropTypes.number,
            verticalOffset: PropTypes.number
        }))
    }
    static defaultProps = {
        waves: [{
            color: `white`,
            opacity: 1,
            lineThickness: 3,
            amplitude: 100,
            phase: 0,
            verticalOffset: 120
        }]
    }
    constructor (props) {
        super(props);
        this.intervalId = null;
        this.state = {
            t: Math.random()
        };
    }
    componentDidMount () {
        const component = this;
        component.intervalId = setInterval(() => {
            component.setState((prevState) => {
                return {
                    t: prevState.t + 0.01
                };
            });
        }, 60000);
    }
    componentWillUnmount () {
        const component = this;

        if (component.intervalId !== null) {
            clearInterval(component.intervalId);
        }
    }
    renderWaves () {
        const component = this;
        const {
            waves
        } = component.props;
        const {
            t
        } = component.state;
        const calcSineCurve = function calcSineCurve ({
            amplitude,
            phase,
            verticalOffset
        }) {
            verticalOffset += amplitude;
            return sineCurveSegments.map((segment) => {
                return {
                    x: segment.x,
                    y: amplitude * Math.sin(t + segment.x + phase) + verticalOffset
                };
            }).reduce((sineCurve, segment) => `${sineCurve} L ${segment.x} ${segment.y}`, `M ${0} ${amplitude * Math.sin(phase) + verticalOffset}`);
        };

        return waves.map((wave, index) => {
            return (
                <Path
                    key = { `${index}` }
                    fill = 'none'
                    stroke = { wave.color }
                    strokeWidth = { wave.lineThickness }
                    strokeOpacity = { wave.opacity }
                    strokeMiterlimit = { 10 }
                    d = { calcSineCurve(wave) }
                />
            );
        });
    }
    render () {
        const component = this;
        const {
            waves
        } = component.props;
        const height = 2.25 * Math.max.apply(Math, waves.map((wave) => wave.amplitude)) + Math.max.apply(Math, waves.map((wave) => wave.verticalOffset));

        return (
            <View
                pointerEvents = 'box-only'
                style = {{
                    position: `absolute`,
                    flexDirection: `column`,
                    justifyContent: `center`,
                    alignItems: `center`,
                    width: CONSTANT.GENERAL.DEVICE_WIDTH,
                    height,
                    top: 0,
                    backgroundColor: `transparent`
                }}
            >
                <Svg
                    width = { CONSTANT.GENERAL.DEVICE_WIDTH }
                    height = { height }
                >
                    {
                        component.renderWaves()
                    }
                </Svg>
            </View>
        );
    }
}
