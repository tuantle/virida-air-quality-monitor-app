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
 * @module AQWhatisModal
 * @description - Virida client-native app air quality whatis modal component.
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
    CoverImage,
    HeadlineText,
    TitleText,
    InfoText,
    HorizontalDivider,
    VerticalDivider
} = Ht;

export default class AQWhatisModal extends Component {
    static propTypes = {
        visible: PropTypes.bool,
        aqSample: PropTypes.shape({
            aqParam: PropTypes.string,
            aqAlertIndex: PropTypes.number,
            aqi: PropTypes.number,
            aqConcentration: PropTypes.number,
            aqUnit: PropTypes.string,
            aqParamColor: PropTypes.string
        }),
        onClose: PropTypes.func
    }
    static defaultProps = {
        visible: false,
        aqSample: {
            aqParam: ``,
            aqAlertIndex: 0,
            aqi: 0,
            aqConcentration: 0,
            aqUnit: ``,
            aqParamColor: Theme.color.palette.white
        },
        onClose: () => null
    }
    constructor (props) {
        super(props);

        this.whatisFlatButtonRef = null;
        this.sourceOfEmissionFlatButtonRef = null;
        this.healthImpactSectionFlatButtonRef = null;
        this.environmentalDamageFlatButtonRef = null;
        this.state = {
            sectionVisibility: {
                whatis: false,
                healthImact: false,
                sourceOfEmission: false,
                environmentalDamage: false
            }
        };
    }
    onToggleWhatisSection = () => {
        const component = this;

        if (component.whatisFlatButtonRef !== null) {
            const {
                sectionVisibility
            } = component.state;
            let flipTransition;

            if (!sectionVisibility.whatis) {
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

            component.whatisFlatButtonRef.animate({
                refName: `animated-content-middle-room-view`,
                transitions: [ flipTransition ],
                onAnimationEnd: () => {
                    component.setState((prevState) => {
                        return {
                            sectionVisibility: {
                                whatis: !prevState.sectionVisibility.whatis
                            }
                        };
                    });
                }
            });
        }
    }
    onToggleSourceOfEmissionSection = () => {
        const component = this;

        if (component.sourceOfEmissionFlatButtonRef !== null) {
            const {
                sectionVisibility
            } = component.state;
            let flipTransition;

            if (!sectionVisibility.sourceOfEmission) {
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

            component.sourceOfEmissionFlatButtonRef.animate({
                refName: `animated-content-middle-room-view`,
                transitions: [ flipTransition ],
                onAnimationEnd: () => {
                    component.setState((prevState) => {
                        return {
                            sectionVisibility: {
                                sourceOfEmission: !prevState.sectionVisibility.sourceOfEmission
                            }
                        };
                    });
                }
            });
        }
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
    onToggleEnvironmentalDamageSection = () => {
        const component = this;

        if (component.environmentalDamageFlatButtonRef !== null) {
            const {
                sectionVisibility
            } = component.state;
            let flipTransition;

            if (!sectionVisibility.environmentalDamage) {
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

            component.environmentalDamageFlatButtonRef.animate({
                refName: `animated-content-middle-room-view`,
                transitions: [ flipTransition ],
                onAnimationEnd: () => {
                    component.setState((prevState) => {
                        return {
                            sectionVisibility: {
                                environmentalDamage: !prevState.sectionVisibility.environmentalDamage
                            }
                        };
                    });
                }
            });
        }
    }
    renderSections (aqParamInfo) {
        const component = this;
        const {
            aqSample
        } = component.props;
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
                margin = {{
                    bottom: 120
                }}
            >
                <AreaButton
                    room = 'content-top'
                    overlay = 'transparent'
                    onPress = { component.onToggleWhatisSection }
                    margin = {{
                        horizontal: 5
                    }}
                >
                    <TitleText
                        room = 'content-left'
                        exclusions = {[ `size` ]}
                        size = 'small'
                        color = { Theme.color.palette.white }
                    >{ ` What is ${aqSample.aqParam.toUpperCase()}? ` }</TitleText>
                    <FlatButton
                        ref = {(componentRef) => {
                            component.whatisFlatButtonRef = componentRef;
                        }}
                        room = 'content-right'
                        overlay = 'transparent'
                        color = { Theme.color.palette.white }
                        onPress = { component.onToggleWhatisSection }
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
                    collapsed = { !sectionVisibility.whatis }
                    easing = 'linear'
                    duration = { 150 }
                    style = {{
                        alignItems: `flex-start`,
                        width: CONSTANT.GENERAL.DEVICE_WIDTH,
                        paddingHorizontal: 20,
                        paddingVertical: 10
                    }}
                >
                    <InfoText color = { Theme.color.palette.white } size = 'large' >{ aqParamInfo.whatis }</InfoText>
                    {
                        aqSample.aqParam === `pm25` ? <CoverImage
                            resizeMode = 'cover'
                            source = { require(`../../../../assets/images/pm25-scale-diagram.jpg`) }
                            width = { CONSTANT.GENERAL.DEVICE_WIDTH - 40 }
                            height = { 250 }
                            margin = {{
                                top: 5
                            }}
                        /> : null
                    }
                </CollapsibleView>
                <HorizontalDivider
                    room = 'content-top'
                    margin = { 0 }
                />
                <AreaButton
                    room = 'content-top'
                    overlay = 'transparent'
                    onPress = { component.onToggleSourceOfEmissionSection }
                    margin = {{
                        horizontal: 5
                    }}
                >
                    <TitleText
                        room = 'content-left'
                        exclusions = {[ `size` ]}
                        size = 'small'
                        color = { Theme.color.palette.white }
                    > Sources of Pollution </TitleText>
                    <FlatButton
                        ref = {(componentRef) => {
                            component.sourceOfEmissionFlatButtonRef = componentRef;
                        }}
                        room = 'content-right'
                        overlay = 'transparent'
                        color = { Theme.color.palette.white }
                        onPress = { component.onToggleSourceOfEmissionSection }
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
                    collapsed = { !sectionVisibility.sourceOfEmission }
                    easing = 'linear'
                    duration = { 150 }
                    style = {{
                        alignItems: `flex-start`,
                        width: CONSTANT.GENERAL.DEVICE_WIDTH,
                        paddingHorizontal: 20,
                        paddingVertical: 10
                    }}
                >
                    <InfoText color = { Theme.color.palette.white } size = 'large' >{ aqParamInfo.source }</InfoText>
                </CollapsibleView>
                <HorizontalDivider
                    room = 'content-middle'
                    margin = { 0 }
                />
                <AreaButton
                    room = 'content-bottom'
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
                    > Impacts on Health </TitleText>
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
                    room = 'content-bottom'
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
                    <InfoText color = { Theme.color.palette.white } size = 'large' >{ aqParamInfo.healthImpact }</InfoText>
                    {
                        aqSample.aqParam === `pm25` ? <CoverImage
                            resizeMode = 'cover'
                            source = { require(`../../../../assets/images/pm25-health-impact.jpg`) }
                            width = { CONSTANT.GENERAL.DEVICE_WIDTH - 40 }
                            height = { 350 }
                            margin = {{
                                top: 5
                            }}
                        /> : null
                    }
                </CollapsibleView>
                <HorizontalDivider
                    room = 'content-bottom'
                    margin = { 0 }
                />
                <AreaButton
                    room = 'content-bottom'
                    overlay = 'transparent'
                    onPress = { component.onToggleEnvironmentalDamageSection }
                    margin = {{
                        horizontal: 5
                    }}
                >
                    <TitleText
                        room = 'content-left'
                        exclusions = {[ `size` ]}
                        size = 'small'
                        color = { Theme.color.palette.white }
                    > Impacts on the Environment </TitleText>
                    <FlatButton
                        ref = {(componentRef) => {
                            component.environmentalDamageFlatButtonRef = componentRef;
                        }}
                        room = 'content-right'
                        overlay = 'transparent'
                        color = { Theme.color.palette.white }
                        onPress = { component.onToggleEnvironmentalDamageSection }
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
                    collapsed = { !sectionVisibility.environmentalDamage }
                    easing = 'linear'
                    duration = { 150 }
                    style = {{
                        alignItems: `flex-start`,
                        width: CONSTANT.GENERAL.DEVICE_WIDTH,
                        paddingHorizontal: 20,
                        paddingVertical: 10
                    }}
                >
                    <InfoText color = { Theme.color.palette.white } size = 'large' >{ aqParamInfo.environmentalDamage }</InfoText>
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
        let label = ``;
        let aqParamInfo = {
            whatis: `\t`,
            healthImpact: `\t`,
            source: `\t`,
            environmentalDamage: `\t`
        };

        switch (aqSample.aqParam) { // eslint-disable-line
        case `pm25`:
            label = `Particulate Matter (PM2.5) Info`;
            aqParamInfo = CONSTANT.AQ_INFO.PM25;
            break;
        case `no2`:
            label = `Nitrogen Dioxide (NO2) Info`;
            aqParamInfo = CONSTANT.AQ_INFO.NO2;
            break;
        case `o3`:
            label = `Ozone (O3) Info`;
            aqParamInfo = CONSTANT.AQ_INFO.O3;
            break;
        case `co`:
            label = `Carbon Monoxide (CO) Info`;
            aqParamInfo = CONSTANT.AQ_INFO.CO;
            break;
        case `so2`:
            label = `Sulfur Dioxide (SO2) Info`;
            aqParamInfo = CONSTANT.AQ_INFO.SO2;
            break;
        case `voc`:
            label = `VOC Info`;
            break;
        default:
            break;
        }

        return (
            <Modal
                animationType = 'fade'
                transparent = { false }
                visible = { visible }
            >
                <HeaderScreen
                    overlay = 'transparent'
                    label = { label }
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
                    scrollable = { true }
                    color = { aqSample.aqParamColor }
                    style = {{
                        container: {
                            paddingTop: 100
                        }
                    }}
                >
                    <ColumnLayout
                        room = 'content-top'
                        roomAlignment = 'center'
                        contentLeftRoomAlignment = 'center'
                        contentMiddleRoomAlignment = 'stretch'
                        contentRightRoomAlignment = 'center'
                        margin = {{
                            bottom: 5,
                            horizontal: 5
                        }}
                    >
                        <HeadlineText
                            room = 'content-left'
                            color = { Theme.color.palette.white }
                        > AQI   </HeadlineText>
                        <TitleText
                            room = 'content-left'
                            color = { Theme.color.palette.white }
                        >{ aqSample.aqi }</TitleText>
                        <VerticalDivider
                            room = 'content-middle'
                            margin = {{
                                horizontal: 10
                            }}
                        />
                        <HeadlineText
                            room = 'content-right'
                            color = { Theme.color.palette.white }
                        >{`${ aqSample.aqParam.toUpperCase()}  `}</HeadlineText>
                        <TitleText
                            room = 'content-right'
                            color = { Theme.color.palette.white }
                        >{ aqSample.aqConcentration }</TitleText>
                        <InfoText
                            room = 'content-right'
                            indentation = { 6 }
                            color = { Theme.color.palette.white }
                        >{ aqSample.aqUnit }</InfoText>
                    </ColumnLayout>
                    <HorizontalDivider
                        room = 'content-middle'
                        margin = {{
                            top: 20
                        }}
                    />
                    {
                        component.renderSections(aqParamInfo)
                    }
                </BodyScreen>
            </Modal>
        );
    }
}
