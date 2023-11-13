//Валидация токена
import jwt from 'jsonwebtoken'


const authMiddlewere = function (req, res, next){
    if (req.method === "OPTIONS") {
        next()

    }
    try{
        const token = req.headers.authorization.split(' ')[1] //тип токена (Bearer), сам токен (fghjkgh) 
        if (!token){
            return res.status(401).json({message: 'Пользователь не авторизован'})
        }

        //Декодируем вебтокен 
        const decoded = jwt.verify(token, process.env.SECRET_KEY)//проверяем на валидность (первый параметр -сам токен, второй - секретный код)
        req.user = decoded
        next()
    
    } catch (e) {
        res.status(401).json({message: 'Пользователь не авторизован'})
    }
}
export default authMiddlewere