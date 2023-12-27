import { z } from 'zod';
import { procedure, router } from './trpc';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { TRPCError } from '@trpc/server';
import { db } from '@/services/db';

export const appRouter = router({
    authCallback: procedure.query(async () => {
        const { getUser } = getKindeServerSession();
        const user = await getUser();
        if (!user?.email || !user.id)
            throw new TRPCError({ code: 'UNAUTHORIZED' });

        // check if the user exists in the db
        const dbUser = await db.user.findFirst({ where: { id: user.id } });

        if (!dbUser) {
            await db.user.create({
                data: { id: user.id, email: user.email }
            });
        }

        return { success: true };
    })
});

// export type definition of API
export type AppRouter = typeof appRouter;
