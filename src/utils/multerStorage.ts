// import { diskStorage } from 'multer';
// import { join } from 'path';

// export const multerConfig = {
//   storage: diskStorage({
//     destination: join(__dirname, '..', 'uploads'),
//     filename: (req, file, cb) => {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//       cb(null, `${uniqueSuffix}-${file.originalname}`);
//     },
//   }),
// };
