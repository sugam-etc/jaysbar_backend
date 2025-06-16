// Exhibition.js
const mongoose = require("mongoose");

const ContentBlockSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., 'paragraph', 'listItem'
  text: { type: String, required: true }, // Make text required for content blocks
});

const ExhibitionSchema = new mongoose.Schema(
  {
    // Frontend structural fields (optional, if _id is enough)
    id: { type: String }, // Can be removed if _id is sufficient for frontend mapping
    type: { type: String }, // Can be removed if schema name implies type
    navTitle: { type: String },
    // Hero Section fields
    title: { type: String, required: true }, // Make title required
    breadcrumbs: { type: String },
    heroImage: { type: String, required: true }, // Path to the hero image file

    // Main Content Section fields
    heading: { type: String, required: true }, // Make heading required
    mainContentImage: { type: String, required: true }, // Path to the main content image file
    contentSide: { type: String, enum: ["left", "right"], default: "left" }, // Ensure valid options
    contentBlocks: { type: [ContentBlockSchema], required: true }, // Array of content blocks

    buttonText: { type: String },
    buttonHref: { type: String },

    // Image Gallery Section fields
    galleryTitle: { type: String },
    galleryImages: { type: [String], default: [] }, // Array of paths to gallery images
  },
  { timestamps: true } // Adds createdAt and updatedAt timestamps
);

module.exports = mongoose.model("Exhibition", ExhibitionSchema);
