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
 * @description - Virida client native app global constants.
 *
 * @author Tuan Le (tuan.t.lei@gmail.com)
 *
 *------------------------------------------------------------------------
 * @format
 * @flow
 */
'use strict'; // eslint-disable-line

import ReactNative from 'react-native'; // eslint-disable-line

const {
    Dimensions
} = ReactNative;

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const DEVICE_HEIGHT = Dimensions.get(`window`).height;

export default {
    VERSION: `0.1.1`,
    CODE_PUSH_BUILD: `4`,
    FB_APP_ID: 357208711456901,
    APPLE_APP_ID: `1315223443`,
    API_KEY: {
        AIR_NOW: `9C7DF405-67FB-466D-BB2A-4147639E78E4`,
        AQICN: `37663d8604ea4e4b5e290db9f593f7d16c9698d7`
    },
    AQ_ACTIONABLE_TIPS: [{
        pollutantStatus: `Air pollution level is very low or none!`,
        healthImpactMessage: `\tAir quality is considered clean and satisfactory.`,
        actionableMessage: `\tEnjoy the clean air!`
    }, {
        pollutantStatus: `Air pollution level is present, but might not be noticeable!`,
        healthImpactMessage: `\tAir quality is acceptable. However, people who are unusually sensitive to air pollution should be cautious.`,
        actionableMessage: `\tYoung children and people with respiratory diseases, such as asthma, should limit prolonged exposure.`
    }, {
        pollutantStatus: `Air pollution level is clearly noticeable!`,
        healthImpactMessage: `\tEveryone may begin to experience health effects; members of sensitive groups may experience more serious health effects.`,
        actionableMessage: `\tYoung children and people with respiratory diseases, such as asthma, should avoid prolonged exposure.`
    }, {
        pollutantStatus: `Air pollution level is high!`,
        healthImpactMessage: `\tEveryone will experience serious health effects!`,
        actionableMessage: `\tYoung children people with respiratory diseases, such as asthma, should avoid all exposure.`
    }, {
        pollutantStatus: `Air pollution level is very high!`,
        healthImpactMessage: `\tHealth warnings of emergency conditions!!! Everyone will be adversely affected.`,
        actionableMessage: `\tEveryone should avoid exposure to the polluted air!!!`
    }],
    AQ_INFO: {
        PM25: {
            whatis: `\tParticulate matter 2.5 or PM2.5, refers to tiny dust, smog, or smoke particles in the air that are 2.5 microns or less in diameter.\n\tThe diameters of the larger particles in the PM2.5 size range would be about thirty times smaller than that of a human hair.\n\tThe smaller particles are so small that several thousand of them could fit on the period at the end of this sentence.`,
            healthImpact: `\tParticles in the PM2.5 size range are able to travel deeply into the respiratory tract, reaching the lungs. Exposure to PM2.5 particles can cause short-term health effects such as eye, nose, throat & lung irritation, coughing, sneezing, runny nose, and shortness of breath.\n\tScientific studies have linked increases in daily PM2.5 exposure with increased respiratory and cardiovascular hospital admissions, emergency department visits and deaths.\n\tStudies also suggest that long term exposure to PM2.5 particulate matter may be associated with increased rates of chronic bronchitis, reduced lung function and increased mortality from lung cancer and heart disease.`,
            source: `\tThere are outdoor and indoor sources of PM2.5 pollution. Outside, PM2.5 pollution primarily come from car, truck, bus and off-road vehicle (e.g., construction equipment, snowmobile, locomotive) exhausts, other operations that involve the burning of fuels such as wood, heating oil or coal and natural sources such as forest fires.\n\tPM2.5 is also produced by common indoor activities. Some indoor sources of PM2.5 pollution are tobacco smoke, cooking (e.g., frying, sautéing, and broiling), burning candles or oil lamps, and operating fireplaces and fuel-burning space heaters (e.g., kerosene heaters).`,
            environmentalDamage: `\tParticles can be carried over long distances by wind and then settle on ground or water. Depending on their chemical composition, the effects of this settling may include:\n\t- Making lakes and streams acidic\n\t- Depleting the nutrients in soil\n\t- Damaging sensitive forests and farm crops\n\t- Affecting the diversity of ecosystems\n\t- Contributing to acid rain effects\n\t- Altering the nutrient balance in coastal waters and river basins`
        },
        PM10: {
            whatis: `\t`,
            healthImpact: `\t`,
            source: `\t`,
            environmentalDamage: `\t`
        },
        CO: {
            whatis: `\tCO is a colorless, odorless gas that can be harmful when inhaled in large amounts. CO is released when something is burned. The greatest sources of CO to outdoor air are cars, trucks and other vehicles or machinery that burn fossil fuels. A variety of items in your home such as unvented kerosene and gas space heaters, leaking chimneys and furnaces, and gas stoves also release CO and can affect air quality indoors.`,
            healthImpact: `\tBreathing air with a high concentration of CO reduces the amount of oxygen that can be transported in the blood stream to critical organs like the heart and brain.\n\tAt very high levels, which are  possible indoors or in other enclosed environments, CO can cause dizziness, confusion, unconsciousness and death.\n\tVery high levels of CO are not likely to occur outdoors. However, when CO levels are elevated outdoors, they can be of particular concern for people with some types of heart disease. These people already have a reduced ability for getting oxygenated blood to their hearts in situations where the heart needs more oxygen than usual. They are especially vulnerable to the effects of CO when exercising or under increased stress. In these situations, short-term exposure to elevated CO may result in reduced oxygen to the heart accompanied by chest pain also known as angina.`,
            source: `\tAn estimated 77% of the anthropogenic CO emissions are from mobile sources, including onroad vehicles (51% of the total) and nonroad engines and vehicles (26% of the total). The remaining CO emissions are from area and point sources, including fuel combustion and industrial processes. In urban areas, mobile sources may contribute relatively more or less than the national average to the mix of emissions.`,
            environmentalDamage: `\tAlthough carbon monoxide is only a weak greenhouse gas, its influence on climate goes beyond its own direct effects. Its presence affects concentrations of other greenhouse gases including methane, tropospheric ozone and carbon dioxide.\n\tCarbon monoxide readily reacts with the hydroxyl radical (OH) forming a much stronger, greenhouse gas--carbon dioxide. This, in turn, increases concentrations of methane, another strong greenhouse gas, because the most common way methane is removed from the atmosphere is when it reacts with OH. So, the formation of carbon dioxide leaves fewer OH for methane to react with,thus increasing methane's concentration. A NASA report indicates that carbon monoxide is responsible for a 13% reduction in hydroxyl concentrations and through other reactions, a 9% drop in sulfate concentrations. Sulfates are credited for offsetting some of the global warming due to greenhouse gases by reflecting incident solar radiation back to space.`
        },
        NO2: {
            whatis: `\tNitrogen Dioxide (NO2) is one of a group of highly reactive gases known as oxides of nitrogen or nitrogen oxides (NOx). Other nitrogen oxides include nitrous acid and nitric acid. NO2 is used as the indicator for the larger group of nitrogen oxides.`,
            healthImpact: `\tBreathing air with a high concentration of NO2 can irritate airways in the human respiratory system. Such exposures over short periods can aggravate respiratory diseases, particularly asthma, leading to respiratory symptoms (such as coughing, wheezing or difficulty breathing), hospital admissions and visits to emergency rooms. Longer exposures to elevated concentrations of NO2 may contribute to the development of asthma and potentially increase susceptibility to respiratory infections. People with asthma, as well as children and the elderly are generally at greater risk for the health effects of NO2.\n\tNO2 along with other NOx reacts with other chemicals in the air to form both particulate matter and ozone. Both of these are also harmful when inhaled due to effects on the respiratory system.`,
            source: `\tNO2 primarily gets in the air from the burning of fuel. NO2 forms from emissions from cars, trucks and buses, power plants, and off-road equipment.`,
            environmentalDamage: `\tNO2 and other NOx interact with water, oxygen and other chemicals in the atmosphere to form acid rain. Acid rain harms sensitive ecosystems such as lakes and forests.\n\tThe nitrate particles that result from NOx make the air hazy and difficult to see though. This affects the many national parks that we visit for the view.\n\tNOx in the atmosphere contributes to nutrient pollution in coastal waters.`
        },
        O3: {
            whatis: `\tTropospheric, or ground level ozone, is not emitted directly into the air, but is created by chemical reactions between oxides of nitrogen (NOx) and volatile organic compounds (VOC). This happens when pollutants emitted by cars, power plants, industrial boilers, refineries, chemical plants, and other sources chemically react in the presence of sunlight. Ozone at ground level is a harmful air pollutant, because of its effects on people and the environment, and it is the main ingredient in “smog." Learn more about air emission sources.\n\tOzone is most likely to reach unhealthy levels on hot sunny days in urban environments, but can still reach high levels during colder months. Ozone can also be transported long distances by wind, so even rural areas can experience high ozone levels. `,
            healthImpact: `\tOzone in the air we breathe can harm our health. People most at risk from breathing air containing ozone include people with asthma, children, older adults, and people who are active outdoors, especially outdoor workers. In addition, people with certain genetic characteristics, and people with reduced intake of certain nutrients, such as vitamins C and E, are at greater risk from ozone exposure.\n\tBreathing ozone can trigger a variety of health problems including chest pain, coughing, throat irritation, and airway inflammation. It also can reduce lung function and harm lung tissue. Ozone can worsen bronchitis, emphysema, and asthma, leading to increased medical care.`,
            source: `\tSources ozone pollutants are mainly emitted by cars, power plants, industrial boilers, refineries, chemical plants, and other sources chemically react in the presence of sunlight.`,
            environmentalDamage: `\tOzone affects sensitive vegetation and ecosystems, including forests, parks, wildlife refuges and wilderness areas.  In particular, ozone harms sensitive vegetation during the growing season.`
        },
        SO2: {
            whatis: `\tEPA’s national ambient air quality standards for SO2 are designed to protect against exposure to the entire group of sulfur oxides (SOx). SO2 is the component of greatest concern and is used as the indicator for the larger group of gaseous sulfur oxides (SOx). Other gaseous SOx (such as SO3) are found in the atmosphere at concentrations much lower than SO2.\n\tControl measures that reduce SO2 can generally be expected to reduce people’s exposures to all gaseous SOx. This may have the important co-benefit of reducing the formation of particulate SOx such as fine sulfate particles.\n\tEmissions that lead to high concentrations of SO2 generally also lead to the formation of other SOx. The largest sources of SO2 emissions are from fossil fuel combustion at power plants andother industrial facilities. `,
            healthImpact: `\tShort-term exposures to SO2 can harm the human respiratory system and make breathing difficult. Children, the elderly, and those who suffer from asthma are particularly sensitive to effects of SO2.\n\tSO2 emissions that lead to high concentrations of SO2 in the air generally also lead to the formation of other sulfur oxides (SOx). SOx can react with other compounds in the atmosphere to form PM2.5 pollution.`,
            source: `\tThe largest source of SO2 in the atmosphere is the burning of fossil fuels by power plants and other industrial facilities. Smaller sources of SO2 emissions include: industrial processes such as extracting metal from ore; natural sources such as volcanoes; and locomotives, ships and other vehicles and heavy equipment that burn fuel with a high sulfur content.`,
            environmentalDamage: `\tAt high concentrations, gaseous SOx can harm trees and plants by damaging foliage and decreasing growth.\n\tSO2 and other sulfur oxides can contribute to acid rain which can harm sensitive ecosystems.`
        },
        VOC: {
            whatis: `\t`,
            healthImpact: `\t`,
            source: `\t`,
            environmentalDamage: `\t`
        }
    },
    AQR: {
        SEARCH_RADIUS_MILE: 15,
        BBOX_DELTA_PADDING: 0.65,
        SITE_COUNT_LIMIT: 100
    },
    GENERAL: {
        DEVICE_WIDTH,
        DEVICE_HEIGHT,
        PERIODIC_REFRESH_INTERVAL_MS: 3600000,
        BACKGROUND_HEARTBEAT_INTERVAL_M: 15,
        STARTUP_DELAY_MS: 250,
        LOADING_WEBVIEW_DELAY_MS: 1000
    },
    NOTIFICATION: {
        DAILY_AQ_ALERT_TIME: `8:00:00am`
    },
    HTTP: {
        AQICN_API_REQUEST_DELAY_MS: 250,
        AIR_NOW_API_REQUEST_DELAY_MS: 250,
        API_REQUEST_TIMEOUT_MS: 15000,
        CODE: {
            OK: 200,
            CREATED: 201,
            NO_CONTENT: 204,
            UNAUTHORIZED: 401,
            NOT_FOUND: 404,
            CONFLICTED: 409,
            ERROR: 500,
            BAD_GATEWAY_ERROR: 502
        }
    },
    MAP: {
        LATITUDE_DELTA: 0.125,
        LONGITUDE_DELTA: 0.125 * (DEVICE_WIDTH / DEVICE_HEIGHT),
        MIN_ZOOM_LEVEL: 11,
        MAX_ZOOM_LEVEL: 14,
        READY_DELAY_MS: 1000,
        MARKER_TRACKING_DELAY_MS: 500,
        MARKER_CLUSTERING: {
            ENABLED: false,
            BBOX_DELTA_PADDING: 0.125,
            RADIUS_PIXEL: 45,
            EXTENT: 512,
            NODE_SIZE: 64
        }
    },
    URL: {
        AQICN_GET_AQR_SITE_DATA_API: `https://api.waqi.info/map/bounds/`,
        AQICN_GET_AQR_FEED_DATA_API: `https://api.waqi.info/feed/`,
        AIR_NOW_GET_AQR_SITE_DATA_API: `http://www.airnowapi.org/aq/data/`,
        AIR_NOW_GET_AQR_FEED_DATA_API: `http://www.airnowapi.org/aq/observation/latLong/current/`,
        AIR_NOW_GET_AQR_FORECAST_DATA_API: `http://www.airnowapi.org/aq/forecast/latLong/`,

        AIR_NOW_ABOUT: `https://airnow.gov/`,
        AQICN_ABOUT: `http://aqicn.org/`,
        YEA_FB1: `https://www.facebook.com/n/?Earth247/`,
        YEA_FB2: `https://www.facebook.com/Earth247/`,
        YEA_INSTAGRAM: `https://www.instagram.com/yeawareness/`,
        YEA_ABOUT: `https://www.yeawareness.org/our-org/`,
        YEA_CONTACT: `https://www.yeawareness.org/contact/`,
        YEA_DONATION: `https://www.yeawareness.org/donate-1/`,
        YEA_PROJECT_VIRIDA: `https://www.yeawareness.org/air-quality-sensor/`
    }
};
