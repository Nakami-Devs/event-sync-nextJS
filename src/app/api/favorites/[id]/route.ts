import { NextResponse } from "next/server";
import { createPrismaClient } from "@/lib/prisma";

export async function DELETE(
    request: Request,
    context:{
        params: Promise<{id:string}>
    }
){
    try{
        const prisma = createPrismaClient();
        const {id} = await context.params;
        await prisma.favorite.delete({
            where:{
                eventId:id
            }
        });
        return NextResponse.json({
            message:"Favori supprimé"
        });
    }catch(error){
        return NextResponse.json(
            {
                error:"Impossible de supprimer"
            },
            {
                status:500
            }
        );
    }
}