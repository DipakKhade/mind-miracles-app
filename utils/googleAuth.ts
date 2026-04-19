import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { Alert } from 'react-native';
import api from './api';

GoogleSignin.configure({
  webClientId: '445449564484-l0fssviddmq19pppjt7mtk64p1vkn677.apps.googleusercontent.com',
  offlineAccess: true,
  hostedDomain: '',
  forceCodeForRefreshToken: true,
  accountName: '',
  profileImageSize: 120,
});

console.log('[GoogleAuth] Configure called');

export const signInWithGoogle = async () => {
  try {
    console.log('[GoogleAuth] Starting sign in...');
    
    const hasPlayServices = await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });
    console.log('[GoogleAuth] hasPlayServices:', hasPlayServices);
    
    if (!hasPlayServices) {
      Alert.alert('Error', 'Google Play Services not available');
      return { success: false, error: 'PLAY_SERVICES_NOT_AVAILABLE' };
    }
    
    console.log('[GoogleAuth] Signing in with Google...');
    const googleUser = await GoogleSignin.signIn();
    console.log('[GoogleAuth] Google sign in successful', googleUser);
    
    const { user } = googleUser.data;
    if (!user) {
      return { success: false, error: 'No user data received' };
    }
    
    // Sync user with our server
    let serverUser = null;
    try {
      console.log('[GoogleAuth] Syncing with server...');
      serverUser = await api.users.googleAuth(
        user.name || 'User',
        user.email || '',
        user.photo
      );
      console.log('[GoogleAuth] Server sync successful, user:', serverUser?.name);
      
      if (serverUser) {
        await AsyncStorage.setItem('server_user_id', serverUser._id || serverUser.id || '');
      } else {
        // Save Google user ID as fallback
        await AsyncStorage.setItem('server_user_id', user.id || '');
      }
    } catch (serverErr: any) {
      console.log('[GoogleAuth] Server sync error:', serverErr.message);
      // Save Google user ID as fallback
      await AsyncStorage.setItem('server_user_id', user.id || '');
    }
    
    const userData = {
      user: {
        ...user,
        serverId: serverUser?._id || serverUser?.id,
      },
    };
    
    return { success: true, user: userData };
  } catch (error: any) {
    console.log('[GoogleAuth] Error:', error.code, error.message || error);
    
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      return { success: false, error: 'Sign in was cancelled' };
    } else if (error.code === statusCodes.IN_PROGRESS) {
      return { success: false, error: 'Sign in is in progress' };
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      return { success: false, error: 'Play services not available' };
    } else {
      Alert.alert('Sign In Error', error.message || 'Unknown error');
      return { success: false, error: error.message || 'Unknown error' };
    }
  }
};

export const signOutGoogle = async () => {
  try {
    console.log('[GoogleAuth] Signing out...');
    await GoogleSignin.signOut();
    // Clear stored user ID
    await AsyncStorage.removeItem('server_user_id');
    console.log('[GoogleAuth] Sign out successful, storage cleared');
    return { success: true };
  } catch (error: any) {
    console.log('[GoogleAuth] Sign out error:', error.message);
    return { success: false, error: error.message };
  }
};

export const getCurrentUser = async () => {
  try {
    console.log('[GoogleAuth] Getting current user...');
    const userInfo = await GoogleSignin.getCurrentUser();
    console.log('[GoogleAuth] Current user found:', !!userInfo);
    return { success: true, user: userInfo };
  } catch (error: any) {
    console.log('[GoogleAuth] Get current user error:', error.message);
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
