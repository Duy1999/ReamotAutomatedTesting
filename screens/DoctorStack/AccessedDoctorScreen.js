// Author: Phuoc Hoang Minh Nguyen
// Description: 
//  - Showing doctor or pharmacist details, who has access to user medical details
//  - Show options to:
//      - Revoke access to user medical details.
//      - Make Appointment (if the chosen one is a doctor, not pharmacist)
// Status: In development

import React from "react"
import { View, Image, Text, StyleSheet, TouchableOpacity, Button } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import Toast from "react-native-simple-toast"
import { ConfirmDialog } from "react-native-simple-dialogs"
import firestore from "@react-native-firebase/firestore"
import auth from "@react-native-firebase/auth"
import {hook, wrap} from "cavy";
class AccessedDoctorScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            doctor: {},
            dialogVisible: false,
            show: false
        }
    }

    componentDidMount() {
        // Take doctor/pharmacist data from DoctorScreen, including avatar, name, and type.
        // => Faster than accessing Cloud Firestore again.
        let paramsFromDoctorScreen = this.props.navigation.state.params
        this.setState({ doctor: paramsFromDoctorScreen })
        // If the item chosen has type == "Doctor", 
        // it will show the make appointment button
        if (paramsFromDoctorScreen.type == "Doctor") {
            this.setState({ show: true })
        }
    }

    // Give doctor/pharmacist access to user's data.
    handleRevokeAccessToDoctor = () => { this.setState({ dialogVisible: true }) }

    // Send user to AppointmentMaker to choose appointment time and reason.
    handleSchedule = () => {
        this.props.navigation.navigate("AppointmentMaker", this.state.doctor)
    }
    handleYes = () => {
        const { doctor } = this.state
        if (doctor.type == "Doctor") {
            firestore().collection("users").doc((auth().currentUser || {}).uid)
                .update({
                    doctorList: firestore.FieldValue.arrayRemove(doctor.email)
                })
        }
        if (doctor.type == "Pharmacist") {
            firestore().collection("users").doc((auth().currentUser || {}).uid)
                .update({
                    pharmacistList: firestore.FieldValue.arrayRemove(doctor.email)
                })
        }
        this.setState({ dialogVisible: false })
        Toast.show("Your request is confirmed !")
        this.props.navigation.goBack()
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.back}
                    onPress={() => this.props.navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={32} color="#FFF" />
                </TouchableOpacity>
                <View style={styles.information}>
                    <Image
                        source={
                            this.state.doctor.avatar
                                ? { uri: this.state.doctor.avatar }
                                : require("../../assets/tempAvatar.jpg")
                        }
                        style={styles.image} />
                    <View style={{ alignItems: "center" }}>
                        <Text style={{ fontSize: 18 }}>{this.state.doctor.name}</Text>
                    </View>
                </View>
                <View style={{ marginVertical: 5 }}>
                    <Button
                        ref = {this.props.generateTestHook('Access.Revoke')}
                        title="Revoke access of medical details"
                        onPress={this.handleRevokeAccessToDoctor, this.handleYes} />
                </View>
                {this.state.show && (
                    <View style={{ marginVertical: 5 }}>
                        <Button
                            title="Schedule An Appointment"
                            onPress={this.handleSchedule} />
                    </View>
                )}
            </View >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#DEE8F1',
    },
    back: {
        position: "absolute",
        top: 24,
        left: 32,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "rgba(21, 22, 48, 0.1)",
        alignItems: "center",
        justifyContent: "center",
    },
    information: {
        backgroundColor: "#FFF",
        borderRadius: 5,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    image: {
        width: 100,
        height: 100
    },
})

export default hook(AccessedDoctorScreen);