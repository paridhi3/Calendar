// // app/api/auth/[...nextauth]/route.js

// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import { prisma } from "@/lib/prisma";

// const handler = NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//   ],
//   callbacks: {
//     async signIn({ user }) {
//       if (!user?.email) {
//         // No email, reject sign in
//         return false;
//       }

//       try {
//         // Check if user already exists
//         const existingUser = await prisma.user.findUnique({
//           where: { email: user.email },
//         });

//         if (!existingUser) {
//           await prisma.user.create({
//             data: {
//               name: user.name,
//               email: user.email,
//             },
//           });
//         }
//       } catch (error) {
//         console.error("Error in signIn callback:", error);
//         return false; // reject login on error
//       }

//       return true; // allow login
//     },
//   },
// });

// export { handler as GET, handler as POST };
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Upsert user logic here (as before)
      if (!user.email) return false;
      try {
        await prisma.user.upsert({
          where: { email: user.email },
          update: { name: user.name },
          create: { email: user.email, name: user.name },
        });
        return true;
      } catch {
        return false;
      }
    },

    async session({ session, token }) {
      if (session.user && session.user.email) {
        // Query database to get user id by email
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
        });
        if (dbUser) {
          session.user.id = dbUser.id;
        }
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
