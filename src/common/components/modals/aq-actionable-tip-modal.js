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
 * @module AQActionableTipModal
 * @description - Virida client-native app air quality actionable tip modal component.
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

import CollapsibleView from 'react-native-collapsible';

import Theme from '../../theme';

import CONSTANT from '../../constant';

const {
    Component
} = React;

const {
    Modal
} = ReactNative;

const {
    HeaderScreen,
    BodyScreen,
    RowLayout,
    ColumnLayout,
    AreaButton,
    FlatButton,
    IconImage,
    HeadlineText,
    TitleText,
    InfoText,
    HorizontalDivider
} = Ht;

export default class AQActionableTipModal extends Component {
    static propTypes = {
        visible: PropTypes.bool,
        aqSample: PropTypes.shape({
            aqParam: PropTypes.string,
            aqAlertMessage: PropTypes.string,
            aqAlertIndex: PropTypes.number,
            aqi: PropTypes.number
        }),
        onClose: PropTypes.func
    }
    static defaultProps = {
        visible: false,
        aqSample: {
            aqParam: ``,
            aqAlertMessage: ``,
            aqAlertIndex: 0,
            aqi: 0
        },
        onClose: () => null
    }
    constructor (props) {
        super(props);

        this.healthImpactFlatButtonRef = null;
        this.recommendedActionsFlatButtonRef = null;
        this.state = {
            sectionVisibility: {
                healthImact: false,
                recommendedAction: false
            }
        };
    }
    onToggleHealthImpactSection = () => {
        const component = this;

        if (component.healthImpactFlatButtonRef !== null) {
            const {
                sectionVisibility
            } = component.state;
            let flipTransition;

            if (!sectionVisibility.healthImact) {
                flipTransition = {
                    from: {
                        rotate: `0deg`
                    },
                    to: {
                        rotate: `180deg`
                    },
                    option: {
                        duration: 300
                    }
                };
            } else {
                flipTransition = {
                    from: {
                        rotate: `180deg`
                    },
                    to: {
                        rotate: `0deg`
                    },
                    option: {
                        duration: 300
                    }
                };
            }

            component.healthImpactFlatButtonRef.animate({
                refName: `animated-content-middle-room-view`,
                transitions: [ flipTransition ],
                onAnimationEnd: () => {
                    component.setState((prevState) => {
                        return {
                            sectionVisibility: {
                                healthImact: !prevState.sectionVisibility.healthImact
                            }
                        };
                    });
                }
            });
        }
    }
    onToggleRecommendedActionsSection = () => {
        const component = this;

        if (component.recommendedActionsFlatButtonRef !== null) {
            const {
                sectionVisibility
            } = component.state;
            let flipTransition;

            if (!sectionVisibility.recommendedAction) {
                flipTransition = {
                    from: {
                        rotate: `0deg`
                    },
                    to: {
                        rotate: `180deg`
                    },
                    option: {
                        duration: 300
                    }
                };
            } else {
                flipTransition = {
                    from: {
                        rotate: `180deg`
                    },
                    to: {
                        rotate: `0deg`
                    },
                    option: {
                        duration: 300
                    }
                };
            }

            component.recommendedActionsFlatButtonRef.animate({
                refName: `animated-content-middle-room-view`,
                transitions: [ flipTransition ],
                onAnimationEnd: () => {
                    component.setState((prevState) => {
                        return {
                            sectionVisibility: {
                                recommendedAction: !prevState.sectionVisibility.recommendedAction
                            }
                        };
                    });
                }
            });
        }
    }
    renderSections (aqActionableTip) {
        const component = this;
        const {
            sectionVisibility
        } = component.state;

        return (
            <RowLayout
                room = 'content-bottom'
                roomAlignment = 'stretch'
                contentTopRoomAlignment = 'stretch'
                contentMiddleRoomAlignment = 'stretch'
                contentBottomRoomAlignment = 'stretch'
            >
                <AreaButton
                    room = 'content-top'
                    overlay = 'transparent'
                    onPress = { component.onToggleHealthImpactSection }
                    margin = {{
                        horizontal: 5
                    }}
                >
                    <TitleText
                        room = 'content-left'
                        exclusions = {[ `size` ]}
                        size = 'small'
                        color = { Theme.color.palette.white }
                    > Health Impact </TitleText>
                    <FlatButton
                        ref = {(componentRef) => {
                            component.healthImpactFlatButtonRef = componentRef;
                        }}
                        room = 'content-right'
                        overlay = 'transparent'
                        color = { Theme.color.palette.white }
                        onPress = { component.onToggleHealthImpactSection }
                    >
                        <IconImage
                            room = 'content-middle'
                            source = 'expand'
                            size = 'large'
                        />
                    </FlatButton>
                </AreaButton>
                <CollapsibleView
                    room = 'content-top'
                    collapsed = { !sectionVisibility.healthImact }
                    easing = 'linear'
                    duration = { 150 }
                    style = {{
                        alignItems: `flex-start`,
                        width: CONSTANT.GENERAL.DEVICE_WIDTH,
                        paddingHorizontal: 20,
                        paddingVertical: 10
                    }}
                >
                    <InfoText color = { Theme.color.palette.white } size = 'large' >{ aqActionableTip.healthImpactMessage }</InfoText>
                </CollapsibleView>
                <HorizontalDivider
                    room = 'content-middle'
                    margin = { 0 }
                />
                <AreaButton
                    room = 'content-bottom'
                    overlay = 'transparent'
                    onPress = { component.onToggleRecommendedActionsSection }
                    margin = {{
                        horizontal: 5
                    }}
                >
                    <TitleText
                        room = 'content-left'
                        exclusions = {[ `size` ]}
                        size = 'small'
                        color = { Theme.color.palette.white }
                    > Recommended Actions </TitleText>
                    <FlatButton
                        ref = {(componentRef) => {
                            component.recommendedActionsFlatButtonRef = componentRef;
                        }}
                        room = 'content-right'
                        overlay = 'transparent'
                        color = { Theme.color.palette.white }
                        onPress = { component.onToggleRecommendedActionsSection }
                    >
                        <IconImage
                            room = 'content-middle'
                            source = 'expand'
                            size = 'large'
                        />
                    </FlatButton>
                </AreaButton>
                <CollapsibleView
                    room = 'content-bottom'
                    collapsed = { !sectionVisibility.recommendedAction }
                    easing = 'linear'
                    duration = { 150 }
                    style = {{
                        alignItems: `flex-start`,
                        width: CONSTANT.GENERAL.DEVICE_WIDTH,
                        paddingHorizontal: 20,
                        paddingVertical: 10
                    }}
                >
                    <InfoText color = { Theme.color.palette.white } size = 'large' >{ aqActionableTip.actionableMessage }</InfoText>
                </CollapsibleView>
            </RowLayout>
        );
    }
    render () {
        const component = this;
        const {
            visible,
            aqSample,
            onClose
        } = component.props;
        let aqActionableTip = CONSTANT.AQ_ACTIONABLE_TIPS[aqSample.aqAlertIndex];

        if (aqActionableTip !== null) {
            return (
                <Modal
                    animationType = 'fade'
                    transparent = { false }
                    visible = { visible }
                >
                    <HeaderScreen
                        overlay = 'transparent'
                        label = 'Actionable Tip'
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
                        color = { Theme.color.aqAlerts[aqSample.aqAlertIndex] }
                    >
                        <RowLayout
                            room = 'content-top'
                            roomAlignment = 'center'
                            contentMiddleRoomAlignment = 'center'
                            margin = {{
                                top: 100,
                                bottom: 5,
                                horizontal: 5
                            }}
                        >
                            <HeadlineText
                                room = 'content-middle'
                                color = { Theme.color.palette.white }
                            >{ ` Air Quality is ${aqSample.aqAlertMessage} ` }</HeadlineText>
                        </RowLayout>
                        <ColumnLayout
                            room = 'content-top'
                            roomAlignment = 'center'
                            contentLeftRoomAlignment = 'center'
                            contentRightRoomAlignment = 'center'
                            margin = {{
                                top: 5,
                                horizontal: 5
                            }}
                        >
                            <HeadlineText
                                room = 'content-left'
                                color = { Theme.color.palette.white }
                            > AQI  </HeadlineText>
                            <TitleText
                                room = 'content-right'
                                color = { Theme.color.palette.white }
                            >{ aqSample.aqi }</TitleText>
                        </ColumnLayout>
                        <InfoText
                            room = 'content-top'
                            size = 'large'
                            color = { Theme.color.palette.white }
                        >{ aqActionableTip.pollutantStatus }</InfoText>
                        <HorizontalDivider
                            room = 'content-middle'
                            margin = {{
                                top: 20
                            }}
                        />
                        {
                            component.renderSections(aqActionableTip)
                        }
                    </BodyScreen>
                </Modal>
            );
        }
        return null;
    }
}
