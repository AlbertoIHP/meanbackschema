import { success, notFound } from '../../services/response/'
import { Activities } from '.'
import { User } from '../user'
import { Courses } from '../courses'
import { Gardens } from '../gardens'
import { Tags } from '../tags'

export const create = ({ bodymen: { body } }, res, next) =>
  Activities.create(body)
    .then((activities) => activities.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Activities.count(query)
    .then(count => Activities.find(query, select, cursor)
      .then((activities) => ({
        count,
        rows: activities.map((activities) => activities.view())
      }))
    )
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Activities.findById(params.id)
    .then(notFound(res))
    .then((activities) => activities ? activities.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  Activities.findById(params.id)
    .then(notFound(res))
    .then((activities) => activities ? Object.assign(activities, body).save() : null)
    .then((activities) => activities ? activities.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  Activities.findById(params.id)
    .then(notFound(res))
    .then((activities) => activities ? activities.remove() : null)
    .then(success(res, 204))
    .catch(next)



/**
**  Este metodo busca en la base de datos todas las actividades de un curso
**/


export const getActivitiesByCourseId = ({ params }, res, next) => 
  Activities.find().where('course_id')
    .equals(params.id)
    .then(notFound(res))
    .then( async function( activities )
    {
      let respuesta = { courseActivities: activities.map((activities) => activities.view()) }

       for( let i = 0 ; i < respuesta.courseActivities.length ; i ++ )
       {
         await Courses.findById( respuesta.courseActivities[i].course_id ).then( (courses) => {

            respuesta.courseActivities[i].course_id = courses.view()

            User.findById( respuesta.courseActivities[i].createdBy_id ).then( (user) => {
                    respuesta.courseActivities[i].createdBy_id = user.view()

                })


            Gardens.findById( respuesta.courseActivities[i].course_id.garden_id ).then( (gardens) => {
                respuesta.courseActivities[i].course_id.garden_id = gardens.view()


              })

            User.findById( respuesta.courseActivities[i].course_id.teacher_id ).then( (user) => {
              respuesta.courseActivities[i].course_id.teacher_id = user.view()
            })


          })     
       }

       return  respuesta  

    })
    .then(success(res))
    .catch(next)



export const getActivitiesByDate = ({ params }, res, next) => 
  Activities.find()
    .then(notFound(res))
    .then( async function( activities ) {

      let respuesta = { dateActivities: activities.map((activities) => activities.view()) }
      
      let courseId = params.id.split('&')[0]
      let date = params.id.split('&')[1]

      let activitiesArray = respuesta.dateActivities


      let filteredActivities = activitiesArray.filter( activity => activity.course_id === courseId )


      filteredActivities = filteredActivities.filter( activity => JSON.stringify(activity.createdAt).split('T')[0].split('"')[1] ===  date  )


      for( let activity of filteredActivities )
      {


            await Tags.find().where('activity_id').equals( activity.id ).then( (tags) => {
              activity.tags = tags
            })

            await User.findById( activity.createdBy_id ).then( (user) => {
              activity.createdBy_id = user.view()
            })

      }

      return { fileteredActivities: filteredActivities }     
    })
    .then(success(res))
    .catch(next)