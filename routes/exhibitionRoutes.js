const express = require("express");
const router = express.Router();
const { exhibitionUpload, multerErrorHandler } = require("../config/multer");
const exhibitionController = require("../controllers/exhibitionController");

router.post(
  "/",
  (req, res, next) => {
    exhibitionUpload(req, res, (err) => {
      if (err) return multerErrorHandler(err, req, res, next);
      next();
    });
  },
  exhibitionController.createExhibition
);

router.get("/", exhibitionController.getExhibitions);
router.get("/:id", exhibitionController.getExhibitionById);
// Add this to your exhibition routes
router.get("/nav/exhibitions", exhibitionController.getExhibitionsForNav);
router.put(
  "/:id",
  (req, res, next) => {
    exhibitionUpload(req, res, (err) => {
      if (err) return multerErrorHandler(err, req, res, next);
      next();
    });
  },
  exhibitionController.updateExhibition
);

router.delete("/:id", exhibitionController.deleteExhibition);

module.exports = router;
