import React from "react";
import {Button} from "react-native-elements";
import axios from "axios";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ActivityIndicator,
    Alert,
    FlatList,
    SafeAreaView,
} from "react-native";
import ValidationComponent from "react-native-form-validator";

export default class RegisterScreen  extends ValidationComponent {
  state = {
      isLoading: false,
      username: "",
      email: "",
      password1: "",
      password2: "",
      errors: [],
  };

  constructor(props) {
      super(props);
  }

  _onPressButton = async () => {
      const isValid = this.validate({
          username: {required: true},
          email: {required: true},
          password1: {required: true},
          password2: {required: true},
      });
      if (isValid) {
          await this._getToken();
      } else {
          Alert.alert("Login Failure", this.getErrorMessages(), [
              {
                  text: "OK",
                  onPress: () => {
                  },
              },
          ]);
      }
  };

  get_uuidv4() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (
          c
      ) {
          let r = (Math.random() * 16) | 0,
              v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
      });
  }

  _setError = (error) => {
      let error_list = [];
      for (const [key, value] of Object.entries(error)) {
          value.forEach((element) => {
              error_list.push({
                  id: this.get_uuidv4(),
                  text: `${key} : ${element}`,
              });
          });
          this.setState({errors: error_list});
      }
  };

  _getToken = async () => {
      this.setState({isLoading: true});
      let token = await axios
          .post(``, {
              username: this.state.username,
              email: this.state.email,
              password1: this.state.password1,
              password2: this.state.password2,
          })
          .then((response) => {
              this.setState({isLoading: false});
              return response.data;
          })
          .catch((error) => {
              this.setState({isLoading: false});

              this._setError(error.response.data);
              return null;
          });
      if (token) {
          this.props.navigation.replace("Login");
      }
  };



render() {
  let errorMessage;
  if (this.state.errors.length) {
      errorMessage = (
          <View style={{width: "70%"}}>
              <SafeAreaView style={styles.container_error}>
                  <FlatList
                      data={this.state.errors}
                      renderItem={({item}) => (
                          <Text style={{color: "red"}}>{item.text}</Text>
                      )}
                      keyExtractor={(item) => item.id}
                  />
              </SafeAreaView>
          </View>
      );
  }



  if (this.state.isLoading) {
      return (
          <View style={styles.view_bg}>
              <ActivityIndicator size="large" color="#660095"/>
          </View>
      );
  } else {
      return (
          <View style={styles.view_bg}>
              <View style={styles.logo_view}>
                  <Text style={styles.text_logo}>Register</Text>
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
                      value={this.state.email}
                      placeholder="e-mail"
                      style={styles.text_input}
                      onChangeText={(text) => {
                          this.setState({email: text});
                      }}
                  />
                  <TextInput
                      value={this.state.password1}
                      placeholder="password"
                      style={styles.text_input}
                      secureTextEntry={true}
                      onChangeText={(text) => {
                          this.setState({password1: text});
                      }}
                  />
                  <TextInput
                      value={this.state.password2}
                      placeholder="confirm password"
                      style={styles.text_input}
                      secureTextEntry={true}
                      onChangeText={(text) => {
                          this.setState({password2: text});
                      }}
                  />
              </View>

              {errorMessage}

              <View
                  style={{
                      width: "70%",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                  }}
              >
                  <View style={{width: "30%"}}>
                      <Button
                          onPress={() => {
                              this.props.navigation.replace("Login");
                          }}
                          title="BACK"
                          titleStyle={{
                           
                              color: "white",
                          }}
                          containerStyle={{width: "100%"}}
                          buttonStyle={{
                              borderRadius: 30,
                              backgroundColor: "#DE3F1C",
                              paddingHorizontal: 20,
                          }}
                      />
                  </View>
                  <View style={{width: "30%"}}>
                      <Button
                          title="SAVE"
                          titleStyle={{
                            
                              color: "white",
                          }}
                          onPress={async () => {
                              await this._onPressButton();
                          }}
                          containerStyle={{width: "100%"}}
                          buttonStyle={{
                              borderRadius: 30,
                              backgroundColor: "#18AB4D",
                              paddingHorizontal: 20,
                            
                          }}
                      />
                  </View>
              </View>
          </View>
      );
    }
  
  }
}
const styles = StyleSheet.create({
  view_bg: {
      backgroundColor: "#304889",
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
  },
  logo: {
      width: 66,
      height: 58,
  },
  logo_view: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 50,
  },
  text_logo: {
      color: "white",
      fontFamily: "Signika",
      fontSize: 35,
  },
  input_view: {
      width: "70%",
      marginBottom: 50,
  },
  text_input: {
      borderColor: "black",
      borderWidth: 1,
      height: 40,
      backgroundColor: "white",
      borderRadius: 30,
      width: "100%",
      paddingHorizontal: 20,
      marginVertical: 10,
  },
  container_error: {
      height: 100,
  },
  container: {
      flex: 1,
      justifyContent: "center",
  },
  horizontal: {
      flexDirection: "row",
      justifyContent: "space-around",
      padding: 10,
  },
});
