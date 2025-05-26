import { Schema, model, models } from 'mongoose';

// Delete the existing model if it exists
if (models.Skill) {
  delete models.Skill;
}

const SkillSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Skill name is required'],
  },
  level: {
    type: Number,
    required: [true, 'Skill level is required'],
    min: 0,
    max: 100,
  },
  category: {
    type: String,
    required: [true, 'Skill category is required'],
  },
  image: {
    type: String,
    required: [true, 'Skill image is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default model('Skill', SkillSchema); 