const { sequelize, User, Habit, Achievement } = require('./models');
const bcrypt = require('bcryptjs');

async function seed() {
  console.log('Syncing database (force: true)...');
  await sequelize.sync({ force: true });
  
  console.log('Seeding data...');

  const passwordHash = await bcrypt.hash('password123', 10);

  // Create Users
  const alice = await User.create({
    username: 'alice',
    displayName: 'Alice',
    passwordHash,
    profilePic: 'Alice',
    bio: 'Đam mê đọc sách và chạy bộ'
  });

  const bob = await User.create({
    username: 'bob',
    displayName: 'Bob',
    passwordHash,
    profilePic: 'Bob',
    bio: 'Code mỗi ngày!'
  });

  const charlie = await User.create({
    username: 'charlie',
    displayName: 'Charlie',
    passwordHash,
    profilePic: 'Charlie',
    bio: 'Người đam mê thể hình'
  });

  // Create Habits
  const aliceHabit = await Habit.create({
    userId: alice.id,
    name: 'Đọc 20 trang sách',
    description: 'Đọc sách mỗi ngày để mở mang kiến thức',
    datesDone: JSON.stringify(['2023-10-01', '2023-10-02'])
  });

  const bobHabit = await Habit.create({
    userId: bob.id,
    name: 'Code 1 tiếng',
    description: 'Phát triển dự án cá nhân',
    datesDone: JSON.stringify(['2023-10-02'])
  });
  
  const charlieHabit = await Habit.create({
    userId: charlie.id,
    name: 'Tập Gym',
    description: 'Nâng tạ và rèn luyện sức khoẻ',
    datesDone: JSON.stringify(['2023-10-03'])
  });

  // Create bulk achievements for feed testing
  const achievements = [];
  
  // We'll generate 40 posts spread over the last few days to test infinite scroll
  for (let i = 1; i <= 40; i++) {
    const user = i % 3 === 0 ? alice : (i % 3 === 1 ? bob : charlie);
    const habitName = i % 3 === 0 ? aliceHabit.name : (i % 3 === 1 ? bobHabit.name : charlieHabit.name);
    
    // Spread the dates out into the past so they order properly
    const date = new Date();
    date.setHours(date.getHours() - i * 3); // Every post is 3 hours apart
    
    const comments = [
      'Hôm nay mình đã hoàn thành mục tiêu rồi!',
      'Vẫn đang giữ vững phong độ!',
      'Mệt nhưng mà vui vì đã hoàn thành!',
      'Một ngày nữa lại trôi qua với thói quen tốt.',
      'Không thể tin là mình đã kiên trì được tới hôm nay!'
    ];
    
    achievements.push({
      userId: user.id,
      habitName: habitName,
      streak: Math.floor(i / 3) + 1,
      comment: comments[i % comments.length],
      cheers: Math.floor(Math.random() * 30),
      createdAt: date,
      updatedAt: date
    });
  }

  await Achievement.bulkCreate(achievements);
  
  console.log('====================================');
  console.log('✅ Seeding completed successfully!');
  console.log('👥 Created 3 users: Alice, Bob, Charlie');
  console.log('🔑 Password for all users: password123');
  console.log('🏆 Created 40 achievements for Feed infinite scroll testing.');
  console.log('====================================');
}

seed().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
