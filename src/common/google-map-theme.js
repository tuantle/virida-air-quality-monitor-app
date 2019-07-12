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
  * @description -  Virida client-native app google map theme.
  *
  * @author Tuan Le (tuan.t.lei@gmail.com)
  *
  *------------------------------------------------------------------------
  * @format
  * @flow
  */
'use strict'; // eslint-disable-line

const lite = [{
    featureType: `landscape`,
    stylers: [{
        hue: `#FFBB00`
    },
    {
        saturation: 43.400000000000006
    },
    {
        lightness: 37.599999999999994
    },
    {
        gamma: 1
    }]
},
{
    featureType: `road.highway`,
    stylers: [{
        hue: `#FFC200`
    },
    {
        saturation: -61.8
    },
    {
        lightness: 45.599999999999994
    },
    {
        gamma: 1
    }]
},
{
    featureType: `road.arterial`,
    stylers: [{
        hue: `#FF0300`
    },
    {
        saturation: -100
    },
    {
        lightness: 51.19999999999999
    },
    {
        gamma: 1
    }]
},
{
    featureType: `road.local`,
    stylers: [{
        hue: `#FF0300`
    },
    {
        saturation: -100
    },
    {
        lightness: 52
    },
    {
        gamma: 1
    }]
},
{
    featureType: `water`,
    stylers: [{
        hue: `#0078FF`
    },
    {
        saturation: -13.200000000000003
    },
    {
        lightness: 2.4000000000000057
    },
    {
        gamma: 1
    }]
},
{
    featureType: `poi`,
    stylers: [{
        hue: `#00FF6A`
    },
    {
        saturation: -1.0989010989011234
    },
    {
        lightness: 11.200000000000017
    },
    {
        gamma: 1
    }]
}];

const flat = [{
    featureType: `water`,
    elementType: `all`,
    stylers: [{
        hue: `#7fc8ed`
    },
    {
        saturation: 55
    },
    {
        lightness: -6
    },
    {
        visibility: `on`
    }]
},
{
    featureType: `water`,
    elementType: `labels`,
    stylers: [{
        hue: `#7fc8ed`
    },
    {
        saturation: 55
    },
    {
        lightness: -6
    },
    {
        visibility: `off`
    }]
},
{
    featureType: `poi.park`,
    elementType: `geometry`,
    stylers: [{
        hue: `#83cead`
    },
    {
        saturation: 1
    },
    {
        lightness: -15
    },
    {
        visibility: `on`
    }]
},
{
    featureType: `landscape`,
    elementType: `geometry`,
    stylers: [{
        hue: `#f3f4f4`
    },
    {
        saturation: -84
    },
    {
        lightness: 59
    },
    {
        visibility: `on`
    }]
},
{
    featureType: `landscape`,
    elementType: `labels`,
    stylers: [{
        hue: `#ffffff`
    },
    {
        saturation: -100
    },
    {
        lightness: 100
    },
    {
        visibility: `off`
    }]
},
{
    featureType: `road`,
    elementType: `geometry`,
    stylers: [{
        hue: `#ffffff`
    },
    {
        saturation: -100
    },
    {
        lightness: 100
    },
    {
        visibility: `on`
    }]
},
{
    featureType: `road`,
    elementType: `labels`,
    stylers: [{
        hue: `#bbbbbb`
    },
    {
        saturation: -100
    },
    {
        lightness: 26
    },
    {
        visibility: `on`
    }]
},
{
    featureType: `road.arterial`,
    elementType: `geometry`,
    stylers: [{
        hue: `#ffcc00`
    },
    {
        saturation: 100
    },
    {
        lightness: -35
    },
    {
        visibility: `simplified`
    }]
},
{
    featureType: `road.highway`,
    elementType: `geometry`,
    stylers: [{
        hue: `#ffcc00`
    },
    {
        saturation: 100
    },
    {
        lightness: -22
    },
    {
        visibility: `on`
    }]
},
{
    featureType: `poi.school`,
    elementType: `all`,
    stylers: [{
        hue: `#d7e4e4`
    },
    {
        saturation: -60
    },
    {
        lightness: 23
    },
    {
        visibility: `on`
    }]
}];

const retro = [{
    elementType: `geometry`,
    stylers: [{
        color: `#ebe3cd`
    }]
}, {
    elementType: `labels.text.fill`,
    stylers: [{
        color: `#523735`
    }]
}, {
    elementType: `labels.text.stroke`,
    stylers: [{
        color: `#f5f1e6`
    }]
}, {
    featureType: `administrative`,
    elementType: `geometry.stroke`,
    stylers: [{
        color: `#c9b2a6`
    }]
}, {
    featureType: `administrative.land_parcel`,
    elementType: `geometry.stroke`,
    stylers: [{
        color: `#dcd2be`
    }]
}, {
    featureType: `administrative.land_parcel`,
    elementType: `labels.text.fill`,
    stylers: [{
        color: `#ae9e90`
    }]
}, {
    featureType: `landscape.natural`,
    elementType: `geometry`,
    stylers: [{
        color: `#dfd2ae`
    }]
}, {
    featureType: `poi`,
    elementType: `geometry`,
    stylers: [{
        color: `#dfd2ae`
    }]
}, {
    featureType: `poi`,
    elementType: `labels.text.fill`,
    stylers: [{
        color: `#93817c`
    }]
}, {
    featureType: `poi.park`,
    elementType: `geometry.fill`,
    stylers: [{
        color: `#a5b076`
    }]
}, {
    featureType: `poi.park`,
    elementType: `labels.text.fill`,
    stylers: [{
        color: `#447530`
    }]
}, {
    featureType: `road`,
    elementType: `geometry`,
    stylers: [{
        color: `#f5f1e6`
    }]
}, {
    featureType: `road.arterial`,
    elementType: `geometry`,
    stylers: [{
        color: `#fdfcf8`
    }]
}, {
    featureType: `road.highway`,
    elementType: `geometry`,
    stylers: [{
        color: `#f8c967`
    }]
}, {
    featureType: `road.highway`,
    elementType: `geometry.stroke`,
    stylers: [{
        color: `#e9bc62`
    }]
}, {
    featureType: `road.highway.controlled_access`,
    elementType: `geometry`,
    stylers: [{
        color: `#e98d58`
    }]
}, {
    featureType: `road.highway.controlled_access`,
    elementType: `geometry.stroke`,
    stylers: [{
        color: `#db8555`
    }]
}, {
    featureType: `road.local`,
    elementType: `labels.text.fill`,
    stylers: [{
        color: `#806b63`
    }]
}, {
    featureType: `transit.line`,
    elementType: `geometry`,
    stylers: [{
        color: `#dfd2ae`
    }]
}, {
    featureType: `transit.line`,
    elementType: `labels.text.fill`,
    stylers: [{
        color: `#8f7d77`
    }]
}, {
    featureType: `transit.line`,
    elementType: `labels.text.stroke`,
    stylers: [{
        color: `#ebe3cd`
    }]
}, {
    featureType: `transit.station`,
    elementType: `geometry`,
    stylers: [{
        color: `#dfd2ae`
    }]
}, {
    featureType: `water`,
    elementType: `geometry.fill`,
    stylers: [{
        color: `#b9d3c2`
    }]
}, {
    featureType: `water`,
    elementType: `labels.text.fill`,
    stylers: [{
        color: `#92998d`
    }]
}];

export default {
    lite,
    flat,
    retro
};
