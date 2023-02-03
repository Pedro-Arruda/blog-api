const router = require("express").Router();
const brcypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

router.post("/register", async (req, res) => {
  const { name, email, password, confirmpassword } = req.body;

  if (!name) {
    return res.status(400).json({ msg: "O nome é obrigatório!" });
  }
  if (!email) {
    return res.status(400).json({ msg: "O email é obrigatório!" });
  }
  if (!password) {
    return res.status(400).json({ msg: "A senha é obrigatória!" });
  }
  if (!confirmpassword) {
    return res.status(400).json({ msg: "A senha é obrigatória!" });
  }
  if (password !== confirmpassword) {
    return res.status(400).json({ msg: "As senhas são diferentes!" });
  }

  const userExists = await User.findOne({ email: email });

  if (userExists) {
    return res.status(400).json({ msg: "O email já está cadastrado!" });
  }

  const salt = await brcypt.genSalt(12);
  const passwordHash = await brcypt.hash(password, salt);

  const user = new User({
    name,
    email,
    password: passwordHash,
  });

  try {
    await user.save();

    res.status(200).json({ msg: "Usuário criado com sucesso!" });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ msg: "O email é obrigatório!" });
  }

  if (!password) {
    return res.status(400).json({ msg: "A senha é obrigatória!" });
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(400).json({ msg: "Usuário não encontrado!" });
  }

  const checkPassword = await brcypt.compare(password, user.password);

  if (!checkPassword) {
    return res.status(400).json({ msg: "Senha inválida!" });
  }

  try {
    const secret = process.env.SECRET;

    const token = jwt.sign(
      {
        id: user._id,
      },
      secret
    );

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

module.exports = router;
