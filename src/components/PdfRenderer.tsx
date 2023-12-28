import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

type Props = {
    url: string;
};

function PdfRenderer({ url }: Props) {
    return (
        <div className="w-full bg-white rounded-md shadow flex flex-col items-center">
            {/* pdf view manager  */}
            <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
                <div className="flex items-center gap-1.5"></div>
            </div>
            {/* pdf viewer */}
            <div className="flex-1 w-full max-h-screen">
                <div>
                    <Document file={url} className="max-h-full">
                        <Page pageNumber={1} />
                    </Document>
                </div>
            </div>
        </div>
    );
}

export default PdfRenderer;
