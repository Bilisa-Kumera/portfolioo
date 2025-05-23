import { Schema, model, models } from 'mongoose';

const AboutSchema = new Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const About = models.About || model('About', AboutSchema);

export default About; 