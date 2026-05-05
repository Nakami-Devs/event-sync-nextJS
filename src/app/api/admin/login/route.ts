import {NextRequest, NextResponse} from 'next/server';
import {prisma} from "@/lib/prisma";
import {generateToken} from "@/lib/token";

export async function POST (req: NextRequest){
    try{
        const { email, password } = await req.json();

        if(!email || !password){
            return NextResponse.json(
                { message: 'L\'email et le mot de passe sont requis'},
                { status: 400 }
            )
        }

        const admin = await prisma.admin.findUnique({
            where: { email },
        })


        if (!admin) {
            return NextResponse.json(
                { message: 'Email ou mot de passe incorrect' },
                { status: 401 }
            )
        }

        const token = await generateToken({ id: admin.id, email: admin.email })
        return NextResponse.json(
            {
                message: 'Connexion réussie',
                admin: {
                    id: admin.id,
                    email: admin.email,
                },
                token,
            },
            { status: 200 }
        )

    } catch(error){
        return NextResponse.json(
            { message: 'Erreur interne du serveur'},
            { status: 500 }
        )
    }
}