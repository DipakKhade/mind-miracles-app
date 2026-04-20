import WebView from 'react-native-webview';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

interface VimeoPlayerProps {
  vimeoId: string;
  videoId: string;
}

export default function VimeoPlayer({ vimeoId, videoId }: VimeoPlayerProps) {
  if (!vimeoId) {
    return null;
  }

  const vimeoUrl = `https://player.vimeo.com/video/${vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`;

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: vimeoUrl }}
        style={styles.player}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled
        startInLoadingState
        renderLoading={() => (
          <ActivityIndicator size="large" color="#166534" />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    minHeight: 220,
  },
  player: {
    flex: 1,
  },
});