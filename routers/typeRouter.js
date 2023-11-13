import { Router } from 'express'
import {typeController} from '../controllers/typeController.js'
import chekRole from '../middlewere/chekRoleMiddlewere.js'

const router = new Router()

router.post('/', chekRole('ADMIN'), typeController.create)
router.get('/', typeController.getAll)

export default router