import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { master, token } from '../../services/passport'
import { create, index, show, update, destroy, getActivitiesByCourseId, getActivitiesByDate } from './controller'
import { schema } from './model'
export Activities, { schema } from './model'

const router = new Router()
const { name, description, createdBy_id, course_id, urlPhoto, activityType } = schema.tree

/**
 * @api {post} /activities Create activities
 * @apiName CreateActivities
 * @apiGroup Activities
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiParam createdAt Activities's createdAt.
 * @apiParam description Activities's description.
 * @apiParam createdBy_id Activities's createdBy_id.
 * @apiParam course_id Activities's course_id.
 * @apiSuccess {Object} activities Activities's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Activities not found.
 * @apiError 401 master access only.
 */
router.post('/',
  master(),
  body({ name, description, createdBy_id, course_id, urlPhoto, activityType }),
  create)

/**
 * @api {get} /activities Retrieve activities
 * @apiName RetrieveActivities
 * @apiGroup Activities
 * @apiParam {String} access_token admin access token.
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of activities.
 * @apiSuccess {Object[]} rows List of activities.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 admin access only.
 */
router.get('/',
  token({ required: true}),
  query(),
  index)

/**
 * @api {get} /activities/:id Retrieve activities
 * @apiName RetrieveActivities
 * @apiGroup Activities
 * @apiParam {String} access_token admin access token.
 * @apiSuccess {Object} activities Activities's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Activities not found.
 * @apiError 401 admin access only.
 */
router.get('/:id',
  token({ required: true}),
  show)

/**
 * @api {put} /activities/:id Update activities
 * @apiName UpdateActivities
 * @apiGroup Activities
 * @apiParam {String} access_token admin access token.
 * @apiParam createdAt Activities's createdAt.
 * @apiParam description Activities's description.
 * @apiParam createdBy_id Activities's createdBy_id.
 * @apiParam course_id Activities's course_id.
 * @apiSuccess {Object} activities Activities's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Activities not found.
 * @apiError 401 admin access only.
 */
router.put('/:id',
  token({ required: true}),
  body({ name, description, createdBy_id, course_id, urlPhoto, activityType }),
  update)

/**
 * @api {delete} /activities/:id Delete activities
 * @apiName DeleteActivities
 * @apiGroup Activities
 * @apiParam {String} access_token admin access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Activities not found.
 * @apiError 401 admin access only.
 */
router.delete('/:id',
  token({ required: true}),
  destroy)


/**
 * @api {get} /activities/getcourseactivities/:id Retrieve all activities of a course
 * @apiName Course Activities retrieve
 * @apiGroup Activities
 * @apiParam {String} access_token admin access token.
 * @apiSuccess {Object} activities Activities's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Activities not found.
 * @apiError 401 admin access only.
 */
router.get('/getcourseactivities/:id',
  token({ required: true}),
  getActivitiesByCourseId)

/**
 * @api {get} /activities/getactivitiesbydate/:id Retrieve all activities of a course
 * @apiName Course Activities retrieve
 * @apiGroup Activities
 * @apiParam {String} access_token admin access token.
 * @apiSuccess {Object} activities Activities's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Activities not found.
 * @apiError 401 admin access only.
 */
router.get('/getactivitiesbydate/:id',
  token({ required: true}),
  getActivitiesByDate)

export default router
