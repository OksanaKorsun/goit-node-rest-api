import * as path from "node:path";
import * as crypto from "node:crypto";

import multer from "multer";
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(process.cwd(), "tmp"));
  },
  filename(req, file, cb) {
    const exname = path.extname(file.originalname);
    const basename = path.basename(file.originalname, exname);
    const syffix = crypto.randomUUID();
    cb(null, `${basename}_${syffix}${exname}`);
  },
});
console.log(path.join(process.cwd(), "tmp"));
export default multer({ storage });
