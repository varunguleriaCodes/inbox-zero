import {
  IMPORTANT_LABEL_ID,
  INBOX_LABEL_ID,
  UNREAD_LABEL_ID,
} from "@/utils/label";
import { type gmail_v1 } from "googleapis";

export async function labelThread(options: {
  gmail: gmail_v1.Gmail;
  threadId: string;
  addLabelIds?: string[];
  removeLabelIds?: string[];
}) {
  const { gmail, threadId, addLabelIds, removeLabelIds } = options;

  return gmail.users.threads.modify({
    userId: "me",
    id: threadId,
    requestBody: {
      addLabelIds,
      removeLabelIds,
    },
  });
}

export async function archiveThread(options: {
  gmail: gmail_v1.Gmail;
  threadId: string;
}) {
  const { gmail, threadId } = options;

  return gmail.users.threads.modify({
    userId: "me",
    id: threadId,
    requestBody: {
      removeLabelIds: [INBOX_LABEL_ID],
    },
  });
}

export async function labelMessage(options: {
  gmail: gmail_v1.Gmail;
  messageId: string;
  addLabelIds?: string[];
  removeLabelIds?: string[];
}) {
  const { gmail, messageId, addLabelIds, removeLabelIds } = options;

  return gmail.users.messages.modify({
    userId: "me",
    id: messageId,
    requestBody: { addLabelIds, removeLabelIds },
  });
}

export async function markReadThread(options: {
  gmail: gmail_v1.Gmail;
  threadId: string;
  read: boolean;
}) {
  const { gmail, threadId, read } = options;

  return gmail.users.threads.modify({
    userId: "me",
    id: threadId,
    requestBody: read
      ? {
          removeLabelIds: [UNREAD_LABEL_ID],
        }
      : {
          addLabelIds: [UNREAD_LABEL_ID],
        },
  });
}

export async function markImportantMessage(options: {
  gmail: gmail_v1.Gmail;
  messageId: string;
  important: boolean;
}) {
  const { gmail, messageId, important } = options;

  return gmail.users.messages.modify({
    userId: "me",
    id: messageId,
    requestBody: important
      ? {
          addLabelIds: [IMPORTANT_LABEL_ID],
        }
      : {
          removeLabelIds: [IMPORTANT_LABEL_ID],
        },
  });
}
