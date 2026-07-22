import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse  } from "next/server";

export async function POST(request) {
    let body;

    try {
      body = await request.json();
    } catch {
      return Response.json(
        { error: 'Invalid or missing JSON body' },
        { status: 400 }
      );
    }
    try {
        const { name, email, password } = body;
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Name , email , password are required"},
                {status:  400}
            );
        }

        const existingUser = await prisma.user.findUnique({where: {email}});
        if(existingUser) {
            return Response.json(
                { error: 'A User with this email already exists'},
                {status: 409 }
            );
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: { name , email, password: hashPassword },
        });

        return Response.json(
            {id: user.id, name: user.name, email: user.email},
            {status: 201}
        );
        
    } catch (error) {
        console.error(error);
        return Response.json({ error: 'Something went wrong' }, { status: 500 });
      }
    


}
