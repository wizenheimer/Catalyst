'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { Button } from './ui/button';

type Props = {};

function UploadButton({}: Props) {
    const [isOpen, setisOpen] = useState<boolean>(false);

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(visible) => {
                if (!visible) setisOpen(visible);
            }}
        >
            <DialogTrigger asChild onClick={() => setisOpen(true)}>
                <Button>Upload PDF</Button>
            </DialogTrigger>
            <DialogContent></DialogContent>
        </Dialog>
    );
}

export default UploadButton;
