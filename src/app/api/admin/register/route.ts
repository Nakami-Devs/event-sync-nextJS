import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try{
        const { email, password } = await req.json()

        if(!email || !password){
            return NextResponse.json(
                { message: 'Email et mot de passe requis'},
                { status: 400 }
            )
        }

        const existingAdmin = await prisma.admin.findUnique({
            where: {email},
        })

        if(existingAdmin){
            return NextResponse.json(
                { message: 'Cet email est déjà utilisé' },
                { status: 409 }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const admin = await prisma.admin.create({
            data: { email, password: hashedPassword },
        })

        return NextResponse.json(
            { message: 'Admin créé avec succès',
            admin: {id: admin.id, email: admin.email}
            },
            { status : 201 }
        )
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { message : 'Erreur interne du serveur' },
            { status: 500 }
        )
    }
}