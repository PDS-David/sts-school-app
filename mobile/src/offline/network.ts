import NetInfo from '@react-native-community/netinfo';

export async function isOnline(): Promise<boolean> {
  const state = await NetInfo.fetch();
  return !!state.isConnected && state.isInternetReachable !== false;
}

/** Fires whenever connectivity flips true/false. Returns an unsubscribe fn. */
export function subscribeConnectivity(cb: (online: boolean) => void): () => void {
  return NetInfo.addEventListener((state) => {
    cb(!!state.isConnected && state.isInternetReachable !== false);
  });
}
