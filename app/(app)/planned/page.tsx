"use client";

import useSWR from "swr";
import { List } from "@/components/ListNew";
import { LoadingContent } from "@/components/LoadingContent";
import { PlannedResponse } from "@/app/api/user/planned/route";
import Link from "next/link";
import { Card } from "@tremor/react";
import { Button } from "@/components/Button";
import { postRequest } from "@/utils/api";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import {
  ExecutePlanBody,
  ExecutePlanResponse,
} from "@/app/api/user/planned/[id]/controller";
import { useState } from "react";
import { toastError, toastSuccess } from "@/components/Toast";

export default function Home() {
  const { data, isLoading, error } = useSWR<PlannedResponse>(
    "/api/user/planned",
    {
      keepPreviousData: true,
      dedupingInterval: 1_000,
    }
  );

  const [executing, setExecuting] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  return (
    <div>
      <LoadingContent loading={isLoading} error={error}>
        {/* {data && <List emails={data?.messages || []} refetch={mutate} />} */}
        {data?.messages.length ? (
          <div className="border-b border-gray-200 p-4">
            {data.messages.map((message) => {
              return (
                <div
                  key={message.id}
                  className="flex items-center justify-between"
                >
                  <div>{message.snippet}</div>
                  <div className="flex items-center">
                    <div>
                      {message.plan.rule.actions.map((a) => a.type).join(", ")}
                    </div>
                    <div className="ml-2 space-x-2">
                      <Button
                        color="white"
                        roundedSize="full"
                        loading={executing}
                        onClick={async () => {
                          setExecuting(true);

                          try {
                            await postRequest<
                              ExecutePlanResponse,
                              ExecutePlanBody
                            >(`/api/user/planned/${message.plan.id}`, {
                              email: {
                                subject: message.parsedMessage.headers.subject,
                                from: message.parsedMessage.headers.from,
                                to: message.parsedMessage.headers.to,
                                cc: message.parsedMessage.headers.cc,
                                replyTo:
                                  message.parsedMessage.headers["reply-to"],
                                references:
                                  message.parsedMessage.headers["references"],
                                date: message.parsedMessage.headers.date,
                                headerMessageId:
                                  message.parsedMessage.headers["message-id"],
                                content: message.parsedMessage.textHtml,
                                messageId: message.id || "",
                                threadId: message.threadId || "",
                              },
                              ruleId: message.plan.rule.id,
                              actions: message.plan.rule.actions,
                              args: message.plan.functionArgs,
                            });

                            toastSuccess({ description: "Executed!" });
                          } catch (error) {
                            console.error(error);
                            toastError({
                              description: "Unable to execute plan :(",
                            });
                          }

                          setExecuting(false);
                        }}
                      >
                        <CheckCircleIcon className="h-6 w-6" />
                      </Button>

                      <Button
                        color="white"
                        roundedSize="full"
                        loading={rejecting}
                        onClick={() => {
                          setRejecting(true);

                          setTimeout(() => {
                            setRejecting(false);
                          }, 1_000);
                        }}
                      >
                        <XCircleIcon className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mx-auto max-w-2xl p-8">
            <Card>
              No planned actions. Set rules in your{" "}
              <Link href="/settings" className="font-semibold hover:underline">
                Settings
              </Link>{" "}
              for the AI to handle incoming emails for you.
            </Card>
          </div>
        )}
      </LoadingContent>

      <div className="mx-auto max-w-2xl p-8">
        <RunRules />
      </div>
    </div>
  );
}

function RunRules() {
  return (
    <Card>
      <p>Run AI on last 10 emails.</p>
      <div className="mt-4">
        <Button
          onClick={() => {
            // postRequest<>("/api/user/planned/run", {});
          }}
        >
          Run
        </Button>
      </div>
    </Card>
  );
}