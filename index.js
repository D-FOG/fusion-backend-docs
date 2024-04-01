const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route');
const adminRoutes = require('./routes/admin.route');
const builderRoutes = require('./routes/builderRoutes');
const hirerRoutes = require('./routes/hirerRoutes');
const advertiserRoutes = require('./routes/advertiserRoutes');
const paymentRoute = require('./routes/paymentRoute');
const chatRoute = require('./routes/chat.route');

dotenv.config(); // Load environment variables from .env file

const paystack = require('paystack')(process.env.Test_Secret_Key_Paystack);

const app = express();
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connected to database');
  })
  .catch(err => {
    console.error('Error connecting to database:', err);
  });

const redis = require('./config/redis');

const createRedisConnection = async () => {
  return new Promise((resolve, reject) => {
    redis.on('connect', () => {
      console.log('Connected to redis server');
      resolve(true);
    });
    redis.on('error', error => {
      console.log('error connecting to redis');
      reject(error);
    });
  });
};

createRedisConnection();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Fusion Api',
      version: '1.0.0',
      description: 'Fusion website'
    }
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.send('Welcome to the Fusion api, check the docs 👉👉👉 !');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api', adminRoutes);

// account setup routes
app.use('/api/builders', builderRoutes);
app.use('/api/hirers', hirerRoutes);
app.use('/api/advertisers', advertiserRoutes);
app.use('/api/chat', chatRoute);
//user payment route
app.use('/api/user', paymentRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
