// Author: Phuoc Hoang Minh Nguyen
// Description: Register Screen
// Status: Need to verify email

import React from "react"
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Image,
  ImageBackground,
  ScrollView
} from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import ImagePicker from "react-native-image-picker"
import firestore from "@react-native-firebase/firestore"
import storage from "@react-native-firebase/storage"
import auth from "@react-native-firebase/auth"
import UserPermissions from "../../utilities/UserPermissions"
import Toast from "react-native-simple-toast"
import {hook, wrap} from "cavy"

class RegisterScreen extends React.Component {
  state = {
    user: {
      name: "",
      email: "",
      password: "",
      phoneNumber: "",
      avatar: null
    },
    errorMessage: null,
    showPassword: false,
    toggleCheckBox: false,
  }

  handlePassword = () => {
    this.setState({ showPassword: !this.state.showPassword })
  }

  handleSignUp = () => {
    const { name, email, password, phoneNumber } = this.state.user
    if (name.trim == "") {
      Toast.show("Please Enter Full Name", Toast.LONG)
    } else if (email.trim == "") {
      Toast.show("Please Enter Email Information", Toast.LONG)
    } else if (password == "") {
      Toast.show("Please Enter A Password", Toast.LONG)
    } else if (phoneNumber == "") {
      Toast.show("Please Enter Contact Number", Toast.LONG)
    } 
      else {
      this.createUser(this.state.user)
    }
  };

  createUser = async user => {
    let remoteUri = null
    try {
      await auth().createUserWithEmailAndPassword(user.email.trim(), user.password)
        .catch(error => this.setState({ errorMessage: error.message }))

      await auth().currentUser.sendEmailVerification()

      // If there is no error.
      if (this.state.errorMessage == null) {
        let db = firestore().collection("users").doc((auth().currentUser || {}).uid)

        db.set({
          name: user.name.trim(),
          email: user.email.trim(),
          phoneNumber: user.phoneNumber,
          avatar: null,
          doctorList: null,
          pharmacistList: null
        })

        // If the user choose an avatar,
        if (user.avatar) {
          // Store the avatar in Firebase Storage
          remoteUri = await this.uploadPhotoAsync(
            user.avatar,
            `users/${(auth().currentUser || {}).uid}`
          );
          // Then Store the avatar in Cloud Firestore
          db.set({ avatar: remoteUri }, { merge: true })
        }
      }
    } catch (error) {
      alert("Error: ", error.toString())
    }
  };

  uploadPhotoAsync = (uri, filename) => {
    return new Promise(async (res, rej) => {
      const response = await fetch(uri)
      const file = await response.blob()

      let upload = storage().ref(filename).put(file);

      upload.on("state_changed", snapshot => { },
        err => { rej(err) },
        async () => {
          const url = await upload.snapshot.ref.getDownloadURL()
          res(url);
        }
      )
    })
  }

  handlePickAvatar = async () => {
    UserPermissions.getPhotoPermission()

    var options = {
      title: "Select Image",
      storageOptions: {
        skipBackup: true,
        path: "images"
      }
    };

    let result = await ImagePicker.showImagePicker(options, (response) => {
      console.log("Response = ", response)

      if (response.didCancel) {
        console.log("User cancelled image picker")
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error)
      } else {
        const source = response.uri
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          user: { ...this.state.user, avatar: source }
        })
      }
    })
  }

  render() {
    const showPass = <Ionicons name="ios-eye" size={24} />
    const hidePass = <Ionicons name="ios-eye-off" size={24} />
    const TextInputTest = wrap(TextInput);
    const TouchableTest = wrap(TouchableOpacity);
    let message;
    if (this.state.showPassword == false) {
      message = hidePass
    } else {
      message = showPass
    }
    return (
      <View style={styles.container}>
        <TouchableTest
          style={styles.back}
          onPress={() => this.props.navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={32} color="#FFF" />
          <StatusBar barStyle="light-content" />
        </TouchableTest>
        <StatusBar barStyle="light-content" />
        <View style={{ alignItems: "center", width: "100%" }} >
          <Text style={styles.greeting}>
            {"Hello!\nSign up to get started."}
          </Text>
          <TouchableOpacity style={styles.avatarPlaceholder}
            onPress={this.handlePickAvatar}>
            <Image source={{ uri: this.state.user.avatar }}
              style={styles.avatar} />
            <Ionicons
              name="ios-add"
              size={40}
              color="#FFF"
              style={{ marginTop: 6, marginLeft: 2 }}
            />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={styles.errorMessage}>
            {this.state.errorMessage && (
              <Text style={styles.error}>{this.state.errorMessage}</Text>
            )}
          </View>

          <View style={styles.form}>
            <View>
              <Text style={styles.inputTitle}>Full Name</Text>
              <TextInputTest
                ref = {this.props.generateTestHook('Register.Name')}
                style={styles.input}
                onChangeText={name =>
                  this.setState({ user: { ...this.state.user, name } })
                }
                value={this.state.user.name}
              />
            </View>

            <View style={{ marginTop: 16 }}>
              <Text style={styles.inputTitle}>Email Address</Text>
              <TextInputTest
                ref = {this.props.generateTestHook('Register.Email')}
                style={styles.input}
                autoCapitalize="none"
                onChangeText={email =>
                  this.setState({ user: { ...this.state.user, email } })
                }
                value={this.state.user.email}
              />
            </View>

            <View style={{ marginTop: 16 }}>
              <Text style={styles.inputTitle}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInputTest
                  ref = {this.props.generateTestHook('Register.Password')}
                  style={styles.password}
                  secureTextEntry={!this.state.showPassword}
                  autoCapitalize="none"
                  onChangeText={password =>
                    this.setState({ user: { ...this.state.user, password } })
                  }
                  value={this.state.user.password}
                />
                <TouchableTest onPress={this.handlePassword}>
                  {message}
                </TouchableTest>
              </View>
            </View>

            <View style={{ marginTop: 16 }}>
              <Text style={styles.inputTitle}>Contact Number</Text>
              <TextInputTest
                ref = {this.props.generateTestHook('Register.ContactNumber')}
                style={styles.input}
                keyboardType="numeric"
                onChangeText={phoneNumber =>
                  this.setState({ user: { ...this.state.user, phoneNumber } })
                }
                value={this.state.user.phoneNumber}
              />
            </View>
          </View>

          <TouchableTest 
          ref = {this.props.generateTestHook('Register.SignUp')}
          style={styles.button} onPress={this.handleSignUp}>
            <Text style={{ color: "#FFF", fontWeight: "500" }}>Sign up</Text>
          </TouchableTest>

          <TouchableTest
            ref = {this.props.generateTestHook('Register.ReturnToSignIn')}
            style={{ alignSelf: "center", marginTop: 12 }}
            onPress={() => this.props.navigation.navigate("LoginScreen")}
          >
            <Text style={{ color: "#414959", fontSize: 13 }}>
              Already have an account?
            <Text style={{ fontWeight: "500", color: "#018ABE" }}> Sign in</Text>
            </Text>
          </TouchableTest>
        </ScrollView>
        <ImageBackground
          style={[styles.fixed, styles.containter, { zIndex: -1 }]}
          source={require("../../assets/registerBackground.png")}
        />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  containter: {
    width: Dimensions.get("window").width, //for full screen
    height: Dimensions.get("window").height //for full screen
  },
  fixed: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  container: {
    flex: 1
  },
  greeting: {
    marginTop: 32,
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    color: "#FFF"
  },
  form: {
    marginHorizontal: 30
  },
  inputTitle: {
    color: "#8A8F9E",
    fontSize: 10,
    textTransform: "uppercase"
  },
  input: {
    borderBottomColor: "#8A8F9E",
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 40,
    fontSize: 15,
    color: "#161F3D"
  },
  password: {
    height: 40,
    fontSize: 15,
    color: "#161F3D",
    flex: 1
  },
  passwordContainer: {
    flexDirection: "row",
    borderBottomColor: "#8A8F9E",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    backgroundColor: "#1565C0",
    borderRadius: 4,
    marginHorizontal: 30
  },
  errorMessage: {
    marginTop: 36,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 30,
    marginBottom: 15
  },
  error: {
    color: "#E9446A",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center"
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
    justifyContent: "center"
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: "#E1E2E6",
    borderRadius: 50,
    marginTop: 24,
    justifyContent: "center",
    alignItems: "center"
  },
  avatar: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50
  },
  termsOfServicesContainer: {
    marginVertical: 12,
    marginHorizontal: 30,
    flexDirection: "row",
    alignItems: "center",
  },
  termsOfServices: {
    textDecorationLine: "underline"
  }
})

export default hook(RegisterScreen);