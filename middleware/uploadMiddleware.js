import multer from "multer";
import path from "path";

// Storage location
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },

  filename(req, file, cb) {
    cb(
      null,
      `${Date.now()}-${file.originalname.replace(/\s/g, "")}`
    );
  },
});

// File type validation
function fileFilter(req, file, cb) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed (jpg, jpeg, png, webp)"));
  }
}

// Upload middleware
const upload = multer({
  storage,
  fileFilter,
});

export default upload;
