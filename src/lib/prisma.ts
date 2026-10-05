import "dotenv/config";
import pg from "pg";
import {PrismaPg} from "@prisma/adapter-pg";
import {PrismaClient} from "../generated/prisma/client"

const globalPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const urlSinValidar = import.meta.env?.DATABASE_URL ?? process.env.DATABASE_URL
const databaseURL = (urlSinValidar ?? "").trim();

if(!databaseURL){
    throw new Error("La URL de prisma es necesaria");
}

let instanciaPrisma: PrismaClient;

if(globalPrisma.prisma){
    instanciaPrisma = globalPrisma.prisma
} else {
    const pool = new pg.Pool({ connectionString: databaseURL });

    const adapter = new PrismaPg(pool);

    instanciaPrisma = new PrismaClient({adapter});

    if(process.env.NODE_ENV !== "production"){
        globalPrisma.prisma = instanciaPrisma;
    }
}

export const prisma = instanciaPrisma;
export default prisma