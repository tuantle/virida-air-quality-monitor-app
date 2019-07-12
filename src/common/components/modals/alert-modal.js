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
 * @module AlertModal
 * @description - Virida client-native app air quality alert modal component.
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
    Modal
} = ReactNative;

const {
    BodyScreen,
    RowLayout,
    FlatButton,
    HeadlineText,
    InfoText
} = Ht;

const AlertModal = (props) => {
    const {
        visible,
        alert,
        onClose
    } = props;

    return (
        <Modal
            animationType = 'fade'
            transparent = { true }
            visible = { visible }
        >
            <BodyScreen
                overlay = 'translucent'
                roomAlignment = 'stretch'
                contentMiddleRoomAlignment = 'center'
                color = { Theme.color.palette.black }
            >
                <RowLayout
                    room = 'content-middle'
                    roomAlignment = 'stretch'
                    contentTopRoomAlignment = 'center'
                    contentMiddleRoomAlignment = 'center'
                    contentBottomRoomAlignment = 'stretch'
                    overlay = 'opaque'
                    corner = 'round'
                    padding = { 10 }
                    margin = {{
                        horizontal: 5
                    }}
                >
                    <HeadlineText room = 'content-top' size = 'small' color = { Theme.color.palette.red } >{ alert.title }</HeadlineText>
                    <InfoText room = 'content-middle' >{ alert.message }</InfoText>
                    <FlatButton
                        room = 'content-bottom'
                        label = 'CLOSE'
                        margin = {{
                            top: 20
                        }}
                        onPress = { onClose }
                    />
                </RowLayout>
            </BodyScreen>
        </Modal>
    );
};

AlertModal.propTypes = {
    visible: PropTypes.bool,
    alert: PropTypes.shape({
        title: PropTypes.string,
        message: PropTypes.string
    }),
    onClose: PropTypes.func
};

AlertModal.defaultProps = {
    visible: false,
    alert: {
        title: ``,
        message: ``
    },
    onClose: () => null
};

export default AlertModal;
