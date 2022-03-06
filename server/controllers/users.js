const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//const config = require('config');
const { validationResult } = require('express-validator');

const User = require('../models/User');

// Register User
const registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({
            errors: errors.array(),
        });

    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({
            $or: [
                {
                    email,
                },
                {
                    username,
                },
            ],
        });

        if (user)
            return res.status(400).json({
                errors: [
                    {
                        msg: 'User already Exists. Please check your email & username',
                    },
                ],
            });

        user = new User({
            username,
            email,
            password,
        });

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);
        await user.save();

        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(payload, "facebookClonesecretjwt", (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
};
const updateUser = (async (req, res) => {
    console.log(req.body._id)
    console.log(req.params.id)
    if (req.body._id === req.params.id) {
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }
      try {
        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedUser);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can update only your account!");
    }
  });
module.exports = { registerUser,updateUser };
