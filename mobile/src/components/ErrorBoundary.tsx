import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Fonts, Radius } from '../theme';

// This app had zero error boundaries anywhere before this file — a single
// render-time exception in one list row (a bad value, an undefined field,
// anything) had no way to ever surface: no dev console on a release/preview
// build, no crash log visible to anyone without a USB cable and adb. The
// symptom looked exactly like this: a correctly-sized, empty Card, with no
// indication anything had gone wrong. Wrap anything worth isolating (a
// single list row, a screen section) in this so a real error becomes
// visible red text in-app instead of an unexplained blank space.
interface Props {
  children: React.ReactNode;
  fallbackLabel?: string;
}
interface State {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <View style={styles.box}>
          <Text style={styles.title}>{this.props.fallbackLabel ?? "Couldn't display this"}</Text>
          <Text style={styles.message}>{this.state.error.message}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  box: { backgroundColor: Colors.error + '15', borderRadius: Radius.sm, padding: Spacing.md, marginBottom: Spacing.sm },
  title: { color: Colors.error, fontWeight: '700', fontSize: Fonts.sizes.sm, marginBottom: 4 },
  message: { color: Colors.error, fontSize: Fonts.sizes.xs },
});
