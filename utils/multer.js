import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/media");
  },
  filename: (req, file, cb) => {
    const extenstion = file.originalname.split(".").pop();
    const originalName = file.originalname.split(".").shift();
    cb(null, originalName + "-" + Date.now() + "." + extenstion);
  },
});

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});
