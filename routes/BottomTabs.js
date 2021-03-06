// Author: Phuoc Hoang Minh Nguyen
// Description: Application BottomTabNavigator with 5 options,
//  each option is a "Stack" in "routes" folder, except the last one,
//  which will open a drawer navigation.
// Status: Optimized

import React from "react";
import { createStackNavigator } from "react-navigation-stack"
import { createBottomTabNavigator } from "react-navigation-tabs"

import Ionicons from "react-native-vector-icons/Ionicons";
import Material from "react-native-vector-icons/MaterialCommunityIcons";

import HomeStack from "./HomeStack"
import CalendarStack from "./CalendarStack"
import MedicineStack from "./MedicineStack"
import DoctorStack from "./DoctorStack"
import {TouchableOpacity} from "react-native";

import {hook, wrap} from "cavy";

BottomTabs = createStackNavigator(
    {
        default: createBottomTabNavigator(
            {
                Home: {
                    screen: HomeStack,
                    navigationOptions: {
                        tabBarIcon: ({ tintColor }) => (
                            <Ionicons name="ios-home" size={24} color={tintColor} />
                        ),
                        tabBarOnPress: ({ defaultHandler }) => defaultHandler()
                    },
                },
                Calendar: {
                    screen: CalendarStack,
                    navigationOptions: {
                        tabBarIcon: ({ tintColor }) => (
                            <Ionicons 
                            name="ios-calendar" size={24} color={tintColor} />
                        ),
                        tabBarOnPress: ({ defaultHandler }) => defaultHandler()                
                    },
                },
                Medicine: {
                    screen: MedicineStack,
                    navigationOptions: {
                        tabBarIcon: ({ tintColor }) => (
                            <Material name="pill" size={24} color={tintColor} />
                        ),
                        tabBarOnPress: ({ defaultHandler }) => defaultHandler()
                    },
                },
                Doctor: {
                    screen: DoctorStack,
                    navigationOptions: {
                        tabBarIcon: ({ tintColor }) => (
                            <Material name="doctor" size={24} color={tintColor} />
                        ),
                        tabBarOnPress: ({ defaultHandler }) => defaultHandler()
                    },
                },
                Profile: {
                    screen: HomeStack,
                    navigationOptions: {
                        tabBarIcon: ({ tintColor }) => (
                            <Ionicons name="reorder-three" size={24} color={tintColor} />
                        ),
                        tabBarOnPress: ({ navigation }) => { navigation.openDrawer() }
                    },
                },
            },
            {
                tabBarOptions: {
                    activeTintColor: "#161F3D",
                    inactiveTintColor: "#B8BBC4",
                    showLabel: false,
                },
            }
        ),
    },
    {
        mode: "modal",
        headerMode: "none",
    }
);

export default hook(BottomTabs);