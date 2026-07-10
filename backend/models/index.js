const { Sequelize, DataTypes } = require('sequelize');

const storagePath = process.env.DB_STORAGE_PATH || './dev.db';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: storagePath,
  logging: false
});

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  displayName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  profilePic: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true // adds createdAt, updatedAt
});

const Achievement = sequelize.define('Achievement', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  habitName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  streak: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  userInfo: {
    type: DataTypes.TEXT, // Store JSON as string
    allowNull: true
  },
  cheers: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true // adds createdAt, updatedAt
});

const Habit = sequelize.define('Habit', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  datesDone: {
    type: DataTypes.TEXT, // Store JSON array as string
    allowNull: true,
    defaultValue: '[]'
  }
}, {
  timestamps: true // adds createdAt, updatedAt
});

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  timestamps: true
});

// Relationships
User.hasMany(Achievement, { foreignKey: 'userId', as: 'achievements' });
Achievement.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Habit, { foreignKey: 'userId', as: 'habits', onDelete: 'CASCADE' });
Habit.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Comment, { foreignKey: 'userId', as: 'comments', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Achievement.hasMany(Comment, { foreignKey: 'achievementId', as: 'comments', onDelete: 'CASCADE' });
Comment.belongsTo(Achievement, { foreignKey: 'achievementId', as: 'achievement' });

module.exports = {
  sequelize,
  User,
  Achievement,
  Habit,
  Comment
};
