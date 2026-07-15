import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<any>();

// Screens nested several levels deep (Tab -> Stack -> Landing screen) would
// otherwise need to call navigation.getParent().getParent() to reach the root
// stack that owns the Notifications screen, and that chain breaks the moment
// the nesting changes. Navigating through a single ref avoids that coupling.
export function openNotifications() {
  if (navigationRef.isReady()) {
    navigationRef.navigate('Notifications');
  }
}

export function openBraineeChat() {
  if (navigationRef.isReady()) {
    navigationRef.navigate('BraineeChat');
  }
}

// ── Push notification tap targets ───────────────────────────────────────────
// ChatThreadScreen takes a full { id, username, full_name, role } contact
// object as its route param (see ChatsScreen's openThread), not just an id —
// so the message push's `data.contact` (built server-side in messages.ts)
// is passed straight through here.
export function openMessageThread(contact: { id: string; username: string; full_name: string; role: string }) {
  if (navigationRef.isReady()) {
    navigationRef.navigate('ChatThread', { contact });
  }
}

// TakeAssessmentScreen takes { assessmentId, title } — both travel in the
// assessment-publish push's `data` (see learning.ts).
export function openAssessment(assessmentId: string, title: string) {
  if (navigationRef.isReady()) {
    navigationRef.navigate('TakeAssessment', { assessmentId, title });
  }
}
