import {NextResponse} from 'next/server';
import {createPrismaClient} from "@/lib/prisma";

export async function GET() {
    try {
        const prisma = createPrismaClient();
        const speakers = await prisma.speaker.findMany({
            include: {
                sessions: {
                    include: {
                        session: {
                            include: {
                                event: true,
                                room: true
                            }
                        }
                    },
                }
            },
            orderBy: {full_name: 'asc'},
        });
        return NextResponse.json(speakers, {status: 200});
    } catch (error) {
        console.error('Erreur lors de la récupération des intervenants:', error);
        return NextResponse.json(
            { error: 'Erreur interne du serveur' },
            { status: 500 }
        );
    }
}