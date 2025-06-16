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

// POST /api/prediction - Apply auth middleware to get user info
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
      insulin: req.body.insulin || 0, // Default to 0 if not provided
      skinThickness: req.body.skinThickness || 0,
      diabetesPedigreeFunction: req.body.diabetesPedigreeFunction || 0,
      pregnancies: req.body.pregnancies || 0,
    }

    logger.info("Sanitized input data:", inputData)

    // Test ML API connectivity first
    try {
      logger.info("Testing ML API connectivity...")
      const healthCheck = await mlService.healthCheck()
      logger.info("ML API health check result:", healthCheck)

      if (healthCheck.status !== "healthy") {
        logger.error("ML API is not healthy:", healthCheck)
        return res.status(503).json({
          success: false,
          message: "ML service is currently unavailable",
          error: "ML API health check failed",
          details: healthCheck,
        })
      }
    } catch (healthError) {
      logger.error("ML API health check failed:", healthError.message)
      return res.status(503).json({
        success: false,
        message: "ML service is currently unavailable",
        error: "Cannot connect to ML API",
        details: healthError.message,
      })
    }

    // Call ML service for prediction
    let result
    try {
      logger.info("Calling ML service for prediction...")
      result = await mlService.predictDiabetes(inputData)
      logger.info("ML service prediction result:", result)
    } catch (mlError) {
      logger.error("ML service prediction failed:", mlError.message)
      return res.status(500).json({
        success: false,
        message: "Prediction failed",
        error: mlError.message,
        timestamp: new Date().toISOString(),
      })
    }

    // Save prediction to database with authenticated user ID
    try {
      const predictionData = {
        userId: req.user.id, // Use authenticated user ID
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
        modelVersion: result.model_info?.model_type || "MLP Neural Network",
        modelAccuracy: result.model_info?.accuracy || null,
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
        deviceInfo: {
          platform: req.get("sec-ch-ua-platform"),
          mobile: req.get("sec-ch-ua-mobile"),
        },
        locationData: null,
      }

      logger.info("Saving prediction to database:", {
        userId: predictionData.userId,
        userEmail: req.user.email,
      })

      const savedPrediction = await PredictionHistory.create(predictionData)
      logger.info("Prediction saved successfully:", {
        id: savedPrediction?.id,
        userId: predictionData.userId,
      })

      // Add database ID to result
      if (savedPrediction?.id) {
        result.predictionId = savedPrediction.id
      }
    } catch (dbError) {
      logger.error("Failed to save prediction to database:", dbError)
      // Continue without failing the request - prediction still works
      logger.warn("Continuing without saving to database...")
    }

    logger.info("=== PREDICTION REQUEST SUCCESS ===")

    // Return successful response
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

    // Return error response
    res.status(500).json({
      success: false,
      message: "Prediction failed",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
})

// GET /api/prediction - Get user prediction history
router.get("/", auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query
    const predictions = await PredictionHistory.findByUserId(req.user.id, {
      limit: Number.parseInt(limit),
      offset: (Number.parseInt(page) - 1) * Number.parseInt(limit),
    })

    res.json({
      success: true,
      message: "Predictions retrieved successfully",
      data: predictions,
      pagination: {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        total: predictions.length,
      },
    })
  } catch (error) {
    logger.error("Get predictions error:", error.message)
    res.status(500).json({
      success: false,
      message: "Failed to get predictions",
      error: error.message,
    })
  }
})

// GET /api/prediction/:id - Get specific prediction
router.get("/:id", auth, async (req, res) => {
  try {
    const prediction = await PredictionHistory.findById(req.params.id)

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: "Prediction not found",
      })
    }

    // Pastikan user hanya bisa akses prediksi miliknya sendiri
    if (prediction.userId !== req.user.id) {
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

// GET /api/prediction/test/ml - Test ML API connectivity
router.get("/test/ml", async (req, res) => {
  try {
    logger.info("Testing ML API...")

    // Test health check
    const healthResult = await mlService.healthCheck()
    logger.info("Health check result:", healthResult)

    // Test prediction
    const testResult = await mlService.testPrediction()
    logger.info("Test prediction result:", testResult)

    res.json({
      success: true,
      message: "ML API test completed",
      data: {
        health: healthResult,
        testPrediction: testResult,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    logger.error("ML API test failed:", error.message)
    res.status(500).json({
      success: false,
      message: "ML API test failed",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
})

module.exports = router
