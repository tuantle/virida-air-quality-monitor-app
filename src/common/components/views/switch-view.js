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
 * @module SwitchView
 * @description - Virida client-native app switch view component.
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

import Theme from '../../theme';

const {
    Component
} = React;

const {
    Switch
} = ReactNative;

const {
    RowLayout,
    ColumnLayout,
    SubtitleText,
    InfoText
} = Ht;

export default class SwitchView extends Component {
    static propTypes = {
        initialValue: PropTypes.bool,
        title: PropTypes.string,
        info: PropTypes.string,
        marginTop: PropTypes.number,
        marginBottom: PropTypes.number,
        onToggle: PropTypes.func
    }
    static defaultProps = {
        initialValue: false,
        title: ``,
        info: ``,
        marginTop: 5,
        marginBottom: 5,
        onToggle: () => null
    }
    // static getDerivedStateFromProps (props) {
    //     return {
    //         value: props.initialValue
    //     };
    // }
    constructor (props) {
        super(props);

        this.state = {
            value: props.initialValue
        };
    }
    value = () => {
        const component = this;
        const {
            value
        } = component.state;
        return value;
    };
    onValueChange = () => {
        const component = this;
        const {
            onToggle
        } = component.props;
        component.setState((prevState) => {
            return {
                value: !prevState.value
            };
        }, () => {
            onToggle();
        });
    }
    render () {
        const component = this;
        const {
            title,
            info,
            marginTop,
            marginBottom
        } = component.props;
        const {
            value
        } = component.state;
        return (
            <RowLayout
                overlay = 'opaque'
                contentTopRoomAlignment = 'stretch'
                contentBottomRoomAlignment = 'stretch'
                margin = {{
                    top: marginTop,
                    bottom: marginBottom
                }}
            >
                <ColumnLayout
                    room = 'content-top'
                    roomAlignment = 'stretch'
                    contentLeftRoomAlignment = 'center'
                    contentRightRoomAlignment = 'center'
                    margin = {{
                        top: 10,
                        horizontal: 5
                    }}
                >
                    <SubtitleText room = 'content-left' size = 'small' >{ title }</SubtitleText>
                    <Switch
                        room = 'content-right'
                        value = { value }
                        trackColor = {{
                            true: Theme.color.palette.teal,
                            false: Theme.color.palette.lightGrey
                        }}
                        onValueChange = { component.onValueChange }
                    />
                </ColumnLayout>
                <RowLayout
                    room = 'content-bottom'
                    contentTopRoomAlignment = 'stretch'
                    margin = {{
                        top: 5,
                        bottom: 10
                    }}
                >
                    <InfoText room = 'content-top' indentation = { 5 }>{ info }</InfoText>
                </RowLayout>
            </RowLayout>
        );
    }
}
