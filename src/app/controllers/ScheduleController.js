import * as Yup from 'yup';
import { parseISO, startOfDay } from 'date-fns';

import { Sequelize } from 'sequelize';
import Appointment from '../models/Appointments';
import User from '../models/User';
import File from '../models/File';

class ScheduleController {
  async index(req, res) {
    const schema = Yup.object().shape({
      page: Yup.number().min(1),
    });

    if (!(await schema.isValid(req.query))) {
      return res.status(400).json({ error: 'Query fails.' });
    }

    const { page = 1, limit = 20, date = new Date() } = req.query;
    const dateStart = startOfDay(parseISO(date));
    const { Op } = Sequelize;

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        date: { [Op.gte]: dateStart },
        canceled_at: null,
      },
      order: ['date'],
      attributes: ['id', 'date'],
      limit,
      offset: (page - 1) * limit,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: {
            model: File,
            as: 'avatar',
            attributes: ['id', 'path', 'url'],
          },
        },
      ],
    });

    return res.json(appointments);
  }
}

export default new ScheduleController();
