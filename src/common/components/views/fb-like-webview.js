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
 * @module FBLikeWebView
 * @description - Virida client-native app facebook like webview component.
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

import NetInfo from '@react-native-community/netinfo';

import { WebView } from 'react-native-webview';

import Theme from '../../theme';

import CONSTANT from '../../constant';

const {
    Component
} = React;

const {
    Linking,
    View
} = ReactNative;

const {
    TitleText
} = Ht;

export default class FBLikeWebView extends Component {
    constructor (props) {
        super(props);
        this.webViewRef = null;
        this.state = {
            disabled: false,
            shouldShowWebView: false
        };
    }
    onShouldStartLoadWithRequest = (navigator) => {
        const component = this;
        if (navigator.url.includes(`about:blank`) ||
            navigator.url.includes(`https://www.facebook.com/plugins/like`) ||
            navigator.url.includes(`http://staticxx.facebook.com/connect`)) {
            return true;
        } else if (navigator.url.includes(`https://www.facebook.com/plugins/error`)) {
            Linking.openURL(navigator.url).catch(() => {
                Hf.log(`warn1`, `Unable to open Facebook website at ${navigator.url}.`);
            });
            if (component.webViewRef !== null) {
                component.webViewRef.stopLoading();
            }
            return false;
        }
        return true;
    }
    componentDidMount () {
        const component = this;

        NetInfo.isConnected.fetch().then((online) => {
            if (online) {
                component.setState(() => {
                    return {
                        disabled: false
                    };
                });
            } else {
                component.setState(() => {
                    return {
                        disabled: true
                    };
                });
            }
        });
        setTimeout(() => {
            component.setState(() => {
                return {
                    shouldShowWebView: true
                };
            });
        }, CONSTANT.GENERAL.LOADING_WEBVIEW_DELAY_MS);
    }
    render () {
        const component = this;
        const {
            disabled,
            shouldShowWebView
        } = component.state;

        if (disabled) {
            return (
                <View
                    style = {{
                        flexDirection: `column`,
                        justifyContent: `center`,
                        alignItems: `center`,
                        width: 105,
                        height: 36,
                        margin: 5,
                        borderRadius: 3,
                        // shadowColor: `#000000`,
                        // shadowRadius: 2,
                        // shadowOpacity: 0.3,
                        // shadowOffset: {
                        //     width: 0,
                        //     height: 1
                        // },
                        backgroundColor: Theme.color.light.disabled
                    }}
                >
                    <TitleText
                        size = 'small'
                        color = { Theme.color.palette.white }
                    > Like </TitleText>
                </View>
            );
        }
        return (
            <View
                style = {{
                    width: 105,
                    height: 44,
                    margin: 5
                    // shadowColor: `#000000`,
                    // shadowRadius: 2,
                    // shadowOpacity: 0.3,
                    // shadowOffset: {
                    //     width: 0,
                    //     height: 1
                    // }
                }}
            >
                {
                    shouldShowWebView ? <WebView
                        ref = {(componentRef) => {
                            component.webViewRef = componentRef;
                        }}
                        contentInset = {{
                            left: 0
                        }}
                        scalesPageToFit = { false }
                        useWebKit = { false }
                        automaticallyAdjustContentInsets = { true }
                        javaScriptEnabled = { true }
                        scrollEnabled = { false }
                        source = {{
                            html: `
                            <?xml version="1.0" encoding="utf-8"?>
                            <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                            <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
                                <head>
                                    <title>CNN</title>
                                    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
                                </head>
                                <body>
                                    <!-- load facebook SDK -->
                                    <div id="fb-root"></div>
                                    <script>(function(d, s, id) {
                                        var js, fjs = d.getElementsByTagName(s)[0];
                                        if (d.getElementById(id)) return;
                                        js = d.createElement(s); js.id = id;
                                        js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.12&appId=${CONSTANT.FB_APP_ID}';
                                        fjs.parentNode.insertBefore(js, fjs);
                                    }(document, 'script', 'facebook-jssdk'));</script>
                                    <!-- like button code -->
                                    <div
                                        class="fb-like"
                                        data-href="${CONSTANT.URL.YEA_FB2}"
                                        data-width="100"
                                        data-height="48"
                                        data-layout="button_count"
                                        data-action="like"
                                        data-size="large"
                                        data-show-faces="false"
                                        data-share="false">
                                    </div>
                                </body>
                            </html>
                            `
                        }}
                        style = {{
                            backgroundColor: `transparent`
                        }}
                        onShouldStartLoadWithRequest = { component.onShouldStartLoadWithRequest }
                        onNavigationStateChange = { component.onShouldStartLoadWithRequest }
                    /> : null
                }
            </View>
        );
    }
}
