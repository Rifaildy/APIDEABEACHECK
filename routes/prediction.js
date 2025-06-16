const express = require("express")
const { body, validationResult } = require("express-validator")
const MLService = require("../services/mlService")
const PredictionHistory = require("../models/PredictionHistory")
const { auth } = require("../middleware/auth")
const logger = require("../utils/logger")

const router = express.Router()
const mlService = new MLService()

// Validation rules for diabetes prediction
const diabetesPredictionValidation = [
  body("age")
    .isNumeric()
    .withMessage("Age must be a number")
    .isFloat({ min: 1, max: 120 })
    .withMessage("Age must be between 1-120 years"),

  body("glucose")
    .isNumeric()
    .withMessage("Glucose must be a number")
    .isFloat({ min: 0, max: 300 })
    .withMessage("Glucose must be between 0-300 mg/dL"),

  body("bloodPressure")
    .isNumeric()
    .withMessage("Blood pressure must be a number")
    .isFloat({ min: 0, max: 250 })
    .withMessage("Blood pressure must be between 0-250 mmHg"),

  body("bmi")
    .isNumeric()
    .withMessage("BMI must be a number")
    .isFloat({ min: 10, max: 70 })
    .withMessage("BMI must be between 10-70"),

  // Optional fields - only validate if provided
  body("insulin")
    .optional({ nullable: true, checkFalsy: true })
    .isNumeric()
    .withMessage("Insulin must be a number")
    .isFloat({ min: 0, max: 1000 })
    .withMessage("Insulin must be between 0-1000 mu U/ml"),

  body("skinThickness")
    .optional({ nullable: true, checkFalsy: true })
    .isNumeric()
    .withMessage("Skin thickness must be a number")
    .isFloat({ min: 0, max: 100 })
    .withMessage("Skin thickness must be between 0-100 mm"),

  body("diabetesPedigreeFunction")
    .optional({ nullable: true, checkFalsy: true })
    .isNumeric()
    .withMessage("Diabetes pedigree function must be a number")
    .isFloat({ min: 0, max: 5 })
    .withMessage("Diabetes pedigree function must be between 0-5"),

  body("pregnancies")
    .optional({ nullable: true, checkFalsy: true })
    .isNumeric()
    .withMessage("Pregnancies must be a number")
    .isFloat({ min: 0, max: 20 })
    .withMessage("Pregnancies must be between 0-20"),
]

// POST /api/prediction - Create new prediction
router.post("/", auth, diabetesPredictionValidation, async (req, res) => {
  try {
    logger.info("=== PREDICTION REQUEST START ===")
    logger.info("User ID:", req.user?.id)
    logger.info("User Email:", req.user?.email)
    logger.info("Request Body:", req.body)

    // Check validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      logger.warn("Validation errors:", errors.array())
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    // Extract and sanitize input data
    const inputData = {
      age: req.body.age,
      glucose: req.body.glucose,
      bloodPressure: req.body.bloodPressure,
      bmi: req.body.bmi,
      insulin: req.body.insulin || 0,
      skinThickness: req.body.skinThickness || 0,
      diabetesPedigreeFunction: req.body.diabetesPedigreeFunction || 0,
      pregnancies: req.body.pregnancies || 0,
    }

    logger.info("Sanitized input data:", inputData)

    // Use mock prediction for now since ML API has issues
    const result = await mlService.generateMockPrediction(inputData)
    logger.info("Mock prediction result:", result)

    // Save prediction to database
    try {
      const predictionData = {
        userId: req.user.id,
        sessionId: req.sessionID || `session_${Date.now()}`,
        age: inputData.age,
        glucose: inputData.glucose,
        bloodPressure: inputData.bloodPressure,
        skinThickness: inputData.skinThickness,
        insulin: inputData.insulin,
        bmi: inputData.bmi,
        diabetesPedigreeFunction: inputData.diabetesPedigreeFunction,
        pregnancies: inputData.pregnancies,
        predictionResult: result.prediction === "Diabetes" ? 1 : 0,
        probability: result.probability,
        confidence: result.confidence,
        riskLevel: result.risk_level,
        modelVersion: "Mock MLP Neural Network",
        modelAccuracy: 0.85,
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
        deviceInfo: {
          platform: req.get("sec-ch-ua-platform"),
          mobile: req.get("sec-ch-ua-mobile"),
        },
        locationData: null,
      }

      logger.info("Saving prediction with user ID:", {
        userId: predictionData.userId,
        userEmail: req.user.email,
      })

      const savedPrediction = await PredictionHistory.create(predictionData)
      logger.info("Prediction saved successfully:", {
        id: savedPrediction?.id,
        userId: predictionData.userId,
      })

      if (savedPrediction?.id) {
        result.predictionId = savedPrediction.id
      }
    } catch (dbError) {
      logger.error("Failed to save prediction to database:", dbError)
    }

    logger.info("=== PREDICTION REQUEST SUCCESS ===")

    res.json({
      success: true,
      message: "Prediction completed successfully",
      data: result,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    logger.error("=== PREDICTION REQUEST FAILED ===")
    logger.error("Prediction error:", error.message)
    logger.error("Error stack:", error.stack)

    res.status(500).json({
      success: false,
      message: "Prediction failed",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
})

// GET /api/prediction - Get user prediction history with detailed logging
router.get("/", auth, async (req, res) => {
  try {
    logger.info("=== GET PREDICTIONS REQUEST ===")
    logger.info("User ID:", req.user?.id)
    logger.info("User Email:", req.user?.email)
    logger.info("Query params:", req.query)

    const { page = 1, limit = 10 } = req.query
    const offset = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    logger.info("Pagination:", { page, limit, offset })

    // Get predictions for this user
    const predictions = await PredictionHistory.findByUserId(req.user.id, {
      limit: Number.parseInt(limit),
      offset: offset,
    })

    logger.info("Found predictions:", {
      count: predictions.length,
      userId: req.user.id,
    })

    // Get total count for pagination
    const totalCount = await PredictionHistory.getUserStats(req.user.id)
    logger.info("User stats:", totalCount)

    res.json({
      success: true,
      message: "Predictions retrieved successfully",
      data: predictions,
      pagination: {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        total: totalCount.total_predictions || 0,
        totalPages: Math.ceil((totalCount.total_predictions || 0) / Number.parseInt(limit)),
      },
      stats: totalCount,
    })
  } catch (error) {
    logger.error("Get predictions error:", error.message)
    logger.error("Error stack:", error.stack)
    res.status(500).json({
      success: false,
      message: "Failed to get predictions",
      error: error.message,
    })
  }
})

// GET /api/prediction/stats - Get user prediction statistics
router.get("/stats", auth, async (req, res) => {
  try {
    logger.info("=== GET PREDICTION STATS ===")
    logger.info("User ID:", req.user?.id)

    const stats = await PredictionHistory.getUserStats(req.user.id)
    logger.info("User prediction stats:", stats)

    res.json({
      success: true,
      message: "Statistics retrieved successfully",
      data: stats,
    })
  } catch (error) {
    logger.error("Get prediction stats error:", error.message)
    res.status(500).json({
      success: false,
      message: "Failed to get statistics",
      error: error.message,
    })
  }
})

// GET /api/prediction/:id - Get specific prediction
router.get("/:id", auth, async (req, res) => {
  try {
    logger.info("=== GET SPECIFIC PREDICTION ===")
    logger.info("User ID:", req.user?.id)
    logger.info("Prediction ID:", req.params.id)

    const prediction = await PredictionHistory.findById(req.params.id)

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: "Prediction not found",
      })
    }

    // Ensure user can only access their own predictions
    if (prediction.userId !== req.user.id) {
      logger.warn("Access denied - user trying to access other user's prediction:", {
        requestingUserId: req.user.id,
        predictionUserId: prediction.userId,
      })
      return res.status(403).json({
        success: false,
        message: "Access denied",
      })
    }

    res.json({
      success: true,
      message: "Prediction retrieved successfully",
      data: prediction,
    })
  } catch (error) {
    logger.error("Get prediction by ID error:", error.message)
    res.status(500).json({
      success: false,
      message: "Failed to get prediction",
      error: error.message,
    })
  }
})

// GET /api/prediction/debug/all - Debug endpoint to see all predictions (temporary)
router.get("/debug/all", auth, async (req, res) => {
  try {
    logger.info("=== DEBUG ALL PREDICTIONS ===")
    logger.info("User ID:", req.user?.id)

    // Get recent predictions to debug
    const recentPredictions = await PredictionHistory.getRecentPredictions(20)
    logger.info("Recent predictions count:", recentPredictions.length)

    // Filter predictions for current user
    const userPredictions = recentPredictions.filter((p) => p.userId === req.user.id)
    logger.info("User predictions count:", userPredictions.length)

    res.json({
      success: true,
      message: "Debug data retrieved",
      data: {
        currentUserId: req.user.id,
        currentUserEmail: req.user.email,
        totalRecentPredictions: recentPredictions.length,
        userPredictions: userPredictions.length,
        allPredictions: recentPredictions.map((p) => ({
          id: p.id,
          userId: p.userId,
          email: p.email,
          riskLevel: p.riskLevel,
          createdAt: p.createdAt,
        })),
        userPredictionsDetail: userPredictions,
      },
    })
  } catch (error) {
    logger.error("Debug endpoint error:", error.message)
    res.status(500).json({
      success: false,
      message: "Debug failed",
      error: error.message,
    })
  }
})

module.exports = router
