import User from '../models/User';

class UserController {
  async store(req, res) {
    let user = await User.findOne({ where: { email: req.body.email } });

    if (user) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    user = await User.create(req.body);

    return res.json(user);
  }

  async list(req, res) {
    const users = await User.findAll();

    res.json(users);
  }

  async update(req, res) {
    console.log(req.userId);

    return res.json({ ok: true });
  }
}

export default new UserController();
