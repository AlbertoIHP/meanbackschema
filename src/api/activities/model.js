import mongoose, { Schema } from 'mongoose'

const activitiesSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createdBy_id: {
    type: String,
    required: true
  },
  course_id: {
    type: String,
    required: true
  },
  urlPhoto: {
    type: String
  },
  activityType: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

activitiesSchema.methods = {
  view (full) {
    const view = {
      // simple view
      name: this.name,
      id: this.id,
      description: this.description,
      createdBy_id: this.createdBy_id,
      course_id: this.course_id,
      urlPhoto: this.urlPhoto,
      activityType: this.activityType,
      createdAt: this.createdAt,
    }

    return full ? {
      ...view,
      createdBy_id: this.createdBy_id,
      updatedAt: this.updatedAt
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Activities', activitiesSchema)

export const schema = model.schema
export default model
