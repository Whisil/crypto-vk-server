import fs from "fs";

export const fileDelete = (path) => {
  const filePath = path.split(`/`);

  fs.unlink(
    __dirname + `/public/media/${filePath[filePath.length - 1]}`,
    (err) => {
      if (err) throw err;
    }
  );
};
