import * as Yup from 'yup';
import { parseISO, startOfDay, endOfDay } from 'date-fns';
import { Sequelize } from 'sequelize';

import Appointment from '../models/Appointments';
import User from '../models/User';

class ScheduleController {
  async index(req, res) {
    const checkUserProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkUserProvider) {
      return res.status(401).json({ error: 'You arent a provider.' });
    }

    const schema = Yup.object().shape({
      page: Yup.number().min(1),
    });

    if (!(await schema.isValid(req.query))) {
      return res.status(400).json({ error: 'Query fails.' });
    }

    const { page = 1, limit = 20, date = new Date() } = req.query;
    const parsedDate = parseISO(date);
    const { Op } = Sequelize;

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        date: { [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)] },
        canceled_at: null,
      },
      order: ['date'],
      limit,
      offset: (page - 1) * limit,
    });

    return res.json(appointments);
  }
}

export default new ScheduleController();
