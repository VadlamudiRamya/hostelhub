// Seed initial data for development
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Student = require('./src/models/Student');
const Room = require('./src/models/Room');
const Notice = require('./src/models/Notice');
const Menu = require('./src/models/Menu');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Student.deleteMany({});
    await Room.deleteMany({});
    await Notice.deleteMany({});
    await Menu.deleteMany({});

    // Create admin user
    const adminUser = await User.create({
      email: 'admin@hostelhub.com',
      password: 'admin123',
      name: 'Admin Manager',
      role: 'admin'
    });
    console.log('✓ Admin user created');

    // Create student users
    const student1 = await User.create({
      email: 'arjun@example.com',
      password: 'student123',
      name: 'Arjun Kumar',
      role: 'student'
    });

    const student2 = await User.create({
      email: 'sneha@example.com',
      password: 'student123',
      name: 'Sneha Reddy',
      role: 'student'
    });

    const student3 = await User.create({
      email: 'rahul@example.com',
      password: 'student123',
      name: 'Rahul Verma',
      role: 'student'
    });
    console.log('✓ Student users created');

    // Create rooms
    const rooms = await Room.insertMany([
      { roomNo: '101', type: 'AC', capacity: 2, occupied: 2 },
      { roomNo: '102', type: 'AC', capacity: 2, occupied: 1 },
      { roomNo: '103', type: 'Non-AC', capacity: 3, occupied: 0 },
      { roomNo: '201', type: 'AC', capacity: 2, occupied: 1 },
      { roomNo: '202', type: 'Non-AC', capacity: 3, occupied: 2 },
      { roomNo: '203', type: 'AC', capacity: 2, occupied: 0 }
    ]);
    console.log('✓ Rooms created');

    // Create students with room assignments
    const students = await Student.insertMany([
      {
        name: 'Arjun Kumar',
        email: 'arjun@example.com',
        phone: '9876543210',
        course: 'B.Tech CSE',
        roomNo: '101',
        feesStatus: 'Paid',
        attendance: 95
      },
      {
        name: 'Sneha Reddy',
        email: 'sneha@example.com',
        phone: '9876543211',
        course: 'MBA',
        roomNo: '102',
        feesStatus: 'Pending',
        attendance: 88
      },
      {
        name: 'Rahul Verma',
        email: 'rahul@example.com',
        phone: '9876543212',
        course: 'B.Arch',
        roomNo: '101',
        feesStatus: 'Paid',
        attendance: 92
      }
    ]);
    console.log('✓ Students created');

    // Create notices
    const notices = await Notice.insertMany([
      {
        title: 'Important: Maintenance Scheduled',
        priority: 'urgent',
        message: 'Water supply maintenance will be done on Sunday 10 AM to 2 PM. Please plan accordingly.',
        date: new Date()
      },
      {
        title: 'Weekend Cultural Program',
        priority: 'normal',
        message: 'Join us for an exciting cultural program this Saturday at 6 PM in the main hall. All students welcome!',
        date: new Date(Date.now() - 86400000)
      },
      {
        title: 'Fees Submission Reminder',
        priority: 'urgent',
        message: 'Please submit pending fees by end of this month to avoid late charges.',
        date: new Date(Date.now() - 172800000)
      }
    ]);
    console.log('✓ Notices created');

    // Create weekly menu
    const menu = await Menu.insertMany([
      {
        day: 'Monday',
        breakfast: 'Bread, Butter, Jam',
        lunch: 'Rice, Dal Tadka, Curd, Pickle',
        snacks: 'Tea, Samosa',
        dinner: 'Roti, Mixed Vegetable Curry'
      },
      {
        day: 'Tuesday',
        breakfast: 'Eggs, Toast, Fruit',
        lunch: 'Jeera Rice, Dal, Salad',
        snacks: 'Tea, Biscuits',
        dinner: 'Rice, Chole Masala, Naan'
      },
      {
        day: 'Wednesday',
        breakfast: 'Poha, Sev, Onions',
        lunch: 'Pulao, Curd, Pickle',
        snacks: 'Coffee, Pakora',
        dinner: 'Dosa, Sambar, Chutney'
      },
      {
        day: 'Thursday',
        breakfast: 'Upma, Coconut Chutney',
        lunch: 'Lemon Rice, Dal, Salad',
        snacks: 'Milk, Snacks',
        dinner: 'Chapati, Mixed Vegetables'
      },
      {
        day: 'Friday',
        breakfast: 'Bread Omelette, Fruit',
        lunch: 'Egg Curry, Rice, Salad',
        snacks: 'Tea, Mirchi Bajji',
        dinner: 'Chicken Biryani (Special)'
      },
      {
        day: 'Saturday',
        breakfast: 'Masala Dosa, Sambhar',
        lunch: 'Tomato Bath, Curd',
        snacks: 'Coffee, Snacks',
        dinner: 'Roti, Dal, Vegetables'
      },
      {
        day: 'Sunday',
        breakfast: 'Aloo Paratha, Pickle',
        lunch: 'South Indian Thali',
        snacks: 'Tea, Cake',
        dinner: 'Pasta, Garlic Bread'
      }
    ]);
    console.log('✓ Menu created');

    console.log('\n✓ Database seeding completed successfully!');
    console.log('\nTest Credentials:');
    console.log('Admin: admin@hostelhub.com / admin123');
    console.log('Student 1: arjun@example.com / student123');
    console.log('Student 2: sneha@example.com / student123');
    console.log('Student 3: rahul@example.com / student123');

    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seed();
