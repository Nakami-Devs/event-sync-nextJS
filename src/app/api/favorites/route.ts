import { NextRequest, NextResponse } from "next/server";
import { createPrismaClient } from "@/lib/prisma";

export async function GET() {
    try {
        const prisma = createPrismaClient();

        const favorites = await prisma.favorite.findMany({
            include: {
                event: {
                    include: {
                        sessions: true
                    }
                }
            }
        });
        return NextResponse.json(favorites, {
            status: 200
        });
    } catch (error) {
        console.error(
            "Erreur récupération favoris : ",
            error
        );
        return NextResponse.json(
            { error: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const prisma = createPrismaClient();
        const body = await request.json();
        const { eventId } = body;

        if (!eventId) {
            return NextResponse.json(
                { error: "eventId requis" },
                { status:400 }
            );
        }

        const exists = await prisma.favorite.findUnique({
            where:{
                eventId
            }
        });

        if(exists){
            return NextResponse.json(
                {
                    message:"Déjà dans les favoris"
                },
                {
                    status:409
                }
            );
        }

        const favorite = await prisma.favorite.create({
            data:{
                eventId
            }
        });
        return NextResponse.json(
            favorite,
            {
                status:201
            }
        );
    } catch(error){
        console.error(
            "Erreur ajout favori:",
            error
        );
        return NextResponse.json(
            {
                error:"Erreur interne"
            },
            {
                status:500
            }
        );
    }
}