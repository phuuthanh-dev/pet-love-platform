// Lấy giá trị của NODE_ENV từ biến môi trường
const nodeEnv = process.env.NODE_ENV || 'development';
console.log('NODE_ENV:', nodeEnv); // Để kiểm tra giá trị của NODE_ENV

const allowedOrigins = ['https://pet-love-platform.vercel.app'];

// Cấu hình CORS
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('❌ Blocked by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true, // Nếu cần gửi cookie hoặc header xác thực
    allowedHeaders: ['Content-Type', 'Authorization'],
};

module.exports = corsOptions;
