const scoreSchema = new mongoose.Schema({
  team: { type: String, required: true },
  year: { type: String, required: true },
  modality: { type: String, required: true },
  position: { type: Number, required: true },
  points: { type: Number, required: true },
}, {
  timestamps: true,
  versionKey: false
});

// Índice único para evitar duplicações
scoreSchema.index({ team: 1, year: 1, modality: 1 }, { unique: true });

const Score = mongoose.model('Score', scoreSchema);
