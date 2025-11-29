import multer from "multer";

/**
 * Middleware de upload para imagens de produtos
 */
export const uploadProdutoImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    // Validar tipos de arquivo permitidos
    const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Apenas arquivos de imagem são permitidos (JPEG, PNG, WebP, GIF)."
        )
      );
    }
  },
});
