import React, { useEffect, useReducer, useMemo } from 'react';
import { StyleSheet, Text, View  } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import LoginStackNav from './App/navigations/LoginNav';
import TutStackNav from './App/navigations/TutNav'
import TabNavigator from './App/navigations/TabNavigator';
import { ModalPortal } from 'react-native-modals';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './App/components/AuthContext';
import GlobalVariables from './App/constants/GlobalVariables';
import UserHelper from './App/helper/UserHelper';
import PreLoadScreen from './App/components/PreloadScreen';

export default function App() {
  const ACTION = {
    LOGIN: 'login',
    LOGOUT: 'logout',
    SIGNUP: 'signUp',
    RETRIEVE_TOKEN: 'retrieve_token',
    TUT: 'Tut'
  }

  initLoginState = {
    user: null,
    userToken: null,
    Tut: false,
    isLoading: true
  }

  
  loginReducer = (prevState, action) => {
    switch (action.type) {
      case ACTION.LOGIN:
        return {
          ...prevState,
          user: action.user,
          userToken: action.token,
          Tut: action.Tut,
          isLoading: false
        };
      case ACTION.LOGOUT:
        return {
          ...prevState,
          user: null,
          userToken: null,
          isLoading: false
        };
      case ACTION.SIGNUP:
        return {
          ...prevState,
          user: action.user,
          userToken: action.token,
          Tut: false,
          isLoading: false
        };
      case ACTION.RETRIEVE_TOKEN:
        return {
          ...prevState,
          user: action.user,
          userToken: action.token,
          Tut: action.Tut,
          isLoading: false
        }
      case ACTION.TUT:
        return {
          ...prevState,
          user: action.user,
          userToken: action.token,
          Tut: action.Tut,
          isLoading: false
        }
    }
  }

  const [loginState, dispatch] = useReducer(loginReducer, initLoginState)

  const authContext = useMemo(() => ({
    signIn: (userToken, user) => {
      let isTutPass = false;
      if (user.tutPass == 0) {
        isTutPass = false;
      } else {
        isTutPass = true
      }
      console.log("signIn dispatching")
      dispatch({ type: ACTION.LOGIN, user: user, token: userToken, Tut: isTutPass })
    },
    signOut: async () => {
      // try to remove the cached userid
      try {
        await AsyncStorage.removeItem('userToken');
      }
      catch (err) {
        console.log("The userToken + userId is being deleted upon sign out")
      }

      GlobalVariables.loginUser = '';
      dispatch({ type: ACTION.LOGOUT })
    },
    signUp: (userToken, user) => {
      dispatch({ type: ACTION.SIGNUP, user: user, token: userToken })
    },
    TUT: (userToken, user) => {
      let isPassTut = false;
      if (user.tutPass == 0) {
        isPassTut = false;
      } else {
        isPassTut = true
      }
      dispatch({ type: ACTION.TUT, user: user, token: userToken, Tut: isPassTut })
    }
  }))

  useEffect(() => {
    setTimeout(async () => {
      let temp;
      if (temp = await autoLoginWithToken()) {
        console.log("Logged with user token ")
      }
      else {
        console.log("Not auto logging")
        authContext.signOut()
      }
      
    }, 1000)
    // setTimeout(() => {
    //   if (timeOut) {
    //     console.log("timeout")
    //     authContext.signOut()
    //   } else {
    //     console.log("ok")
    //   }
    // }, 10000)
  }, [])

  const RenderLoginStack = () =>{
    return (
      <SafeAreaProvider>
        <AuthContext.Provider value={authContext}>
          <NavigationContainer>
              <LoginStackNav/>
          </NavigationContainer>
        </AuthContext.Provider>
      </SafeAreaProvider>
    )
  }

  const RenderTutStack = () =>{
    return (
      <SafeAreaProvider>
        <AuthContext.Provider value={authContext}>
           <NavigationContainer>
            <TutStackNav/>
          </NavigationContainer>       
        </AuthContext.Provider>
      </SafeAreaProvider>
    )
  }

  const RenderMain = ()=>{
    return(
      <SafeAreaProvider>
        <AuthContext.Provider value={authContext}>
          <NavigationContainer>
            <TabNavigator />
          </NavigationContainer>
          <ModalPortal />
        </AuthContext.Provider>
      </SafeAreaProvider>
    )
  }

  if (loginState.isLoading) {
    return <PreLoadScreen />
  }

  if (loginState.userToken != null){
    try{
      if(loginState.Tut){
        //go dashboard
        return (
          RenderMain()
        )
      }else{
        //go tut
        return(
          RenderTutStack()
        )
      }
    }catch(e){
      //go login
      return (
        RenderLoginStack()
      )
    }
  }else{
    return (
      //go login
      RenderLoginStack()
    )
  }

  //return (

    // RenderLoginStack()
    // RenderTutStack()
    // RenderMain()

  //);
  async function autoLoginWithToken() {
    let userToken = null;
    let resp = null;
    try {
      userToken = await AsyncStorage.getItem('userToken')
      if (userToken == null) {
        throw 'No TOKEN'
      }
      // verify the cached userid with the server, (authentication)
      resp = await UserHelper.AsyncUserToken(userToken)
      if (resp.status == 'success') {
        GlobalVariables.loginUser = resp.user;
        await AsyncStorage.setItem('userToken', resp.token);
        let isPassTut = false;
        if (resp.user.tutPass == 0) {
          isPassTut = false;
        } else {
          isPassTut = true;
        }
        dispatch({ type: ACTION.RETRIEVE_TOKEN, user: resp.user, token: userToken, Tut: isPassTut })
        console.log(loginState.Tut)
        return true
        //console.log(GlobalVariables.loginUser)
      } else {
        console.log(resp)
        authContext.signOut()
        return false
      }
    } catch (e) {
      console.log(e)
      authContext.signOut()
      return false
    }
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

});
