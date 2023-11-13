import {Messages} from '../models/models.js'
import ApiError from '../error/ApiError.js'
import * as uuid from 'uuid'
import * as path from 'path'
import FileService from '../services/fileService.js'


class MessagesController{

    async getMessages(req, res){
        const messages = await Messages.findAll()
        return res.json(messages)
    }

    async getMessageById(req, res){
        const {id} = req.params
        const message = await Messages.findOne(
            {
                where: {id},
            }, 
        )
        return res.json(message)
    }

    async create(req, res, next){
         try{
            const img = FileService.save(req.files?.img) ?? ''
            const {id, type, author, text, date} = req.body;
            const message = await Messages.create({id, type, author, text, date, img})
            return res.json(message) //возвращаем информацию на клиент
             //let fileName = uuid.v4 + ".jpg";
            //img.mv(path.resolve(__dirname, '..', 'static', fileName)) //прописываем путь к файлу
            //img.mv('../') //прописываем путь к файлу
            //const products = await Product.create({name, discription, discount, stock, price, image, image2, rating, tags})
           // img.mv(path.resolve(__dirname, '..', 'static', fileName))
        } catch (e) {
            next(ApiError.badRequest(e.message)) //обработка ошибки
        }
    }

    async deleteMessage (req, res){
        try {
          const {id} = req.params
      
          const message = await Messages.destroy(
            {
                where: {id},
            }, 
          ).then(function(rowDeleted){
            if(rowDeleted === id){
               console.log('Deleted successfully');
             }
            })
          return res.sendStatus(204)
        } catch (error) {
          return res.sendStatus(500)
        }
      }

    }




export const messagesController = new MessagesController