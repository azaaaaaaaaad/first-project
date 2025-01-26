import { Router } from 'express'
import { StudentRoutes } from '../modules/student/student.route'
import { UserRoutes } from '../modules/user/user.router'

const router = Router()


const moduleRoutes = [
    {
        path:'/users',
        route: UserRoutes
    },
    {
        path:'/students',
        route: StudentRoutes
    }
]

moduleRoutes.map(route => router.use(route.path, route.route))


export default  router;
