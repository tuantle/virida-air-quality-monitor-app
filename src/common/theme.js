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
  * @description -  Virida client-native app ui theme.
  *
  * @author Tuan Le (tuan.t.lei@gmail.com)
  *
  *------------------------------------------------------------------------
  * @format
  * @flow
  */
'use strict'; // eslint-disable-line

import { Hf } from 'hyperflow';

import { Theme as DefaultTheme } from 'hypertoxin';

import iconPreset from './icon-preset';

const Palette = {
    red: `#ee3d3d`,
    deepRed: `#b63939`,
    lightRed: `#fb6c6c`,

    green: `#6cc855`,
    deepGreen: `#30861b`,
    lightGreen: `#9ed65b`,

    blue: `#249bfa`,
    deepBlue: `#0c60a3`,
    lightBlue: `#8ac9fc`,

    purple: `#9c67fb`,
    deepPurple: `#6543b8`,
    lightPurple: `#b793f7`,

    yellow: `#f6e761`,
    deepYellow: `#d8c202`,
    lightYellow: `#fff59e`,

    orange: `#ff9b26`,
    deepOrange: `#d2770c`,
    lightOrange: `#fec47f`,

    cyan: `#53f2f7`,
    teal: `#38d1c3`,
    indigo: `#576eee`,
    pink: `#e8739b`,
    amber: `#fac72f`,

    white: `#fcfcfc`,
    beige: `#edecea`,
    silver: `#ececec`,

    grey: `#8299a3`,
    deepGrey: `#576970`,
    lightGrey: `#b6cdd4`,
    blueGrey: `#e1f4f3`,

    charcoal: `#2d424c`,
    black: `#22333b`
};

const ColorTheme = {
    opacity: `32`,
    aqAlerts: [
        `#8cd75f`,
        `#e3d44a`,
        `#eea426`,
        `#e71b1b`,
        `#ba0c94`,
        `#690721`
    ],
    light: {
        default: Palette.black,
        accent: Palette.red,
        primary: Palette.teal,
        secondary: Palette.deepBlue,
        disabled: Palette.lightGrey
    },
    dark: {
        default: Palette.white,
        accent: Palette.red,
        primary: Palette.teal,
        secondary: Palette.deepBlue,
        disabled: Palette.lightGrey
    },
    palette: Palette
};

const Theme = Hf.merge(DefaultTheme).with({
    name: `virida`,
    icon: iconPreset,
    color: ColorTheme,
    button: {
        flat: {
            corner: `circular`
        },
        raised: {
            corner: `circular`
        },
        color: {
            flat: {
                opacity: ColorTheme.opacity,
                accent: {
                    dark: ColorTheme.dark.accent,
                    light: ColorTheme.light.accent
                },
                primary: {
                    dark: ColorTheme.dark.primary,
                    light: ColorTheme.light.primary
                },
                secondary: {
                    dark: ColorTheme.dark.secondary,
                    light: ColorTheme.light.secondary
                },
                disabled: {
                    dark: ColorTheme.dark.disabled,
                    light: ColorTheme.light.disabled
                },
                label: {
                    dark: ColorTheme.light.default,
                    light: ColorTheme.dark.default
                },
                ripple: {
                    dark: ColorTheme.palette.white,
                    light: ColorTheme.palette.lightGrey
                }
            },
            raised: {
                opacity: ColorTheme.opacity,
                accent: {
                    dark: ColorTheme.dark.accent,
                    light: ColorTheme.light.accent
                },
                primary: {
                    dark: ColorTheme.dark.primary,
                    light: ColorTheme.light.primary
                },
                secondary: {
                    dark: ColorTheme.dark.secondary,
                    light: ColorTheme.light.secondary
                },
                disabled: {
                    dark: ColorTheme.dark.disabled,
                    light: ColorTheme.light.disabled
                },
                label: {
                    dark: ColorTheme.light.default,
                    light: ColorTheme.dark.default
                },
                ripple: {
                    dark: ColorTheme.palette.white,
                    light: ColorTheme.palette.lightGrey
                }
            }
        }
    },
    image: {
        avatar: {
            dropShadowed: false
        },
        icon: {
            dropShadowed: false
        },
        cover: {
            dropShadowed: false
        },
        corner: {
            cover: {
                sharp: 2
            }
        },
        color: {
            avatar: {
                accent: {
                    dark: ColorTheme.dark.accent,
                    light: ColorTheme.light.accent
                },
                primary: {
                    dark: ColorTheme.dark.primary,
                    light: ColorTheme.light.primary
                },
                secondary: {
                    dark: ColorTheme.dark.secondary,
                    light: ColorTheme.light.secondary
                }
            },
            icon: {
                accent: {
                    dark: ColorTheme.dark.accent,
                    light: ColorTheme.light.accent
                },
                primary: {
                    dark: ColorTheme.dark.primary,
                    light: ColorTheme.light.primary
                },
                secondary: {
                    dark: ColorTheme.dark.secondary,
                    light: ColorTheme.light.secondary
                },
                disabled: {
                    dark: ColorTheme.dark.disabled,
                    light: ColorTheme.light.disabled
                }
            }
        }
    },
    text: {
        headline: {
            color: `primary`
        },
        title: {
            color: `primary`
        },
        subtitle: {
            color: `primary`
        },
        info: {
            color: `secondary`
        },
        caption: {
            color: `secondary`
        },
        color: {
            headline: {
                accent: {
                    dark: ColorTheme.dark.accent,
                    light: ColorTheme.light.accent
                },
                primary: {
                    dark: ColorTheme.dark.primary,
                    light: ColorTheme.light.primary
                },
                secondary: {
                    dark: ColorTheme.dark.secondary,
                    light: ColorTheme.light.secondary
                },
                default: {
                    dark: ColorTheme.dark.default,
                    light: ColorTheme.light.default
                }
            },
            title: {
                accent: {
                    dark: ColorTheme.dark.accent,
                    light: ColorTheme.light.accent
                },
                primary: {
                    dark: ColorTheme.dark.primary,
                    light: ColorTheme.light.primary
                },
                secondary: {
                    dark: ColorTheme.dark.secondary,
                    light: ColorTheme.light.secondary
                },
                default: {
                    dark: ColorTheme.dark.default,
                    light: ColorTheme.light.default
                }
            },
            subtitle: {
                accent: {
                    dark: ColorTheme.dark.accent,
                    light: ColorTheme.light.accent
                },
                primary: {
                    dark: ColorTheme.dark.primary,
                    light: ColorTheme.light.primary
                },
                secondary: {
                    dark: ColorTheme.dark.secondary,
                    light: ColorTheme.light.secondary
                },
                default: {
                    dark: ColorTheme.dark.default,
                    light: ColorTheme.light.default
                }
            },
            info: {
                accent: {
                    dark: ColorTheme.dark.accent,
                    light: ColorTheme.light.accent
                },
                primary: {
                    dark: ColorTheme.dark.primary,
                    light: ColorTheme.light.primary
                },
                secondary: {
                    dark: ColorTheme.dark.secondary,
                    light: ColorTheme.light.secondary
                },
                default: {
                    dark: ColorTheme.dark.default,
                    light: ColorTheme.light.default
                }
            },
            caption: {
                accent: {
                    dark: ColorTheme.dark.accent,
                    light: ColorTheme.light.accent
                },
                primary: {
                    dark: ColorTheme.dark.primary,
                    light: ColorTheme.light.primary
                },
                secondary: {
                    dark: ColorTheme.dark.secondary,
                    light: ColorTheme.light.secondary
                },
                default: {
                    dark: ColorTheme.dark.default,
                    light: ColorTheme.light.default
                }
            }
        }
    },
    field: {
        search: {
            overlay: `opaque`,
            corner: `circular`,
            dropShadowed: true
        },
        color: {
            search: {
                input: {
                    dark: ColorTheme.dark.secondary,
                    light: ColorTheme.light.secondary
                }
            }
        }
    },
    screen: {
        header: {
            dropShadowed: false
        },
        color: {
            header: {
                opacity: ColorTheme.opacity,
                status: {
                    dark: ColorTheme.dark.primary,
                    light: ColorTheme.light.primary
                },
                navigation: {
                    dark: ColorTheme.dark.primary,
                    light: ColorTheme.light.primary
                },
                media: {
                    dark: ColorTheme.palette.white,
                    light: ColorTheme.palette.white
                },
                label: {
                    dark: ColorTheme.light.default,
                    light: ColorTheme.dark.default
                }
            }
        }
    }
});

export default Theme;
