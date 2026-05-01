import {NextRequest, NextResponse} from 'next/server';
import {signIn} from "@/lib/auth";

export async function POST (req: NextRequest){
    try{
        const { email, password } = await req.json();

        if(!email || !password){
            return NextResponse.json(
                { message: 'Email and password are required'},
                { status: 400 }
            )
        }

        await signIn('credentials', { email, password, redirect: false})

        return NextResponse.json(
            { message: 'Signed in successfully'},
            { status: 200 }
        )

    } catch(error){
        return NextResponse.json(
            { message: 'Incorrect email or password'},
            { status: 401 }
        )
    }
}