require('dotenv').config()
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: {
          msg: 'Please enter your name'
        },
        len: {
          args: [3, 100],
          msg: 'Name must start with a letter, have no spaces, and be atleast 3 characters and less than 100 characters'
        },
      }
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      trim: true,
      unique: {
        args: true,
        msg: 'Email already exists.'
      },
      validate: {
        notNull: {
          msg: 'Please enter your email'
        },
        isEmail: {
          args: true,
          msg: 'The email you entered is invalid or is already in our system.'
        },
        max: {
          args: 254,
          msg: 'The email you entered is invalid or longer than 254 characters.'
        },
      },
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: {
          msg: 'Please enter your password'
        },
        isNotShort: (value) => {
          if (value.length < 9) {
            throw new Error('Password should be at least 8 characters');
          }
        },
      },
    },
  }, {});

  User.associate = (models) => {
    // associations can be defined here

  };

  User.beforeCreate(async (user, options) => {
    user.password = await bcrypt.hash(user.password, 8)
  })

  User.beforeUpdate(async (user, options) => {
    user.password = await bcrypt.hash(user.password, 8)
  })

  User.authenticate = async ({email, password}) => {
    // validate user email
    const user = await User.findOne({ where: { email: email }});
    if(!user) throw 'Invalid credentials.';

    // validate user password
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) throw 'Invalid credentials.';

    return user;
  };

  User.prototype.authToken = id => {
    return jwt.sign({ sub: id },process.env.JWT_ACC_ACTIVATE,{ expiresIn: '7d' });
  };

  return User;
};