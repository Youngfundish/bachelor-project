import "next-auth";

declare module "next-auth" {
    interface Session {
        token?: string;
        user: {
            userId: number;
            email: string;
            name: string;
            role?: string;
        };

    }
}

declare module "next-auth/jwt" {
    interface JWT {
        userId: number;
        email: string;
        name: string;
        role?: string;
        token?: string;
    }
}
