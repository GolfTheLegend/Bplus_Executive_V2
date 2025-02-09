import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  Image,
  ImageBackground,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
  Platform,
  BackHandler,
  StatusBar,

  ScrollView,
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native';

import CheckBox from '@react-native-community/checkbox';
import DeviceInfo from 'react-native-device-info';
import { NetworkInfo } from "react-native-network-info";



import { SafeAreaView } from 'react-native-safe-area-context';


import { useStateIfMounted } from 'use-state-if-mounted';


import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';


import { useSelector, connect, useDispatch } from 'react-redux';



import { Language, changeLanguage } from '../translations/I18n';
import { FontSize } from '../components/FontSizeHelper';


import * as loginActions from '../src/actions/loginActions';
import * as registerActions from '../src/actions/registerActions';
import * as databaseActions from '../src/actions/databaseActions';

import Colors from '../src/Colors';
import { fontSize, fontWeight } from 'styled-system';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const MainScreen = () => {

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const registerReducer = useSelector(({ registerReducer }) => registerReducer);
  const loginReducer = useSelector(({ loginReducer }) => loginReducer);
  const databaseReducer = useSelector(({ databaseReducer }) => databaseReducer);
  const {
    container2,
    container1,
    button,
    textButton,
    topImage,
    tabbar,
    buttonContainer,
  } = styles;

  useEffect(() => {


    //backsakura013
  }, []);

  const [GUID, setGUID] = useStateIfMounted('');

  const [isSelected, setSelection] = useState(loginReducer.userloggedIn == true ? loginReducer.userloggedIn : false);
  const [isSFeatures, setSFeatures] = useState(loginReducer.isSFeatures == true ? loginReducer.isSFeatures : false);

  const [loading, setLoading] = useStateIfMounted(false);
  const [loading_backG, setLoading_backG] = useStateIfMounted(true);

  const [resultJson, setResultJson] = useState([]);
  const [marker, setMarker] = useState(false);
  const [username, setUsername] = useState(loginReducer.userloggedIn == true ? loginReducer.userNameED : '');
  const [password, setPassword] = useState(loginReducer.userloggedIn == true ? loginReducer.passwordED : '');

  const [data, setData] = useStateIfMounted({
    secureTextEntry: true,
  });

  const image = '../images/UI/Asset35.png';

  useEffect(() => {
    console.log('>> machineNum :', registerReducer.machineNum + '\n\n\n\n')
  }, [registerReducer.machineNum]);

  useEffect(() => {

    console.log()
    console.log()
    console.log('index >> ', navigation.getState().index)

    const backAction = () => {
      if (navigation.getState().index == 0) {


        Alert.alert(Language.t('menu.exitProgram'), Language.t('menu.DoexitProgram'), [
          { text: Language.t('alert.confirm'), onPress: () => logOutForexitApp() },
          {
            text: Language.t('alert.cancel'),
            onPress: () => null,
            style: "cancel"
          }
        ]);
        return true;
      };
    }
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const closeLoading = () => {
    setLoading(false);
  };
  const letsLoading = () => {
    setLoading(true);
  };
  const logOutForexitApp = async () => {
    setLoading(true)
    await fetch(databaseReducer.Data.urlser + '/DevUsers', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': '',
        'BPAPUS-FUNCTION': 'UnRegister',
        'BPAPUS-PARAM':
          '{"BPAPUS-MACHINE": "' +
          registerReducer.machineNum +
          '" }',
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        setLoading(false)


      })
      .catch((error) => {
      });

    dispatch(loginActions.guid([]))
    BackHandler.exitApp()

  };

  const logOut = async () => {
    setLoading(true)
    await fetch(databaseReducer.Data.urlser + '/DevUsers', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': '',
        'BPAPUS-FUNCTION': 'UnRegister',
        'BPAPUS-PARAM':
          '{"BPAPUS-MACHINE": "' +
          registerReducer.machineNum +
          '" }',
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        setLoading(false)
        if (json && json.ResponseCode == '635') {
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('alert.errorDetail'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
          console.log('NOT FOUND MEMBER');
        } else if (json && json.ResponseCode == '629') {
          Alert.alert(
            Language.t('alert.errorTitle'),
            'Function Parameter Required', [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        } else if (json && json.ResponseCode == '200') {
          dispatch(loginActions.guid([]))
          navigation.dispatch(
            navigation.replace('LoginScreen')
          )
        } else {
          Alert.alert(
            Language.t('alert.errorTitle'),
          );
        }
      })
      .catch((error) => {
        console.error('ERROR at _fetchGuidLogin' + error);
        setLoading(false)
        if (databaseReducer.Data.urlser == '') {
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('selectBase.error'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        } else {
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('alert.internetError'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        }
      });

  };

  return (

    <SafeAreaView style={container1}>
      <StatusBar hidden={true} />
      <ImageBackground source={require(image)} onLoadEnd={() => { setLoading_backG(false) }} resizeMode="cover" style={styles.image}>
        {!loading_backG ?
          < >
            <Image
              style={topImage}
              source={require('../images/UI/Asset5.png')}
            />

            <ScrollView>
              <View style={{ padding: 20, marginTop: 0 }}>
                <View>
                  <TouchableOpacity

                    onPress={() => navigation.navigate('Ereport')}
                    style={{
                      backgroundColor: Colors.backgroundLoginColorSecondary,
                      flexDirection: 'column',
                      margin: 10,
                      borderRadius: 10,
                      paddingLeft: 10,
                      paddingRight: 10,
                      paddingTop: 10,
                      paddingBottom: 10,
                      shadowColor: Colors.borderColor,
                      shadowOffset: {
                        width: 0,
                        height: 6,
                      },
                      shadowOpacity: 0.5,
                      shadowRadius: 1.0,
                      elevation: 15,
                    }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Image
                        style={{ height: 40, width: 40 }}
                        resizeMode={'contain'}
                        source={require('../images/UI/Asset7.png')}
                      />
                      <View style={{ marginLeft: 20 }}>
                        <Text style={{
                          color: 'black',
                          alignSelf: 'center',
                          fontSize: FontSize.medium,
                          fontWeight: 'bold'
                        }}>รายงานสำหรับผู้บริหาร</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('ReportScreen')}
                    style={{
                      backgroundColor: Colors.backgroundLoginColorSecondary,
                      flexDirection: 'column',
                      margin: 10,
                      borderRadius: 10,
                      paddingLeft: 10,
                      paddingRight: 10,
                      paddingTop: 10,
                      paddingBottom: 10,
                      shadowColor: Colors.borderColor,
                      shadowOffset: {
                        width: 0,
                        height: 6,
                      },
                      shadowOpacity: 0.5,
                      shadowRadius: 1.0,
                      elevation: 15,
                    }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Image
                        style={{ height: 40, width: 40 }}
                        resizeMode={'contain'}
                        source={require('../images/UI/Asset9.png')}
                      />
                      <View style={{ marginLeft: 20 }}>
                        <Text style={{
                          color: 'black',
                          alignSelf: 'center',
                          fontSize: FontSize.medium,
                          fontWeight: 'bold'
                        }}>รายงาน</Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  {/* <TouchableOpacity
                    style={{
                      backgroundColor: Colors.backgroundLoginColorSecondary,
                      flexDirection: 'column',
                      margin: 10,
                      borderRadius: 10,
                      paddingLeft: 10,
                      paddingRight: 10,
                      paddingTop: 10,
                      paddingBottom: 10,
                      shadowColor: Colors.borderColor,
                      shadowOffset: {
                        width: 0,
                        height: 6,
                      },
                      shadowOpacity: 0.5,
                      shadowRadius: 1.0,
                      elevation: 15,
                    }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Image
                        style={{ height: 40, width: 40 }}
                        resizeMode={'contain'}
                        source={require('../images/UI/Asset9.png')}
                      />
                      <View style={{ marginLeft: 20 }}>
                        <Text style={{
                          color: 'black',
                          alignSelf: 'center',
                          fontSize: FontSize.medium,
                          fontWeight: 'bold'
                        }}>อนุมัติเอกสาร</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('ApprovalLimit')}
                    style={{
                      backgroundColor: Colors.backgroundLoginColorSecondary,
                      flexDirection: 'column',
                      margin: 10,
                      borderRadius: 10,
                      paddingLeft: 10,
                      paddingRight: 10,
                      paddingTop: 10,
                      paddingBottom: 10,
                      shadowColor: Colors.borderColor,
                      shadowOffset: {
                        width: 0,
                        height: 6,
                      },
                      shadowOpacity: 0.5,
                      shadowRadius: 1.0,
                      elevation: 15,
                    }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Image
                        style={{ height: 40, width: 40 }}
                        resizeMode={'contain'}
                        source={require('../images/UI/Asset10.png')}
                      />
                      <View style={{ marginLeft: 20 }}>
                        <Text style={{
                          color: 'black',
                          alignSelf: 'center',
                          fontSize: FontSize.medium,
                          fontWeight: 'bold'
                        }}>อนุมัติวงเงิน</Text>
                      </View>
                    </View>
                  </TouchableOpacity> */}
                  <TouchableOpacity
                    onPress={() => navigation.navigate('OrderScreen')}
                    style={{
                      backgroundColor: Colors.backgroundLoginColorSecondary,
                      flexDirection: 'column',
                      margin: 10,
                      borderRadius: 10,
                      paddingLeft: 10,
                      paddingRight: 10,
                      paddingTop: 10,
                      paddingBottom: 10,
                      shadowColor: Colors.borderColor,
                      shadowOffset: {
                        width: 0,
                        height: 6,
                      },
                      shadowOpacity: 0.5,
                      shadowRadius: 1.0,
                      elevation: 15,
                    }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Image
                        style={{ height: 40, width: 40 }}
                        resizeMode={'contain'}
                        source={require('../images/UI/Asset11.png')}
                      />
                      <View style={{ marginLeft: 20 }}>
                        <Text style={{
                          color: 'black',
                          alignSelf: 'center',
                          fontSize: FontSize.medium,
                          fontWeight: 'bold'
                        }}>ข้อมูลประกอบการสั่งซื้อ</Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => navigation.navigate('DailyCalendarScreen')}
                    style={{
                      backgroundColor: Colors.backgroundLoginColorSecondary,
                      flexDirection: 'column',
                      margin: 10,
                      borderRadius: 10,
                      paddingLeft: 10,
                      paddingRight: 10,
                      paddingTop: 10,
                      paddingBottom: 10,
                      shadowColor: Colors.borderColor,
                      shadowOffset: {
                        width: 0,
                        height: 6,
                      },
                      shadowOpacity: 0.5,
                      shadowRadius: 1.0,
                      elevation: 15,
                    }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Image
                        style={{ height: 40, width: 40 }}
                        resizeMode={'contain'}
                        source={require('../images/UI/Asset12.png')}
                      />
                      <View style={{ marginLeft: 20 }}>
                        <Text style={{
                          color: 'black',
                          alignSelf: 'center',
                          fontSize: FontSize.medium,
                          fontWeight: 'bold'
                        }}>ปฏิทินงานประจำวัน</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableNativeFeedback
                    onPress={() => Alert.alert('', Language.t('menu.alertLogoutMessage'), [{ text: Language.t('alert.ok'), onPress: () => logOut() }, { text: Language.t('alert.cancel'), onPress: () => { } }])}>
                    <View
                      style={{
                        margin: 10,
                        borderRadius: 20,
                        flexDirection: 'column',
                        padding: 10,
                        backgroundColor: Colors.buttonColorPrimary,
                      }}>
                      <Text
                        style={{
                          color: Colors.buttonTextColor,
                          alignSelf: 'center',
                          fontSize: FontSize.medium,
                          fontWeight: 'bold',
                        }}>
                        {'ออกจากระบบ'}
                      </Text>
                    </View>
                  </TouchableNativeFeedback>
                </View>
              </View>
            </ScrollView>
          </ > : <View
            style={{
              width: deviceWidth,
              height: deviceHeight,
              opacity: 0.5,
              backgroundColor: 'black',
              alignSelf: 'center',
              justifyContent: 'center',
              alignContent: 'center',
              position: 'absolute',
            }}>

          </View>}

        {loading && (
          <View
            style={{
              width: deviceWidth,
              height: deviceHeight,
              opacity: 0.5,
              backgroundColor: 'black',
              alignSelf: 'center',
              justifyContent: 'center',
              alignContent: 'center',
              position: 'absolute',
            }}>
            <ActivityIndicator
              style={{
                borderRadius: 15,
                backgroundColor: null,
                width: 100,
                height: 100,
                alignSelf: 'center',
              }}
              animating={loading}
              size="large"
              color={Colors.lightPrimiryColor}
            />
          </View>
        )}

      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container1: {

    flex: 1,
    flexDirection: 'column',
  },
  image: {
    flex: 1,
    justifyContent: "center"
  },
  container2: {
    width: deviceWidth,
    height: '100%',
    position: 'absolute',
    backgroundColor: 'white',
    flex: 1,
  },
  tabbar: {
    height: 70,
    padding: 12,
    paddingLeft: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  textTitle2: {
    alignSelf: 'center',
    flex: 2,
    fontSize: FontSize.medium,
    fontWeight: 'bold',
    color: Colors.fontColor,
  },
  imageIcon: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topImage: {
    height: deviceHeight / 2.6,
    width: deviceWidth,
  },
  button: {
    marginTop: 10,
    marginBottom: 25,
    padding: 5,
    alignItems: 'center',
    backgroundColor: Colors.buttonColorPrimary,
    borderRadius: 10,
  },
  textButton: {
    fontSize: FontSize.large,
    color: Colors.fontColor2,
  },
  buttonContainer: {
    marginTop: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 20,
  },
  checkbox: {

    alignSelf: "center",
    borderBottomColor: Colors.fontColor,
    color: Colors.fontColor,

  },
  label: {
    margin: 8,
    color: Colors.fontColor,
  },
});


export default MainScreen;
