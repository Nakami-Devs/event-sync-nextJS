import {NextRequest, NextResponse} from 'next/server';
import {createPrismaClient, prisma} from "@/lib/prisma";

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

        const total = speakers.length;

        return NextResponse.json(speakers, {
            status: 200,
            headers: {
                'X-Total-Count': total.toString(),
            }
        })
    } catch (error) {
        console.error('Erreur lors de la récupération des intervenants:', error);
        return NextResponse.json(
            { error: 'Erreur interne du serveur' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const { full_name, profile_pic, biography, external_links } = await req.json();

        if (!full_name || !profile_pic || !biography || !external_links) {
            return NextResponse.json(
                { error: 'Tous les champs sont requis' },
                { status: 400 }
            );
        }

        const existingSpeaker = await prisma.speaker.findFirst({
            where: { full_name }
        });

        if(existingSpeaker){
            return NextResponse.json(
                { message: `Un intervenant avec le nom ${full_name} existe déjà`},
                { status: 409 }
            )
        }

        const speaker = await prisma.speaker.create({
            data: {
                full_name,
                profile_pic,
                biography,
                external_links
            }
        });

        return NextResponse.json(speaker, { status: 201 });
    } catch (error) {
        console.error('Erreur lors de la création de l\'intervenant', error);
        return NextResponse.json(
            { error: 'Erreur interne du serveur' },
            { status: 500 }
        );
    }
}
