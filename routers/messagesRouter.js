import { Router } from 'express'
import {messagesController} from '../controllers/messagesController.js'

const router = new Router()


router.get('/', messagesController.getMessages)
router.get('/:id', messagesController.getMessageById)
router.post('/', messagesController.create)
router.delete('/:id', messagesController.deleteMessage)


export default router
