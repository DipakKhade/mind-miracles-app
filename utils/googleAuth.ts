import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import Constants from 'expo-constants';

const webClientId = Constants.expoConfig?.extra?.googleWebClientId;
const iosClientId = Constants.expoConfig?.extra?.googleIosClientId;


GoogleSignin.configure({
  webClientId: webClientId,
  offlineAccess: true,
  hostedDomain: '',
  forceCodeForRefreshToken: true,
  accountName: '',
  iosClientId: iosClientId,
  scopes: ['profile', 'email'],
  profileImageSize: 120,
});

export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    return { success: true, user: userInfo };
  } catch (error: any) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      return { success: false, error: 'Sign in was cancelled' };
    } else if (error.code === statusCodes.IN_PROGRESS) {
      return { success: false, error: 'Sign in is in progress' };
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      return { success: false, error: 'Play services not available' };
    } else {
      return { success: false, error: error.message || 'Unknown error' };
    }
  }
};

export const signOutGoogle = async () => {
  try {
    await GoogleSignin.signOut();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getCurrentUser = async () => {
  try {
    const userInfo = await GoogleSignin.getCurrentUser();
    return { success: true, user: userInfo };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const isSignedIn = async () => {
  try {
    const isSignedIn = await GoogleSignin.isSignedIn();
    return { success: true, isSignedIn };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export { GoogleSigninButton };
