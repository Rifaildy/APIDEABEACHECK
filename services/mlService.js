const axios = require("axios")
const logger = require("../utils/logger")

class MLService {
  constructor() {
    this.apiUrl = process.env.ML_API_URL || "http://capstone-diabeacheck.up.railway.app"
    this.timeout = 30000 // 30 seconds
  }

  async predictDiabetes(inputData) {
    try {
      logger.info("=== ML API CALL START ===")
      logger.info("ML API URL:", this.apiUrl)
      logger.info("Input data:", inputData)

      // Prepare data for ML API
      const mlApiData = {
        Age: Number.parseFloat(inputData.age),
        BMI: Number.parseFloat(inputData.bmi),
        Glucose: Number.parseFloat(inputData.glucose),
        Insulin: Number.parseFloat(inputData.insulin || 0),
        BloodPressure: Number.parseFloat(inputData.bloodPressure),
      }

      logger.info("Formatted ML API data:", mlApiData)

      // Try different endpoints and methods
      const endpointsToTry = [
        { url: `${this.apiUrl}/predict`, method: "POST" },
        { url: `${this.apiUrl}/api/predict`, method: "POST" },
        { url: `${this.apiUrl}/prediction`, method: "POST" },
        { url: `${this.apiUrl}/predict`, method: "GET" },
      ]

      let lastError = null

      for (const endpoint of endpointsToTry) {
        try {
          logger.info(`Trying ${endpoint.method} ${endpoint.url}`)

          let response
          if (endpoint.method === "POST") {
            response = await axios.post(endpoint.url, mlApiData, {
              timeout: this.timeout,
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            })
          } else {
            // For GET, try with query parameters
            const params = new URLSearchParams(mlApiData).toString()
            response = await axios.get(`${endpoint.url}?${params}`, {
              timeout: this.timeout,
              headers: {
                Accept: "application/json",
              },
            })
          }

          if (response.status === 200) {
            logger.info(`Success with ${endpoint.method} ${endpoint.url}`)
            logger.info("ML API response:", response.data)

            // Process the successful response
            return this.processMLResponse(response.data, inputData)
          }
        } catch (error) {
          logger.warn(`Failed ${endpoint.method} ${endpoint.url}:`, error.response?.status || error.message)
          lastError = error
          continue
        }
      }

      // If all endpoints failed, throw the last error
      throw lastError || new Error("All ML API endpoints failed")
    } catch (error) {
      logger.error("=== ML API CALL FAILED ===")
      logger.error("Error:", error.message)

      if (error.response) {
        logger.error("Response status:", error.response.status)
        logger.error("Response data:", error.response.data)
      }

      // Return mock prediction for development/testing
      if (process.env.NODE_ENV !== "production") {
        logger.warn("Returning mock prediction for development")
        return this.getMockPrediction(inputData)
      }

      throw this.formatMLError(error)
    }
  }

  processMLResponse(mlResult, inputData) {
    logger.info("Processing ML response:", mlResult)

    // Handle different response formats
    let prediction, probability, rawOutput

    if (mlResult.prediction !== undefined) {
      prediction = mlResult.prediction
      probability = mlResult.probability || 0.5
      rawOutput = mlResult.raw_output !== undefined ? mlResult.raw_output : prediction === "Diabetes" ? 1 : 0
    } else if (mlResult.result !== undefined) {
      prediction = mlResult.result === 1 ? "Diabetes" : "Tidak Diabetes"
      probability = mlResult.confidence || mlResult.probability || 0.5
      rawOutput = mlResult.result
    } else if (mlResult.class !== undefined) {
      prediction = mlResult.class === 1 ? "Diabetes" : "Tidak Diabetes"
      probability = mlResult.probability || 0.5
      rawOutput = mlResult.class
    } else {
      // Fallback parsing
      prediction = "Tidak Diabetes"
      probability = 0.3
      rawOutput = 0
    }

    // Determine risk level
    let riskLevel, confidence, message

    if (prediction === "Diabetes" || rawOutput === 1) {
      riskLevel = "High"
      confidence = probability
      message = `Risiko diabetes tinggi dengan probabilitas ${Math.round(probability * 100)}%`
    } else {
      riskLevel = "Low"
      confidence = 1 - probability
      message = `Risiko diabetes rendah dengan probabilitas ${Math.round((1 - probability) * 100)}%`
    }

    const result = {
      prediction: prediction,
      probability: probability,
      confidence: confidence,
      risk_level: riskLevel,
      label: prediction,
      message: message,
      recommendations: this.generateRecommendations(inputData, prediction, rawOutput),
      model_info: {
        model_type: "MLP Neural Network",
        threshold: 0.5,
        accuracy: null,
      },
      raw_output: rawOutput,
      input_data: inputData,
      ml_api_response: mlResult,
    }

    logger.info("Processed result:", result)
    return result
  }

  getMockPrediction(inputData) {
    logger.info("Generating mock prediction for development")

    // Simple mock logic based on glucose and BMI
    const glucose = Number.parseFloat(inputData.glucose)
    const bmi = Number.parseFloat(inputData.bmi)

    const isDiabetic = glucose > 140 || bmi > 30
    const probability = isDiabetic ? 0.75 : 0.25

    return {
      prediction: isDiabetic ? "Diabetes" : "Tidak Diabetes",
      probability: probability,
      confidence: probability,
      risk_level: isDiabetic ? "High" : "Low",
      label: isDiabetic ? "Diabetes" : "Tidak Diabetes",
      message: `${isDiabetic ? "Risiko diabetes tinggi" : "Risiko diabetes rendah"} dengan probabilitas ${Math.round(probability * 100)}% (MOCK DATA)`,
      recommendations: this.generateRecommendations(
        inputData,
        isDiabetic ? "Diabetes" : "Tidak Diabetes",
        isDiabetic ? 1 : 0,
      ),
      model_info: {
        model_type: "Mock Prediction",
        threshold: 0.5,
        accuracy: null,
      },
      raw_output: isDiabetic ? 1 : 0,
      input_data: inputData,
      ml_api_response: { mock: true },
    }
  }

  formatMLError(error) {
    if (error.code === "ECONNREFUSED") {
      return new Error("ML API server is not accessible. Please check if the Railway service is running.")
    }

    if (error.response) {
      const status = error.response.status
      const data = error.response.data

      if (status === 405) {
        return new Error(
          `ML API endpoint does not support the request method. Please check the API documentation at ${this.apiUrl}/docs`,
        )
      }

      if (status === 404) {
        return new Error(`ML API endpoint not found. Please verify the endpoint URL.`)
      }

      if (status === 422) {
        return new Error(`ML API validation error: ${JSON.stringify(data)}. Please check the input data format.`)
      }

      return new Error(`ML API error (${status}): ${data?.detail || error.response.statusText}`)
    }

    if (error.code === "ENOTFOUND") {
      return new Error("ML API server hostname could not be resolved. Please check the Railway URL.")
    }

    if (error.code === "ETIMEDOUT") {
      return new Error("ML API request timed out. The Railway service might be slow or unavailable.")
    }

    return new Error(`ML Service error: ${error.message}`)
  }

  generateRecommendations(inputData, prediction, rawOutput) {
    const recommendations = []
    const age = Number.parseFloat(inputData.age)
    const bmi = Number.parseFloat(inputData.bmi)
    const glucose = Number.parseFloat(inputData.glucose)
    const bloodPressure = Number.parseFloat(inputData.bloodPressure)

    // Base recommendations
    if (prediction === "Diabetes" || rawOutput === 1) {
      recommendations.push("🚨 Hasil menunjukkan risiko diabetes tinggi")
      recommendations.push("👨‍⚕️ Segera konsultasi dengan dokter untuk pemeriksaan lebih lanjut")
      recommendations.push("📋 Lakukan tes HbA1c dan tes toleransi glukosa")
    } else {
      recommendations.push("✅ Hasil menunjukkan risiko diabetes rendah")
      recommendations.push("🎯 Pertahankan gaya hidup sehat untuk mencegah diabetes")
      recommendations.push("📅 Lakukan pemeriksaan rutin setiap tahun")
    }

    // BMI recommendations
    if (bmi >= 30) {
      recommendations.push("⚖️ BMI tinggi - disarankan program penurunan berat badan")
    } else if (bmi >= 25) {
      recommendations.push("⚖️ BMI sedikit tinggi - jaga berat badan ideal")
    }

    // Glucose recommendations
    if (glucose >= 140) {
      recommendations.push("🚨 Kadar glukosa tinggi - segera konsultasi dokter")
    } else if (glucose >= 100) {
      recommendations.push("🍯 Kadar glukosa sedikit tinggi - batasi konsumsi gula")
    }

    // General recommendations
    recommendations.push("🥬 Konsumsi makanan seimbang")
    recommendations.push("💧 Minum air putih minimal 8 gelas per hari")
    recommendations.push("🏃‍♂️ Olahraga teratur minimal 30 menit per hari")

    return recommendations
  }

  async healthCheck() {
    try {
      const response = await axios.get(`${this.apiUrl}/health`, {
        timeout: 10000,
      })

      return {
        status: "healthy",
        url: this.apiUrl,
        response: response.data,
        message: "ML API server is accessible",
      }
    } catch (error) {
      return {
        status: "unhealthy",
        url: this.apiUrl,
        error: error.message,
        message: "ML API server is not accessible",
      }
    }
  }

  async testPrediction() {
    const testData = {
      age: 45,
      bmi: 28.5,
      glucose: 120,
      insulin: 50,
      bloodPressure: 80,
    }

    try {
      const result = await this.predictDiabetes(testData)
      return {
        status: "success",
        message: "Test prediction successful",
        result: result,
      }
    } catch (error) {
      return {
        status: "failed",
        message: "Test prediction failed",
        error: error.message,
      }
    }
  }
}

module.exports = MLService
