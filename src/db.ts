import path from "path";
import { readFileSync } from "fs";
import { writeFile as writeFileAsync } from "fs/promises";

import { User, City } from "./types";

type Data = {
   users: User[];
   cities: City[];
};

interface DB {
   file: string;
   data: Data;
   admin: User;
   read: () => Data;
   save: () => void;
}

const DB: DB = {
   file: path.join(__dirname, "..", "db.json"),
   data: undefined as any,
   admin: undefined as any,
   read: function () {
      const raw = readFileSync(this.file, "utf-8");
      this.data = JSON.parse(raw);
      this.admin = this.data.users.find((x) => x.isAdmin === true)!;
      return this.data;
   },
   save: function () {
      writeFileAsync(this.file, JSON.stringify(this.data, null, 2));
   },
};

export default DB;
