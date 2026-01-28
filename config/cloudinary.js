const cloudinary = require('cloudinary').v2;

console.log('Cloudinary Config - Environment Variables:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? '***' : 'MISSING',
    api_key: process.env.CLOUDINARY_API_KEY ? '***' : 'MISSING',
    api_secret: process.env.CLOUDINARY_API_SECRET ? '***' : 'MISSING'
});

const config = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
};

if (!config.cloud_name || !config.api_key || !config.api_secret) {
    console.error('❌ ERROR: Missing required Cloudinary environment variables');
} else {
    console.log('✅ Cloudinary configuration is valid');
}

cloudinary.config(config);

module.exports = cloudinary;
