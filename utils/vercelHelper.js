/**
 * Helper functions for Vercel deployment
 */

// Check if running on Vercel
const isVercel = () => {
  return process.env.VERCEL === "1" || process.env.VERCEL === "true"
}

// Get Vercel deployment URL
const getDeploymentUrl = () => {
  if (isVercel()) {
    return `https://${process.env.VERCEL_URL}`
  }
  return null
}

// Log Vercel deployment info
const logVercelInfo = () => {
  if (isVercel()) {
    console.log("Running on Vercel")
    console.log(`Deployment URL: ${getDeploymentUrl()}`)
    console.log(`Environment: ${process.env.VERCEL_ENV}`)
    console.log(`Region: ${process.env.VERCEL_REGION || "unknown"}`)
  } else {
    console.log("Not running on Vercel")
  }
}

module.exports = {
  isVercel,
  getDeploymentUrl,
  logVercelInfo,
}
