import React from "react";
import {Button} from "react-native-elements";
import axios from "axios";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Image,
    Alert,
    ActivityIndicator,

} from "react-native";
import ValidationComponent from "react-native-form-validator";

import AsyncStorage from '@react-native-community/async-storage';
import HomeScreen from './Home'


export default class LoginScreen extends ValidationComponent {
    _isMounted = false;

    state = {
        isLoading: false,
        username: "Paisodsod",
        password: "password",
    };

    constructor(props) {
        super(props);
    }

    _storeTokenData = async (value) => {
        try {
            await AsyncStorage.setItem('@storage_TokenKey', value)

      } catch (e) {
          // saving error
      }
  }
  _storeUserData = async (value) => {
      try {
          const jsonValue = JSON.stringify(value)
          await AsyncStorage.setItem('@storage_UserData', jsonValue)
      } catch (e) {
          // saving error
      }
  }
  _getUserData = async () => {
      try {
          const jsonValue = await AsyncStorage.getItem('@storage_UserData')
          return jsonValue != null ? JSON.parse(jsonValue) : null;
      } catch (e) {
          // error reading value
          return null


      }
  }

  _getTokenData = async () => {
      try {
          const value = await AsyncStorage.getItem('@storage_TokenKey')
          if (value !== null) {
              // value previously stored
              // await this._getUserFromToken()
              return value
          }
      } catch (e) {
          // error reading value
      }
  }
  _getUserFromToken = async () => {
      this.setState({isLoading: true});
      let token = await this._getTokenData()
      await axios
          .get(` `, {
              headers: {
                  Authorization: `Token ${token}`
              }
          })
          .then((response) => {
              this.setState({isLoading: false});
              this._storeUserData(response.data)
              return response.data;
          })
          .catch((error) => {
              console.log('error get user', error)
              this.setState({isLoading: false});
              Alert.alert(
                  "Load Data Failure",
                  "Unable to log in with provided credentials.",
                  [
                      {
                          text: "OK",
                          onPress: () => {
                              this.setState({username: ""});
                              this.setState({password: ""});
                          },
                      },
                  ]
              );
              return null;
          });


  }

  async componentDidMount() {
      this._isMounted = true
      let token = await this._getTokenData();
      if (token) {
          await this._getUserFromToken()
          let user = await this._getUserData()
          if (user) {
              this.props.navigation.replace("Template");
          }
      }


  }

  componentWillUnmount() {
      this._isMounted = false;
  }


  _onPressButton = async () => {
      const isValid = this.validate({
          username: {required: true},
          password: {required: true},
      });
      if (isValid) {
          await this._getToken();
      } else {
          Alert.alert("Login Failure", this.getErrorMessages(), [
              {
                  text: "OK",
                  onPress: () => {
                    'HomeScreen'
                  },
              },
          ]);
      }
  };


  _getToken = async () => {
      this.setState({isLoading: true});
      await axios
          .post(``, {
              username: this.state.username,
              password: this.state.password,
          }, {
              headers: {
                  Authorization: null
              }
          })
          .then((response) => {
              this.setState({isLoading: false});
              this._storeTokenData(response.data.key)
              this._getUserFromToken()
              console.log("token", token);
              return response.data;
          })
          .catch((error) => {
              this.setState({isLoading: false});
              Alert.alert(
                  "Login Failure",
                  "Unable to log in with provided credentials.",
                  [
                      {
                          text: "OK",
                          onPress: () => {
                              this.setState({username: ""});
                              this.setState({password: ""});
                          },
                      },
                  ]
              );
              return null;
          });
  } 
  render() {
    if (this.state.isLoading) {
        return (
            <View style={styles.view_bg}>
                <ActivityIndicator size="large" color="white"/>
            </View>
        );
    } else {
        return (
            <View style={styles.view_bg}>
                <View >
                    <Image style={styles.logo} source={require("../assets/ex1.png")}/>
                    <Text style={styles.text_logo}>PaisadboyT_T</Text>
                </View>
                <View style={styles.input_view}>
                    <TextInput
                        value={this.state.username}
                        placeholder="username"
                        style={styles.text_input}
                        onChangeText={(text) => {
                            this.setState({username: text});
                        }}
                    />
                    <TextInput
                        value={this.state.password}
                        placeholder="password"
                        style={styles.text_input}
                        secureTextEntry={true}
                        onChangeText={(text) => {
                            this.setState({password: text});
                        }}
                    />
                </View>
                <View style={{width: "50%"}}>
                    <Button
                        onPress={() => {
                          this.props.navigation.replace("Home");
                      }}
                        title="LOGIN"
                        titleStyle={{
                            
                            color: "black",
                        }}
                        containerStyle={{width: "100%"}}
                        buttonStyle={{borderRadius: 30, backgroundColor: "#DECB1C"}}
                    />
                    <Button
                        title="REGISTER"
                        titleStyle={{
                            
                            color: "black",
                        }}
                        onPress={() => {
                            this.props.navigation.replace("Register");
                        }}
                        containerStyle={{width: "100%", marginTop: 10}}
                        buttonStyle={{borderRadius: 30, backgroundColor: "#DECB1C"}}
                    />
                </View>
            </View>
        );
    }
  }
}


  const styles =StyleSheet.create({
    view_bg : {
        backgroundColor : "#304889",
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width : '100%' 
    },
    logo: {
      width: 100,
      height: 120,
      alignSelf:'center',
    },
    logo_view: { 
      display : 'flex',
       flexDirection : 'row',
      alignItems : 'center',
      marginBottom : 100,
      alignSelf:'center',
    },
      text_logo :{
          color: 'white',
          fontFamily: 'Signika',
          fontSize:40
     },
     input_view :{
       width: '70%',
       marginBottom: 50,
     },
    text_input :{
        height: 40, 
        backgroundColor: 'white', 
        borderRadius : 30,
        width :'100%',
        paddingHorizontal : 20,
        marginVertical : 10
      },
      btn:{
        paddingBottom:20,
        backgroundColor:'#68a0cf',
        height: 38,
        borderRadius:10,
        borderColor: '#fff'
      },

});