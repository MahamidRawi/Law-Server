const dev = {
    API_BASE_URL: 'http://localhost:3200',
};

const prod = {
    API_BASE_URL: 'https://yourproductionapi.com',
};

const config = process.env.NODE_ENV === 'development' ? dev : prod;

export default config;