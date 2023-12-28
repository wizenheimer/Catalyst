'use client';

import { ChevronDown, ChevronUp, Loader2, Search } from 'lucide-react';
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useToast } from './ui/use-toast';
import { useResizeDetector } from 'react-resize-detector';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuItem } from './ui/dropdown-menu';
import {
    DropdownMenuContent,
    DropdownMenuTrigger
} from '@radix-ui/react-dropdown-menu';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

type Props = {
    url: string;
};

function PdfRenderer({ url }: Props) {
    const { toast } = useToast();

    const [numPages, setNumPages] = useState<number>();
    const [currPage, setCurrPage] = useState<number>(1);

    const CustomPageValidator = z.object({
        page: z
            .string()
            .refine((num) => Number(num) > 0 && Number(num) < numPages!)
    });

    type TCustomPageValidator = z.infer<typeof CustomPageValidator>;

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm<TCustomPageValidator>({
        defaultValues: {
            page: '1'
        },
        resolver: zodResolver(CustomPageValidator)
    });

    const { width, ref } = useResizeDetector();

    const handlePageSubmit = ({ page }: TCustomPageValidator) => {
        setCurrPage(Number(page));
        setValue('page', String(page));
    };

    return (
        <div className="w-full bg-white rounded-md shadow flex flex-col items-center">
            {/* pdf feature bar  */}
            <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
                <div className="flex items-center gap-1.5">
                    <Button
                        aria-label="previous page"
                        variant="ghost"
                        disabled={currPage <= 1}
                        onClick={() => {
                            setCurrPage((prev) =>
                                prev - 1 > 1 ? prev - 1 : 0
                            );
                        }}
                    >
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-1.5">
                        <Input
                            {...register('page')}
                            className={cn(
                                'w-12 h-8',
                                errors.page && 'focus-visible:ring-red-400'
                            )}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSubmit(handlePageSubmit)();
                                }
                            }}
                        />
                        <p className="text-zinc-700 text-sm space-x-1">
                            <span>/</span>
                            <span>{numPages}</span>
                        </p>
                    </div>
                    <Button
                        aria-label="next page"
                        variant="ghost"
                        disabled={
                            numPages === undefined || currPage === numPages
                        }
                        onClick={() => {
                            setCurrPage((prev) =>
                                prev + 1 > numPages! ? numPages! : prev + 1
                            );
                        }}
                    >
                        <ChevronUp className="h-4 w-4" />
                    </Button>
                </div>
                {/*  */}
                <div className="space-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                aria-label="zoom"
                                variant="ghost"
                                className="gap-1.5"
                            >
                                <Search className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>100%</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            {/* pdf viewer */}
            <div className="flex-1 w-full max-h-screen">
                <div ref={ref}>
                    <Document
                        file={url}
                        className="max-h-full"
                        loading={
                            <div className="flex justify-center">
                                <Loader2 className="my-24 h-6 w-6 animate-spin" />
                            </div>
                        }
                        onLoadError={() => {
                            toast({
                                title: 'Error loading the pdf',
                                description: 'Please try again, later.',
                                variant: 'destructive'
                            });
                        }}
                        onLoadSuccess={({ numPages }) => {
                            setNumPages(numPages);
                        }}
                    >
                        <Page pageNumber={currPage} width={width ? width : 1} />
                    </Document>
                </div>
            </div>
        </div>
    );
}

export default PdfRenderer;
