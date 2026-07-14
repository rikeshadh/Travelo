require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const SupportMessage = require('../models/SupportMessage');
const Notification = require('../models/Notification');

const seedData = async (shouldExit = true) => {
  try {
    // Clear existing collections
    await User.deleteMany();
    await Property.deleteMany();
    await Booking.deleteMany();
    await Review.deleteMany();
    await SupportMessage.deleteMany();
    await Notification.deleteMany();
    console.log('Cleared existing data.');

    // Seed Users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const adminUser = await User.create({
      name: 'Travelo Admin',
      email: 'admin@travelo.com',
      password: 'password123',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80'
    });

    const regularUser = await User.create({
      name: 'John Doe',
      email: 'user@travelo.com',
      password: 'password123',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80'
    });

    console.log('Seeded Users (Admin: admin@travelo.com, User: user@travelo.com)');

    // Seed Properties
    const propertiesData = [
      {
        title: 'Serene Peak Lodge',
        description: 'Experience majestic views of the Himalayas right from your bed. This lodge offers premium comfort, warm fireplaces, and direct access to hiking routes near Mt. Everest.',
        propertyType: 'hotel',
        pricePerNight: 120,
        location: {
          address: 'Namche Bazaar, Everest Trail',
          city: 'Solukhumbu',
          country: 'Nepal',
          lat: 27.8066,
          lng: 86.714
        },
        imageGallery: [
          'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80'
        ],
        amenities: ['Wifi', 'Heating', 'Hot Tub', 'Breakfast', 'Fireplace'],
        ratings: { average: 4.8, count: 2 },
        host: {
          name: 'Nima Sherpa',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
          bio: 'Mountaineer and local guide with 15 years hosting experience.',
          email: 'nima@travelo.com'
        },
        availability: []
      },
      {
        title: 'Pristine Ocean Villa',
        description: 'Beautiful over-water villa with glass floor view, infinity pool, and private lagoon access. Watch spectacular sunsets right from your balcony.',
        propertyType: 'villa',
        pricePerNight: 350,
        location: {
          address: 'Seminyak Beachfront 21',
          city: 'Bali',
          country: 'Indonesia',
          lat: -8.6981,
          lng: 115.1628
        },
        imageGallery: [
          'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=600&q=80'
        ],
        amenities: ['Pool', 'Wifi', 'Air Conditioning', 'Kitchen', 'Beach Access'],
        ratings: { average: 4.9, count: 1 },
        host: {
          name: 'Made Astina',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
          bio: 'Passionate surfer and beach property host.',
          email: 'made@travelo.com'
        },
        availability: []
      },
      {
        title: 'Phewa Lakeside Apartment',
        description: 'Modern 2-bedroom apartment with panoramic views of Phewa Lake and the Annapurna range. Fully equipped kitchen, fast internet, and quiet workspace.',
        propertyType: 'apartment',
        pricePerNight: 65,
        location: {
          address: 'Lakeside Road, Ward 6',
          city: 'Pokhara',
          country: 'Nepal',
          lat: 28.2096,
          lng: 83.9584
        },
        imageGallery: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80'
        ],
        amenities: ['Wifi', 'Kitchen', 'Air Conditioning', 'Washing Machine', 'Balcony'],
        ratings: { average: 4.6, count: 1 },
        host: {
          name: 'Kiran Gurung',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
          bio: 'Loves sharing the beauty of Pokhara with travelers.',
          email: 'kiran@travelo.com'
        },
        availability: []
      },
      {
        title: 'Cozy Redwood Cabin',
        description: 'Nestled deep in the ancient redwood forest, this cozy A-frame cabin features a rustic wooden exterior with luxury amenities, including an outdoor wood-fired hot tub.',
        propertyType: 'cabin',
        pricePerNight: 145,
        location: {
          address: 'Forest Trail Road 44',
          city: 'Oregon',
          country: 'United States',
          lat: 44.0582,
          lng: -121.3153
        },
        imageGallery: [
          'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&w=600&q=80'
        ],
        amenities: ['Fireplace', 'Hot Tub', 'Wifi', 'Heating', 'Kitchen'],
        ratings: { average: 4.7, count: 1 },
        host: {
          name: 'Sarah Miller',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
          bio: 'Nature enthusiast and writer who loves cabin life.',
          email: 'sarah@travelo.com'
        },
        availability: []
      },
      {
        title: 'Elysium Luxury Resort',
        description: 'An all-inclusive premium resort located on a private cliffside overlooking the Aegean Sea. Fine dining, private spa, and customized tours included.',
        propertyType: 'resort',
        pricePerNight: 420,
        location: {
          address: 'Oia Cliffway 500',
          city: 'Santorini',
          country: 'Greece',
          lat: 36.4618,
          lng: 25.3753
        },
        imageGallery: [
          'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80'
        ],
        amenities: ['Pool', 'Wifi', 'Breakfast', 'Air Conditioning', 'Gym', 'Spa'],
        ratings: { average: 4.9, count: 1 },
        host: {
          name: 'Eleni Papadopoulou',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
          bio: 'Hotelier dedicating my life to luxury service.',
          email: 'eleni@elysium.com'
        },
        availability: []
      },
      {
        title: 'Kyoto Machiya Traditional House',
        description: 'Immerse yourself in history inside this beautifully restored 100-year-old Machiya town house. Located in the heart of Gion, featuring tatami rooms, sliding shoji paper doors, and a serene inner garden.',
        propertyType: 'apartment',
        pricePerNight: 160,
        location: {
          address: 'Gion-machi Minamigawa 570',
          city: 'Kyoto',
          country: 'Japan',
          lat: 35.0037,
          lng: 135.7782
        },
        imageGallery: [
          'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=600&q=80'
        ],
        amenities: ['Wifi', 'Kitchen', 'Heating', 'Air Conditioning', 'Garden'],
        ratings: { average: 4.8, count: 1 },
        host: {
          name: 'Takashi Sato',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          bio: 'Preserving traditional Kyoto heritage and culture.',
          email: 'takashi@travelo.com'
        },
        availability: []
      },
      {
        title: 'Safari Glamping Tent',
        description: 'Experience the wild in style. Sleep under luxury canvas tents in the Maasai Mara safari trails. Enjoy bonfire dinners, daily safari drives, and breathtaking wildlife viewings right from your tent deck.',
        propertyType: 'cabin',
        pricePerNight: 280,
        location: {
          address: 'Maasai Mara National Reserve Safari Camp 3',
          city: 'Maasai Mara',
          country: 'Kenya',
          lat: -1.5281,
          lng: 35.1968
        },
        imageGallery: [
          'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=600&q=80'
        ],
        amenities: ['Wifi', 'Breakfast', 'Hot Tub', 'Pool', 'Tour Guide'],
        ratings: { average: 4.9, count: 1 },
        host: {
          name: 'Emmanuel Kiprop',
          avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=150&q=80',
          bio: 'Wildlife expert, born and raised in Maasai Mara.',
          email: 'emmanuel@travelo.com'
        },
        availability: []
      },
      {
        title: 'Parisian Chic Loft',
        description: 'Stay in style in this bright and elegant loft in Le Marais. Featuring modern architecture, historical structural beams, a library, and close access to local cafes, boutiques, and art galleries.',
        propertyType: 'hotel',
        pricePerNight: 195,
        location: {
          address: 'Rue de Rivoli 88',
          city: 'Paris',
          country: 'France',
          lat: 48.8566,
          lng: 2.3522
        },
        imageGallery: [
          'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1499955085172-a104c9463ece?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80'
        ],
        amenities: ['Wifi', 'Kitchen', 'Air Conditioning', 'Heating', 'Breakfast'],
        ratings: { average: 4.7, count: 1 },
        host: {
          name: 'Chantal Dubois',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
          bio: 'Interior designer and art lover hosting in Gion and Paris.',
          email: 'chantal@travelo.com'
        },
        availability: []
      }
    ];

    const properties = await Property.create(propertiesData);
    console.log('Seeded properties!');

    // Seed Reviews
    await Review.create([
      {
        propertyId: properties[0]._id,
        userId: regularUser._id,
        userName: regularUser.name,
        userAvatar: regularUser.avatar,
        rating: 5,
        comment: 'Absolutely breathtaking! The view from the room is unforgettable, and the Sherpa hospitality was amazing.'
      },
      {
        propertyId: properties[0]._id,
        userId: adminUser._id,
        userName: adminUser.name,
        userAvatar: adminUser.avatar,
        rating: 4,
        comment: 'Nice place, a bit cold during night but heaters were provided. Strongly recommended for trekkers!'
      },
      {
        propertyId: properties[1]._id,
        userId: regularUser._id,
        userName: regularUser.name,
        userAvatar: regularUser.avatar,
        rating: 5,
        comment: 'Stunning beachfront! Swimming in the infinity pool while looking at the sunset was heaven.'
      },
      {
        propertyId: properties[2]._id,
        userId: regularUser._id,
        userName: regularUser.name,
        userAvatar: regularUser.avatar,
        rating: 4,
        comment: 'Great value for money, perfect location near lakeside cafés. The kitchen is fully equipped.'
      },
      {
        propertyId: properties[3]._id,
        userId: regularUser._id,
        userName: regularUser.name,
        userAvatar: regularUser.avatar,
        rating: 5,
        comment: 'The hot tub under the stars was incredible! Clean, isolated and very peaceful.'
      },
      {
        propertyId: properties[4]._id,
        userId: regularUser._id,
        userName: regularUser.name,
        userAvatar: regularUser.avatar,
        rating: 5,
        comment: 'Unbelievable customer service and views. Every cent was worth it!'
      }
    ]);
    console.log('Seeded reviews!');

    // Seed mock bookings
    const bookingsData = [
      {
        propertyId: properties[0]._id,
        userId: regularUser._id,
        checkInDate: '2026-08-01',
        checkOutDate: '2026-08-05',
        guests: { adults: 2, children: 0, pets: false },
        totalPrice: 480,
        paymentStatus: 'paid',
        bookingStatus: 'confirmed',
        guestDetails: {
          name: 'John Doe',
          email: 'user@travelo.com',
          phone: '+977-9876543210'
        }
      },
      {
        propertyId: properties[2]._id,
        userId: regularUser._id,
        checkInDate: '2026-08-10',
        checkOutDate: '2026-08-15',
        guests: { adults: 1, children: 1, pets: false },
        totalPrice: 325,
        paymentStatus: 'paid',
        bookingStatus: 'confirmed',
        guestDetails: {
          name: 'John Doe',
          email: 'user@travelo.com',
          phone: '+977-9876543210'
        }
      }
    ];

    await Booking.create(bookingsData);
    console.log('Seeded bookings!');

    // Update availability array for properties based on bookings
    properties[0].availability.push('2026-08-01', '2026-08-02', '2026-08-03', '2026-08-04', '2026-08-05');
    properties[2].availability.push('2026-08-10', '2026-08-11', '2026-08-12', '2026-08-13', '2026-08-14', '2026-08-15');
    await properties[0].save();
    await properties[2].save();
    console.log('Updated property blocked availability dates!');

    // Add support messages history
    await SupportMessage.create([
      {
        userId: regularUser._id,
        userName: regularUser.name,
        message: 'Hi, I would like to know if there is an airport shuttle to Namche Bazaar?',
        sender: 'user'
      },
      {
        userId: regularUser._id,
        userName: regularUser.name,
        message: 'Hello John! Helicopters are available, but most travelers trek from Lukla airport. We can arrange a helper/porter for you.',
        sender: 'admin'
      }
    ]);

    // Add notifications
    await Notification.create([
      {
        userId: regularUser._id,
        message: 'Your booking for Phewa Lakeside Apartment is confirmed!',
        link: '/dashboard',
        read: false
      },
      {
        userId: regularUser._id,
        message: 'Welcome to Travelo! Complete your profile for better experience.',
        link: '/dashboard',
        read: true
      }
    ]);
    console.log('Seeded chat & notifications!');

    console.log('Database Seeding Completed Successfully!');
    if (shouldExit) process.exit(0);
  } catch (error) {
    console.error('Error during seeding database: ', error);
    if (shouldExit) process.exit(1);
  }
};

// If run directly via node CLI
if (require.main === module) {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/travelo')
    .then(() => {
      console.log('Connected directly to MongoDB for seeding...');
      seedData(true);
    })
    .catch(err => {
      console.error('Direct connection failed: ', err);
      process.exit(1);
    });
}

module.exports = { seedData };
