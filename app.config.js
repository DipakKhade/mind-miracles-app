export default {
    expo: {
      android: {
        package: 'com.dipak8999.mindmiraclesapp',
      },
      extra: {
        googleWebClientId: process.env.GOOGLE_WEB_CLIENT_ID,
        googleIosClientId: process.env.GOOGLE_IOS_CLIENT_ID,
      }
    }
  }