import { User, cookies } from "@/database";
import { serverAsync } from "@/helpers/asyncHandler";

const handler = (req, res) =>
  serverAsync(res, async () => {
    await connectMongo();
    const id = cookies.getCookie(req, res);

    await User.findByIdAndDelete(id).catch(() => {
      throw Error("Something went wrong");
    });
    res.json({ message: "Deleted Successfully" });
  });

export default handler;
