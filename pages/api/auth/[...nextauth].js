import EmailProvider from "next-auth/providers/email";

let email = "udohdavid2004@gmail.com";
let url = "http://localhost:3000";
let server = "http://localhost:3000";
let from = "Odds Bet";

export const authOptions = {
  providers: [
    EmailProvider({
      //   server: {
      //     host: process.env.EMAIL_SERVER_HOST,
      //     port: process.env.EMAIL_SERVER_PORT,
      //     auth: {
      //       user: process.env.EMAIL_SERVER_USER,
      //       pass: process.env.EMAIL_SERVER_PASSWORD,
      //     },
      //   },
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
};
