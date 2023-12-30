import { db } from '@/services/db';
import { sendMessageValidator } from '@/validators/SendMessageValidator';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/dist/types/server';
import { NextRequest } from 'next/server';

export const POST = async (req: NextRequest) => {
    // endpoint for querying pdf
    const body = await req.json();

    // handle user mapping
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) return new Response('UNAUTHORIZED', { status: 401 });

    const { fileId, message } = sendMessageValidator.parse(body);
    const file = await db.file.findFirst({
        where: {
            id: fileId,
            userId: user.id
        }
    });

    if (!file) return new Response('NOT FOUND', { status: 404 });
    await db.message.create({
        data: {
            text: message,
            isUserMessage: true,
            userId: user.id,
            fileId: file.id
        }
    });
};
