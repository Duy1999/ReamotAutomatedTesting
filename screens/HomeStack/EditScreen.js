import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Dimensions
} from 'react-native';
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import ImagePicker from 'react-native-image-picker';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import UserPermissions from "../../utilities/UserPermissions";
import { ScrollView } from 'react-native-gesture-handler';
import {hook, wrap} from "cavy";

class EditScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {
        name: "",
        phoneNumber: "",
        address: ""
      }
    }
  }

  unsubscribe = null

  componentDidMount() {
    const user = this.props.uid || (auth().currentUser || {}).uid

    this.unsubscribe = firestore().collection("users").doc(user)
      .onSnapshot(doc => {
        this.setState({ user: doc.data() });
      })
  }

  componentWillUnmount() {
    this.unsubscribe()
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

  editProfile = () => {
    const { name, phoneNumber, address, avatar } = this.state.user
    const user = this.props.uid || (auth().currentUser || {}).uid
    firestore().collection("users").doc(user).update({
      name: name,
      phoneNumber: phoneNumber,
      address: address,
      avatar: avatar
    })
  }

  render() {
    const TouchableTest = wrap(TouchableOpacity);
    const InputTest = wrap(TextInput);
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Edit Profile</Text>
        <TouchableOpacity style={styles.opacity}
          onPress={this.handlePickAvatar}>
          <Image style={styles.avatar}
            source={
              this.state.user.avatar
                ? { uri: this.state.user.avatar }
                : require("../../assets/tempAvatar.jpg")
            } />
          <MaterialIcons
            name="photo-camera"
            size={35}
            color="black"
            style={styles.icon}
          />
        </TouchableOpacity>
        <ScrollView>
           <Text style={styles.name}>{this.state.user.name}</Text>
          <View style={styles.form}>
            <View>
              <Text style={styles.inputTitle}>Full Name</Text>
              <InputTest 
                ref = {this.props.generateTestHook('EditScreen.name')}
                style={styles.input}
                onChangeText={name =>
                  this.setState({ user: { ...this.state.user, name } })
                }
                value={this.state.user.name}
              />
            </View>

            <View style={{ marginTop: 16 }}>
              <Text style={styles.inputTitle}>Contact Number</Text>
              <InputTest
                ref = {this.props.generateTestHook('EditScreen.contactNumber')}
                style={styles.input}
                keyboardType="numeric"
                onChangeText={phoneNumber =>
                  this.setState({ user: { ...this.state.user, phoneNumber } })
                }
                value={this.state.user.phoneNumber}
              />
            </View>
            <View style={{ marginTop: 16 }}>
              <Text style={styles.inputTitle}>Address</Text>
              <InputTest
                ref = {this.props.generateTestHook('EditScreen.address')}
                style={styles.input}
                onChangeText={address =>
                  this.setState({ user: { ...this.state.user, address } })
                }
                value={this.state.user.address}
              />
            </View>
          </View>
          <TouchableTest 
            ref = {this.props.generateTestHook('EditScreen.saveProfile')}
            onPress={this.editProfile}>
            <View style={styles.button}>
              <Text style={{ color: "#FFF" }}>Save profile</Text>
            </View>
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
  header: {
    alignSelf: "center",
    color: "#FFF",
    fontSize: 20,
    marginTop: 60,
    marginBottom: 40,
  },
  opacity: {
    alignSelf: "flex-start",
    marginLeft: 40,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  name: {
    alignSelf: "flex-end",
    marginEnd: 30,
    marginTop: -30,
    fontSize: 26,
    color: "#000000"
  },
  form: {
    marginHorizontal: 30,
    marginVertical: 24
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
  button: {
    alignSelf: "flex-end",
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    width: 100,
    backgroundColor: "#1565C0",
    borderRadius: 4,
    marginHorizontal: 30,
  },
  icon: {
    position: "absolute",
    top: 110,
    left: 110,
    width: 35,
    height: 35,
    backgroundColor: "white",
    borderRadius: 15,
  },
})

export default hook(EditScreen);