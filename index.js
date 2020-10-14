/**
 * @format
 */
import React, {Component} from "react";
import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import spec from "./specs/spec";
import {Tester, TestHookStore } from "cavy";

const testHookStore = new TestHookStore();

class AppWrapper extends Component {
    render () {
        return (
            <Tester specs = {[spec]} store = {testHookStore} waitTime = {10000} startDelay = {3000}>
                <App />
            </Tester> 
        );
    }
}
AppRegistry.registerComponent(appName, () => AppWrapper);
