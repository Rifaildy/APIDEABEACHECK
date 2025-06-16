const axios = require("axios")
const logger = require("../utils/logger")

class MLService {
  constructor() {
    this.apiUrl = process.env.ML_API_URL || "http://capstone-diabeacheck.up.railway.app"
    this.timeout = 30000 // 30 seconds
    this.predictEndpoint = "/predict" // Endpoint yang benar berdasarkan testing
    this.healthEndpoint = "/health"
  }

  async predictDiabetes(inputData) {
    try {
      logger.info("Calling ML API with:", inputData)

      // Prepare data for ML API (format yang sesuai dengan Railway API)
      const mlApiData = {
        Age: Number.parseFloat(inputData.age),
        BMI: Number.parseFloat(inputData.bmi),
        Glucose: Number.parseFloat(inputData.glucose),
        Insulin: Number.parseFloat(inputData.insulin || 0),
        BloodPressure: Number.parseFloat(inputData.bloodPressure),
      }

      logger.info("Sending to ML API:", mlApiData)

      // Call ML API dengan endpoint yang benar
      const response = await axios.post(`${this.apiUrl}${this.predictEndpoint}`, mlApiData, {
        timeout: this.timeout,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })

      const mlResult = response.data
      logger.info("ML API response:", mlResult)

      // Process ML API response
      let prediction, probability, rawOutput

      // Handle response format dari Railway ML API
      if (mlResult.prediction !== undefined) {
        prediction = mlResult.prediction
        probability = mlResult.probability || 0.5
        rawOutput = mlResult.raw_output !== undefined ? mlResult.raw_output : prediction === "Diabetes" ? 1 : 0
      } else if (mlResult.result !== undefined) {
        // Alternative response format
        prediction = mlResult.result === 1 ? "Diabetes" : "Tidak Diabetes"
        probability = mlResult.confidence || mlResult.probability || 0.5
        rawOutput = mlResult.result
      } else if (mlResult.class !== undefined) {
        // Another possible format
        prediction = mlResult.class === 1 ? "Diabetes" : "Tidak Diabetes"
        probability = mlResult.probability || 0.5
        rawOutput = mlResult.class
      } else {
        // Fallback - assume the response is the prediction directly
        prediction = mlResult.toString().includes("1") ? "Diabetes" : "Tidak Diabetes"
        probability = 0.5
        rawOutput = mlResult.toString().includes("1") ? 1 : 0
      }

      // Determine risk level based on prediction
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

      // Generate recommendations
      const recommendations = this.generateRecommendations(inputData, prediction, rawOutput)

      const result = {
        prediction: prediction,
        probability: probability,
        confidence: confidence,
        risk_level: riskLevel,
        label: prediction,
        message: message,
        recommendations: recommendations,
        model_info: {
          model_type: "MLP Neural Network",
          threshold: 0.5,
          accuracy: null,
        },
        raw_output: rawOutput,
        input_data: inputData,
        ml_api_response: mlResult, // Include original response for debugging
      }

      logger.info("Processed prediction result:", result)
      return result
    } catch (error) {
      logger.error("ML Service error:", error.message)

      if (error.code === "ECONNREFUSED") {
        throw new Error("ML API server is not accessible. Please check if the Railway service is running.")
      }

      if (error.response) {
        logger.error("ML API error response:", {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          url: `${this.apiUrl}${this.predictEndpoint}`,
        })

        if (error.response.status === 405) {
          throw new Error(
            `ML API endpoint ${this.predictEndpoint} does not support POST method. Please check the API documentation at ${this.apiUrl}/docs`,
          )
        }

        if (error.response.status === 404) {
          throw new Error(`ML API endpoint ${this.predictEndpoint} not found. Please verify the endpoint URL.`)
        }

        if (error.response.status === 422) {
          throw new Error(
            `ML API validation error: ${JSON.stringify(error.response.data)}. Please check the input data format.`,
          )
        }

        throw new Error(
          `ML API error (${error.response.status}): ${error.response.data?.detail || error.response.statusText}`,
        )
      }

      if (error.code === "ENOTFOUND") {
        throw new Error("ML API server hostname could not be resolved. Please check the Railway URL.")
      }

      if (error.code === "ETIMEDOUT") {
        throw new Error("ML API request timed out. The Railway service might be slow or unavailable.")
      }

      throw new Error(`ML Service error: ${error.message}`)
    }
  }

  generateRecommendations(inputData, prediction, rawOutput) {
    const recommendations = []
    const age = Number.parseFloat(inputData.age)
    const bmi = Number.parseFloat(inputData.bmi)
    const glucose = Number.parseFloat(inputData.glucose)
    const bloodPressure = Number.parseFloat(inputData.bloodPressure)

    // Base recommendations based on prediction
    if (prediction === "Diabetes" || rawOutput === 1) {
      recommendations.push("🚨 Hasil menunjukkan risiko diabetes tinggi")
      recommendations.push("👨‍⚕️ Segera konsultasi dengan dokter untuk pemeriksaan lebih lanjut")
      recommendations.push("📋 Lakukan tes HbA1c dan tes toleransi glukosa")
      recommendations.push("💊 Pertimbangkan untuk memulai pengobatan sesuai anjuran dokter")
    } else {
      recommendations.push("✅ Hasil menunjukkan risiko diabetes rendah")
      recommendations.push("🎯 Pertahankan gaya hidup sehat untuk mencegah diabetes")
      recommendations.push("📅 Lakukan pemeriksaan rutin setiap tahun")
      recommendations.push("🏃‍♂️ Tetap aktif dengan olahraga teratur")
    }

    // BMI-based recommendations
    if (bmi >= 30) {
      recommendations.push("⚖️ BMI Anda tinggi (obesitas), sangat disarankan program penurunan berat badan")
      recommendations.push("🏃‍♂️ Tingkatkan aktivitas fisik minimal 150 menit per minggu")
      recommendations.push("🥗 Konsultasi dengan ahli gizi untuk diet seimbang")
    } else if (bmi >= 25) {
      recommendations.push("⚖️ BMI Anda sedikit tinggi (overweight), jaga berat badan ideal")
      recommendations.push("🚶‍♂️ Lakukan olahraga ringan secara teratur")
    } else if (bmi < 18.5) {
      recommendations.push("⚖️ BMI Anda rendah, pertimbangkan untuk menambah berat badan secara sehat")
    }

    // Glucose-based recommendations
    if (glucose >= 200) {
      recommendations.push("🚨 Kadar glukosa sangat tinggi (>200), segera ke dokter!")
    } else if (glucose >= 140) {
      recommendations.push("🚨 Kadar glukosa tinggi, segera konsultasi dokter")
      recommendations.push("🥬 Konsumsi makanan dengan indeks glikemik rendah")
      recommendations.push("⏰ Atur jadwal makan yang teratur")
    } else if (glucose >= 100) {
      recommendations.push("🍯 Kadar glukosa sedikit tinggi, batasi konsumsi gula")
      recommendations.push("🥬 Konsumsi makanan dengan indeks glikemik rendah")
    }

    // Blood pressure recommendations
    if (bloodPressure >= 140) {
      recommendations.push("💓 Tekanan darah tinggi, kurangi konsumsi garam")
      recommendations.push("🧘‍♀️ Lakukan teknik relaksasi untuk mengurangi stres")
      recommendations.push("🚭 Hindari merokok dan alkohol")
    } else if (bloodPressure >= 120) {
      recommendations.push("💓 Tekanan darah sedikit tinggi, jaga pola hidup sehat")
    }

    // Age-based recommendations
    if (age >= 45) {
      recommendations.push("👴 Usia adalah faktor risiko, lakukan pemeriksaan rutin setiap 6 bulan")
      recommendations.push("💪 Pertahankan massa otot dengan latihan kekuatan")
    }

    // General health recommendations
    recommendations.push("🥬 Konsumsi makanan seimbang dengan banyak sayuran dan buah")
    recommendations.push("💧 Minum air putih minimal 8 gelas per hari")
    recommendations.push("😴 Tidur cukup 7-8 jam per hari")
    recommendations.push("📱 Gunakan aplikasi untuk memantau kesehatan")
    recommendations.push("🏥 Konsultasi rutin dengan tenaga kesehatan")

    return recommendations
  }

  async healthCheck() {
    try {
      // Check ML API health
      const response = await axios.get(`${this.apiUrl}${this.healthEndpoint}`, {
        timeout: 10000,
      })

      return {
        status: "healthy",
        url: this.apiUrl,
        endpoint: this.healthEndpoint,
        response: response.data,
        message: "ML API server is accessible and healthy",
      }
    } catch (error) {
      logger.error("ML API health check failed:", error.message)
      return {
        status: "unhealthy",
        url: this.apiUrl,
        endpoint: this.healthEndpoint,
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
        testData: testData,
      }
    } catch (error) {
      return {
        status: "failed",
        message: "Test prediction failed",
        error: error.message,
        testData: testData,
      }
    }
  }

  // Method untuk mendapatkan info ML API
  async getApiInfo() {
    try {
      const response = await axios.get(`${this.apiUrl}/`, {
        timeout: 10000,
      })

      return {
        status: "success",
        info: response.data,
        endpoints: {
          root: "/",
          health: "/health",
          predict: "/predict",
          docs: "/docs",
        },
      }
    } catch (error) {
      return {
        status: "failed",
        error: error.message,
      }
    }
  }
}

module.exports = MLService
