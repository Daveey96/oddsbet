import connectMongo from "@/database/connect";
import User from "@/database/models/user";
import bcrypt from "bcryptjs";

export default async (req, res) => {
  await connectMongo();

  if (req.method === "POST" && req.body.type === "NUM") {
    const { num } = req.body;

    const userAvailable = await User.findOne({ num });

    res.json({ userAvailable: userAvailable ? true : false });
  }

  if (req.method === "POST" && req.body.type === "REGISTER") {
    try {
      const { num, pass } = req.body;
      const hash = bcrypt.hashSync(pass, 12);

      let user = await User.create({ num, password: hash, balance: 0 });
      res.json(user);
    } catch (e) {
      res.status(404).json({ message: e });
    }
  }

  if (req.method === "POST" && req.body.type === "LOGIN") {
    try {
      const { num, pass } = req.body;

      let user = await User.findOne({ num });

      if (!user || !bcrypt.compareSync(pass, user.password))
        res.status(301).json({ message: "Invalid number or password" });

      res.json(user);
    } catch (e) {
      res.status(404).json({ message: "Something went wrong" });
    }
  }
};
