import { Schema, model, models } from 'mongoose';

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
  icon: {
    type: String,
    required: [true, 'Skill icon is required'],
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

export default models.Skill || model('Skill', SkillSchema); 