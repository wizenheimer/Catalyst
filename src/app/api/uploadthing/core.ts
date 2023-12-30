import { db } from '@/services/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { pinecone } from '@/services/vectordb';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
const f = createUploadthing();

export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    pdfUploader: f({ pdf: { maxFileSize: '4MB' } })
        // Set permissions and file types for this FileRoute
        .middleware(async ({ req }) => {
            const { getUser } = getKindeServerSession();
            const user = await getUser();
            if (!user || !user.id) throw new Error('UNAUTHORIZED');
            return {
                userId: user.id
            };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            const createdFile = await db.file.create({
                data: {
                    key: file.key,
                    name: file.name,
                    userId: metadata.userId,
                    // url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
                    url: file.url,
                    uploadStatus: 'PROCESSING'
                }
            });
            // prepare to index
            try {
                const response = await fetch(file.url);
                const blob = await response.json();

                const loader = new PDFLoader(blob);

                const pageLevelDocs = await loader.load();
                const pagesAmt = pageLevelDocs.length;

                const pineconeIndex = pinecone.Index('catalyst');
                const embeddings = new OpenAIEmbeddings({
                    openAIApiKey: process.env.OPENAPI_KEY
                });

                await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
                    pineconeIndex,
                    namespace: createdFile.id
                });

                await db.file.update({
                    data: {
                        uploadStatus: 'SUCCESS'
                    },
                    where: {
                        id: createdFile.id
                    }
                });
            } catch (err) {
                await db.file.update({
                    data: {
                        uploadStatus: 'FAILED'
                    },
                    where: {
                        id: createdFile.id
                    }
                });
            }
        })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
