import ApiError from "../error/ApiError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, Basket } from "../models/models.js";

// const generateJvt = (id, email, role) => {
//     return jwt.sign({id: user.id, email, role}, process.env.SECRET_KEY, {expiresIn: "24h"})
// }

const generateJvt = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};

class UserController {
  async registration(req, res, next) {
    const { email, password, role } = req.body;

    //Проверка если пароль или емаил не ввели (пустое поле)
    if (!email || !password) {
      return next(ApiError.badRequest("Некорректный eemail или password"));
    }

    //Проверяет на наличие пользователя в БД (что бы не было одинаковых)
    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      return next(
        ApiError.badRequest("Пользователь с таким email уже существует")
      );
    }

    //Хэширование пароля с помощью функции bcrypt (5 - кол-во хеширований)
    const hashPassword = await bcrypt.hash(password, 5);
    const user = await User.create({ email, role, password: hashPassword });
    const basket = await Basket.create({ userId: user.id });
    const token = generateJvt(user.id, user.email, user.role);
    return res.json({ token });
  }

  //Хэширование пароля с помощью функции bcrypt (5 - кол-во хеширований)
  //  const hashPassword = await bcrypt.hash(password, 5)
  //  const user = await User.create({email, role, password: hashPassword})
  //  const basket = await Basket.create({userId: user.id})
  //  const token = generateJvt(
  //      { id: user.id, email, role },
  //      process.env.SECRET_KEY,
  //      {expiresIn: "24h"}
  //      )
  // const token = generateJvt({id: user.id, email, role}, rocess.env.SECRET_KEY,{expiresIn: '24h'})
  //  return res.json({token})

  async login(req, res, next) {
    const { email, password } = req.body; //делаем диструктуризацию
    const user = await User.findOne({ where: { email } }); //получаем пользователя

    if (!user) {
      //если пользователь не найден, то ошибка
      return next(ApiError.internal("Пользователь с таким именем не найден"));
    }

    //Если ошибки нет то сравниваем пароли с помощью функции bcrypt (первым параметром передается пароль который написал пользователь, а второй - с БД)
    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      //Если пароли не совпадают, то ошибка
      return next(ApiError.internal("Указан неверный пароль"));
    }
    //если все нормально, генерируем токен с помощью функции generateJvt
    const token = generateJvt(user.id, user.email, user.role);
    return res.json({ user, token }); //возвращаем на клиент сам токен
  }

  async check(req, res, next) {
    const token = generateJvt(req.user.id, req.user.email, req.user.role);
    return res.json({ token });
  }
}

export const userController = new UserController();
