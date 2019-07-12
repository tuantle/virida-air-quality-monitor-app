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
 * @module AQForecastDisscussionModal
 * @description - Virida client-native app air quality forecast discussion modal component.
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
    HeaderScreen,
    BodyScreen,
    RowLayout,
    FlatButton,
    IconImage,
    InfoText
} = Ht;

const AQForecastDisscussionModal = (props) => {
    const {
        visible,
        message,
        onClose
    } = props;

    return (
        <Modal
            animationType = 'fade'
            transparent = { false }
            visible = { visible }
        >
            <HeaderScreen
                overlay = 'transparent'
                label = 'Air Quality Forecast Discussion'
            >
                <FlatButton
                    room = 'content-left'
                    overlay = 'transparent'
                    onPress = { onClose }
                >
                    <IconImage
                        room = 'content-middle'
                        source = 'close'
                    />
                </FlatButton>
            </HeaderScreen>
            <BodyScreen
                overlay = 'translucent'
                contentTopRoomAlignment = 'center'
                contentMiddleRoomAlignment = 'stretch'
                contentBottomRoomAlignment = 'center'
                color = { Theme.color.palette.teal }
            >
                <RowLayout
                    room = 'content-top'
                    roomAlignment = 'center'
                    contentMiddleRoomAlignment = 'center'
                    margin = {{
                        top: 100,
                        bottom: 5,
                        horizontal: 20
                    }}
                >
                    <InfoText
                        room = 'content-middle'
                        size = 'large'
                        color = { Theme.color.palette.white }
                    >{ message }</InfoText>
                </RowLayout>
            </BodyScreen>
        </Modal>
    );
};

AQForecastDisscussionModal.propTypes = {
    visible: PropTypes.bool,
    message: PropTypes.string,
    onClose: PropTypes.func
};

AQForecastDisscussionModal.defaultProps = {
    visible: false,
    message: ``,
    onClose: () => null
};

export default AQForecastDisscussionModal;
