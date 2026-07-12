const mongoose = require('mongoose');

let mongoServer;

const connectDB = async () => {
  try {
    let dbUrl = process.env.MONGODB_URI;

    // Fallback to in-memory server if MongoDB URI isn't configured
    if (!dbUrl) {
      console.log('No MONGODB_URI found. Starting mongodb-memory-server...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoServer = await MongoMemoryServer.create();
      dbUrl = mongoServer.getUri();
    }

    const conn = await mongoose.connect(dbUrl);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database URI: ${dbUrl}`);

    // Programmatic Seeding Check
    const User = require('../models/User');
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Database is empty. Populating mock seed data...');
      const { seedData } = require('../utils/seed');
      // Pass false to prevent calling process.exit(0)
      await seedData(false);
      console.log('Programmatic seeding completed successfully!');
    } else {
      console.log('Database already has data. Skipping seeding.');
    }

  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Attempting to start in-memory MongoDB database backup...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoServer = await MongoMemoryServer.create();
      const backupUri = mongoServer.getUri();
      await mongoose.connect(backupUri);
      console.log('Connected to Backup In-Memory Database!');
      
      const User = require('../models/User');
      const { seedData } = require('../utils/seed');
      await seedData(false);
      console.log('Backup programmatic seeding completed!');
    } catch (innerError) {
      console.error(`Fallback connection failed: ${innerError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
