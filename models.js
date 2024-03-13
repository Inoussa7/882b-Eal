const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define a LearningStyles schema for embedding
const learningStylesSchema = new Schema({
  visual: { type: String },
  auditory: { type: String },
  kinesthetic: { type: String },
  readingWriting: { type: String }
});

// Vocabulary schema to include words and learning styles
const vocabularySchema = new Schema({
  title: { type: String, required: true },
  words: [{ type: String, required: true }],
  learningStyles: learningStylesSchema
});

// Grammar schema to include lessons (explanations) and exercises (sentences) with learning styles
const grammarSchema = new Schema({
  title: { type: String, required: true },
  explanations: [{ type: String, required: true }],
  exercises: [{ type: String, required: true }],
  learningStyles: learningStylesSchema
});

// Language Learning Content schema, which can include grammar, vocabulary, and other aspects like reading, listening, etc.
const languageLearningContentSchema = new Schema({
  topic: { type: String, required: true },
  proficiencyLevel: { type: String, required: true, enum: ['Beginner', 'Intermediate', 'Advanced'] },
  overview: { type: String, required: true },
  grammar: grammarSchema,
  vocabulary: vocabularySchema,
  // Define additional sections as needed (e.g., readingComprehension, listeningQuizzes)
});

// User schema definition
const userSchema = new Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  countryofOrigin: { type: String, required: true },
  languagesSpoken: [{ type: String, required: true }],
  major: { type: String, required: true },
  specialization: { type: String, required: true },
  classes: [{ type: String, required: true }],
  graduationYear: { type: Number, required: true }
});

// Travel Resources schema definition, assuming this is still relevant
const travelResourcesSchema = new Schema({
  learningStyle: { type: String, required: true, enum: ['Visual', 'Auditory', 'Kinesthetic', 'Reading/Writing'] },
  resourceType: { type: String, required: true },
  description: { type: String, required: true }
});

// Creating models
const User = mongoose.model('User', userSchema);
const LanguageLearningContent = mongoose.model('LanguageLearningContent', languageLearningContentSchema);
const TravelResource = mongoose.model('TravelResource', travelResourcesSchema);

// Exporting models
module.exports = {
  User,
  LanguageLearningContent,
  TravelResource
};
