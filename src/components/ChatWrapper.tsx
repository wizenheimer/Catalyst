'use client';

import React from 'react';
import Messages from './Messages';
import ChatInput from './ChatInput';
import { trpc } from '@/app/_trpc/client';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from './ui/button';

type Props = {
    fileId: string;
};

function ChatWrapper({ fileId }: Props) {
    const { data, isLoading } = trpc.getFileUploadStatus.useQuery(
        { fileId },
        {
            refetchInterval: (data) => {
                return data?.status === 'SUCCESS' || data?.status === 'FAILED'
                    ? false
                    : 500;
            }
        }
    );

    if (isLoading) {
        return (
            <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
                <div className="flex-1 flex justify-center items-center flex-col mb-28">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                        <h3 className="font-semibold text-xl">Loading...</h3>
                        <p className="text-zinc-500 text-sm">
                            We&apos;re preparing your PDF.
                        </p>
                    </div>
                </div>
                {/* Chat Input */}
                <ChatInput isDisabled />
            </div>
        );
    }

    if (data?.status === 'PROCESSING') {
        return (
            <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
                <div className="flex-1 flex justify-center items-center flex-col mb-28">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                        <h3 className="font-semibold text-xl">Processing...</h3>
                        <p className="text-zinc-500 text-sm">
                            This won&apos;t take long.
                        </p>
                    </div>
                </div>
                {/* Chat Input */}
                <ChatInput isDisabled />
            </div>
        );
    }

    if (data?.status === 'FAILED') {
        return (
            <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
                <div className="flex-1 flex justify-center items-center flex-col mb-28">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 text-red-500 animate-spin" />
                        <h3 className="font-semibold text-xl">
                            Too many pages...
                        </h3>
                        <p className="text-zinc-500 text-sm">
                            Your <span className="font-medium">Free</span> plan
                            supports upto 5 pages per pdf.
                        </p>
                        <Link
                            href="/dashboard"
                            className={buttonVariants({
                                variant: 'secondary',
                                className: 'mt-4'
                            })}
                        ></Link>
                    </div>
                </div>
                {/* Chat Input */}
                <ChatInput isDisabled />
            </div>
        );
    }

    return (
        <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between">
            {/* Messages */}
            <div className="flex-1 justify-between flex flex-col mb-28">
                <Messages />
            </div>
            {/* Chat Input */}
            <ChatInput isDisabled />
        </div>
    );
}

export default ChatWrapper;
