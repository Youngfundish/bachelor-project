import "next-auth";

declare module "next-auth" {
    interface Session {
        token?: string;
        refreshToken?: string;
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
        refreshToken?: string;
    }
}
