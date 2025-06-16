const Exhibition = require("../models/Exhibition");

// Helper to construct full image URL
const getImageUrl = (filename) => `/upload/${filename}`;

// Create new exhibition with up to 100 gallery images
exports.createExhibition = async (req, res, next) => {
  try {
    const data = req.body.data ? JSON.parse(req.body.data) : req.body;

    // Default image paths
    data.heroImage = null;
    data.mainContentImage = null;
    data.galleryImages = [];

    // Process uploaded files
    if (req.files) {
      if (req.files.heroImage?.[0]?.filename) {
        data.heroImage = getImageUrl(req.files.heroImage[0].filename);
      }
      if (req.files.mainContentImage?.[0]?.filename) {
        data.mainContentImage = getImageUrl(
          req.files.mainContentImage[0].filename
        );
      }
      if (req.files.galleryImages) {
        data.galleryImages = req.files.galleryImages.map((file) =>
          getImageUrl(file.filename)
        );
      }
    }

    // Server-side validation
    if (!data.title || data.title.trim() === "") {
      return res.status(400).json({ message: "Title is required." });
    }
    if (!data.heading || data.heading.trim() === "") {
      return res.status(400).json({ message: "Heading is required." });
    }
    if (!data.heroImage) {
      return res.status(400).json({ message: "Hero Image is required." });
    }
    if (!data.mainContentImage) {
      return res
        .status(400)
        .json({ message: "Main Content Image is required." });
    }
    if (
      !data.contentBlocks ||
      data.contentBlocks.length === 0 ||
      !data.contentBlocks[0].text ||
      data.contentBlocks[0].text.trim() === ""
    ) {
      return res.status(400).json({
        message: "At least one content block with text is required.",
      });
    }

    const exhibition = new Exhibition(data);
    await exhibition.save();
    res.status(201).json(exhibition);
  } catch (err) {
    next(err);
  }
};
// Get all exhibitions
exports.getExhibitions = async (req, res) => {
  try {
    const exhibitions = await Exhibition.find();
    res.json(exhibitions);
  } catch (err) {
    console.error("Error fetching exhibitions:", err);
    res
      .status(500)
      .json({ message: err.message || "Failed to retrieve exhibitions" });
  }
};

// Get single exhibition by ID
exports.getExhibitionById = async (req, res) => {
  try {
    const exhibition = await Exhibition.findById(req.params.id);
    if (!exhibition) {
      return res.status(404).json({ message: "Exhibition not found" });
    }
    res.json(exhibition);
  } catch (err) {
    console.error("Error fetching single exhibition:", err);
    res
      .status(500)
      .json({ message: err.message || "Failed to retrieve exhibition" });
  }
};

// Update exhibition by ID
exports.updateExhibition = async (req, res) => {
  try {
    const data = req.body.data ? JSON.parse(req.body.data) : req.body;

    // Process uploaded files for update
    if (req.files) {
      if (
        req.files.heroImage &&
        req.files.heroImage.length > 0 &&
        req.files.heroImage[0].filename
      ) {
        data.heroImage = getImageUrl(req.files.heroImage[0].filename);
      } else {
        console.warn("Hero image not provided for update.");
      }
      if (
        req.files.mainContentImage &&
        req.files.mainContentImage.length > 0 &&
        req.files.mainContentImage[0].filename
      ) {
        data.mainContentImage = getImageUrl(
          req.files.mainContentImage[0].filename
        );
      } else {
        console.warn("Main content image not provided for update.");
      }
      if (req.files.galleryImages && req.files.galleryImages.length > 0) {
        data.galleryImages = req.files.galleryImages.map((file) =>
          getImageUrl(file.filename)
        );
      } else {
        console.warn("No gallery images provided for update.");
      }
    } else {
      console.warn("No files object (req.files) found in the update request.");
    }

    const updatedExhibition = await Exhibition.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidators: true } // Return the updated doc and run schema validators
    );

    if (!updatedExhibition) {
      return res.status(404).json({ message: "Exhibition not found" });
    }

    res.json(updatedExhibition);
  } catch (err) {
    console.error("Error updating exhibition:", err);
    if (err.name === "ValidationError") {
      const errors = {};
      for (const field in err.errors) {
        errors[field] = err.errors[field].message;
      }
      return res
        .status(400)
        .json({ message: "Validation Error", errors: errors });
    }
    res
      .status(500)
      .json({ message: err.message || "Failed to update exhibition" });
  }
};

// Delete exhibition by ID
exports.deleteExhibition = async (req, res) => {
  try {
    const deleted = await Exhibition.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Exhibition not found" });
    }
    res.json({ message: "Exhibition deleted successfully" });
  } catch (err) {
    console.error("Error deleting exhibition:", err);
    res
      .status(500)
      .json({ message: err.message || "Failed to delete exhibition" });
  }
};
// Get exhibitions for navbar (only navTitle and _id)
exports.getExhibitionsForNav = async (req, res) => {
  try {
    const exhibitions = await Exhibition.find({}, "navTitle _id");
    res.json(exhibitions);
  } catch (err) {
    console.error("Error fetching exhibitions for navbar:", err);
    res
      .status(500)
      .json({ message: "Failed to retrieve exhibitions for navbar" });
  }
};
