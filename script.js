// ============================================
// CONFIGURATION
// ============================================
const CLOUDINARY_CLOUD_NAME = "dy1xj4nof"
const CLOUDINARY_UPLOAD_PRESET = "reportit_unsigned"

const GOOGLE_FORM_ENTRY_IDS = {
  name: "200562054",
  email: "1045781291",
  address: "1865946570",
  phone: "1166974658",
  category: "864556991",
  description: "839337160",
  imageUrl: "2078825004",
  voiceUrl: "252249321",
}

const GOOGLE_FORM_URL = "https://forms.gle/uVH4gvbQtduuVYw9A"

const CATEGORY_OPTIONS = [
  "Kidnapping",
  "Human Trafficking",
  "Armed Robbery",
  "Suspicious Transaction",
  "Illegal Arms",
  "Assault",
  "Vandalism",
  "Harassment",
  "Other",
]

// ============================================
// STATE MANAGEMENT
// ============================================
const state = {
  imageFile: null,
  voiceBlob: null,
  mediaRecorder: null,
  recordingStartTime: null,
  recordingInterval: null,
  isRecording: false,
  isSubmitting: false,
  selectedCategories: [],
}

// ============================================
// INTERACTIVE LIQUID BACKGROUND
// ============================================
function createInteractiveLiquidBackground() {
  const orbs = document.querySelectorAll(".gradient-orb")
  let mouseX = window.innerWidth / 2
  let mouseY = window.innerHeight / 2
  let targetX = mouseX
  let targetY = mouseY

  document.addEventListener("mousemove", (e) => {
    targetX = e.clientX
    targetY = e.clientY
  })

  // Smooth animation loop for fluid motion
  function animateOrbsTowardsMouse() {
    mouseX += (targetX - mouseX) * 0.02
    mouseY += (targetY - mouseY) * 0.02

    const x = mouseX / window.innerWidth
    const y = mouseY / window.innerHeight

    orbs.forEach((orb, index) => {
      const speed = 25 + index * 12
      const moveX = (x - 0.5) * speed
      const moveY = (y - 0.5) * speed

      orb.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`
    })

    requestAnimationFrame(animateOrbsTowardsMouse)
  }

  animateOrbsTowardsMouse()

  // Mobile touch support with fluid motion
  document.addEventListener("touchmove", (e) => {
    const touch = e.touches[0]
    targetX = touch.clientX
    targetY = touch.clientY
  })

  // Gentle reset on mouse leave
  document.addEventListener("mouseleave", () => {
    targetX = window.innerWidth / 2
    targetY = window.innerHeight / 2
  })

  // Handle window resize
  window.addEventListener("resize", () => {
    targetX = window.innerWidth / 2
    targetY = window.innerHeight / 2
  })
}

// ============================================
// PARTICLE ANIMATION
// ============================================
function createParticles() {
  const container = document.getElementById("particles")
  const particleCount = window.innerWidth < 768 ? 25 : 40

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div")
    particle.className = "particle"

    const x = Math.random() * window.innerWidth
    const y = Math.random() * window.innerHeight
    const duration = 6 + Math.random() * 12
    const delay = Math.random() * 5
    const tx = (Math.random() - 0.5) * 250

    particle.style.left = x + "px"
    particle.style.top = y + "px"
    particle.style.setProperty("--tx", tx + "px")
    particle.style.animationDuration = duration + "s"
    particle.style.animationDelay = delay + "s"

    container.appendChild(particle)

    setTimeout(
      () => {
        particle.remove()
      },
      (duration + delay) * 1000,
    )
  }

  setTimeout(createParticles, 3000)
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast(message, type = "info", duration = 3000) {
  const container = document.getElementById("toastContainer")
  const toast = document.createElement("div")
  toast.className = `toast ${type}`

  const icons = {
    success: "✅",
    error: "❌",
    info: "ℹ️",
  }

  toast.innerHTML = `
        <span class="toast-icon">${icons[type]}</span>
        <span>${message}</span>
    `

  container.appendChild(toast)

  setTimeout(() => {
    toast.style.animation = "slideInRight 0.4s ease-out reverse"
    setTimeout(() => toast.remove(), 400)
  }, duration)
}

// ============================================
// CATEGORY SELECTION
// ============================================
const categoryInput = document.getElementById("categoryInput")
const categorySuggestions = document.getElementById("categorySuggestions")
const selectedCategoriesContainer = document.getElementById("selectedCategories")
const categoryHidden = document.getElementById("categoryHidden")
const customCategoryGroup = document.getElementById("customCategoryGroup")
const customCategoryInput = document.getElementById("customCategory")

// Show suggestions when input is focused or has value
categoryInput.addEventListener("focus", () => {
  updateCategorySuggestions("")
})

// Filter suggestions as user types
categoryInput.addEventListener("input", (e) => {
  updateCategorySuggestions(e.target.value)
})

// Hide suggestions when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".category-input-wrapper")) {
    categorySuggestions.classList.remove("active")
  }
})

function updateCategorySuggestions(searchTerm) {
  const filtered = CATEGORY_OPTIONS.filter(
    (cat) => cat.toLowerCase().includes(searchTerm.toLowerCase()) && !state.selectedCategories.includes(cat),
  )

  categorySuggestions.innerHTML = filtered
    .map(
      (cat) => `
    <div class="category-suggestion" data-category="${cat}">
      ${cat}
    </div>
  `,
    )
    .join("")

  if (filtered.length > 0) {
    categorySuggestions.classList.add("active")
  } else {
    categorySuggestions.classList.remove("active")
  }

  // Add click handlers to suggestions
  document.querySelectorAll(".category-suggestion").forEach((el) => {
    el.addEventListener("click", () => {
      const category = el.dataset.category
      addCategory(category)
      categoryInput.value = ""
      updateCategorySuggestions("")
    })
  })
}

function addCategory(category) {
  if (!state.selectedCategories.includes(category)) {
    state.selectedCategories.push(category)
    renderSelectedCategories()
    updateCategoryHidden()

    // Show custom input if "Other" is selected
    if (category === "Other") {
      customCategoryGroup.style.display = "block"
    }
  }
}

function removeCategory(category) {
  state.selectedCategories = state.selectedCategories.filter((c) => c !== category)
  renderSelectedCategories()
  updateCategoryHidden()

  // Hide custom input if "Other" is removed
  if (category === "Other") {
    customCategoryGroup.style.display = "none"
    customCategoryInput.value = ""
  }
}

function renderSelectedCategories() {
  selectedCategoriesContainer.innerHTML = state.selectedCategories
    .map(
      (cat) => `
    <div class="category-chip">
      <span>${cat}</span>
      <button type="button" aria-label="Remove ${cat}">×</button>
    </div>
  `,
    )
    .join("")

  // Add click handlers to remove buttons
  document.querySelectorAll(".category-chip button").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault()
      const category = btn.parentElement.querySelector("span").textContent
      removeCategory(category)
    })
  })
}

function updateCategoryHidden() {
  let categoryValue = state.selectedCategories.join(", ")

  // Include custom category if "Other" is selected
  if (state.selectedCategories.includes("Other") && customCategoryInput.value.trim()) {
    categoryValue = categoryValue.replace("Other", `Other: ${customCategoryInput.value.trim()}`)
  }

  categoryHidden.value = categoryValue
}

// Update hidden field when custom category changes
customCategoryInput.addEventListener("input", () => {
  updateCategoryHidden()
})

// ============================================
// CHARACTER COUNT
// ============================================
document.getElementById("description").addEventListener("input", (e) => {
  const count = e.target.value.length
  document.getElementById("charCount").textContent = Math.min(count, 500)

  if (count > 500) {
    e.target.value = e.target.value.substring(0, 500)
  }
})

// ============================================
// LOCATION CAPTURE
// ============================================
document.getElementById("captureLocation").addEventListener("click", async (e) => {
  e.preventDefault()
  const btn = e.target.closest("button")
  const statusEl = document.getElementById("locationStatus")
  const displayEl = document.getElementById("locationDisplay")
  const addressInput = document.getElementById("addressInput")
  const descriptionField = document.getElementById("description")

  btn.disabled = true
  statusEl.textContent = "Capturing..."

  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      })
    })

    const { latitude, longitude } = position.coords
    document.getElementById("latitude").value = latitude
    document.getElementById("longitude").value = longitude

    // Reverse geocoding using Nominatim API
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
    )
    const data = await response.json()
    const address = data.address?.city || data.address?.town || data.address?.county || "Location captured"

    addressInput.value = address
    addressInput.readOnly = true
    addressInput.style.opacity = "0.6"
    addressInput.style.cursor = "not-allowed"

    displayEl.innerHTML = `
            <div class="preview-item">
                <span>📍 ${address}</span>
                <span style="font-size: 0.75rem; color: #707070;">${latitude.toFixed(4)}, ${longitude.toFixed(4)}</span>
            </div>
        `

    const locationText = `\n📍 Location: ${address} (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`
    descriptionField.value = descriptionField.value.trim() + locationText

    // Update character count
    document.getElementById("charCount").textContent = Math.min(descriptionField.value.length, 500)

    statusEl.textContent = "✅ Location captured"
    showToast("Location captured and added to description ✅", "success")
  } catch (error) {
    console.error("Location error:", error)
    statusEl.textContent = "❌ Failed to capture location"
    showToast("Failed to capture location. Please try again.", "error")
  } finally {
    btn.disabled = false
  }
})

// ============================================
// IMAGE UPLOAD
// ============================================
const imageUploadArea = document.getElementById("imageUploadArea")
const imageInput = document.getElementById("imageInput")

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB

imageUploadArea.addEventListener("click", () => imageInput.click())

imageUploadArea.addEventListener("dragover", (e) => {
  e.preventDefault()
  imageUploadArea.classList.add("dragover")
})

imageUploadArea.addEventListener("dragleave", () => {
  imageUploadArea.classList.remove("dragover")
})

imageUploadArea.addEventListener("drop", (e) => {
  e.preventDefault()
  imageUploadArea.classList.remove("dragover")

  const files = e.dataTransfer.files
  if (files.length > 0) {
    handleImageSelect(files[0])
  }
})

imageInput.addEventListener("change", (e) => {
  if (e.target.files.length > 0) {
    handleImageSelect(e.target.files[0])
  }
})

function handleImageSelect(file) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    showToast("Please select a valid image file (JPG, PNG, WebP, or GIF)", "error")
    return
  }

  if (file.size > MAX_IMAGE_SIZE) {
    showToast("Image must be less than 10MB", "error")
    return
  }

  state.imageFile = file

  // Show preview
  const reader = new FileReader()
  reader.onload = (e) => {
    const preview = document.getElementById("imagePreview")
    preview.innerHTML = `
            <div class="preview-item">
                <img src="${e.target.result}" alt="Preview">
                <span>${file.name}</span>
                <button type="button" class="remove-btn" onclick="removeImage()">Remove</button>
            </div>
        `
  }
  reader.readAsDataURL(file)
}

function removeImage() {
  state.imageFile = null
  document.getElementById("imageInput").value = ""
  document.getElementById("imagePreview").innerHTML = ""
  document.getElementById("imageUrl").value = ""
}

// ============================================
// VOICE RECORDING
// ============================================
const recordBtn = document.getElementById("recordBtn")
const recordingTime = document.getElementById("recordingTime")
const voiceStatus = document.getElementById("voiceStatus")

recordBtn.addEventListener("click", async (e) => {
  e.preventDefault()

  if (!state.isRecording) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      state.mediaRecorder = new MediaRecorder(stream)
      const chunks = []

      state.mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
      state.mediaRecorder.onstop = () => {
        state.voiceBlob = new Blob(chunks, { type: "audio/webm" })
        displayVoicePreview()
        stream.getTracks().forEach((track) => track.stop())
      }

      state.mediaRecorder.start()
      state.isRecording = true
      state.recordingStartTime = Date.now()

      recordBtn.textContent = "⏹️ Stop Recording"
      recordBtn.style.background = "rgba(255, 107, 107, 0.2)"
      recordBtn.style.borderColor = "rgba(255, 107, 107, 0.5)"
      recordBtn.style.color = "#ff6b6b"

      // Update recording time
      state.recordingInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - state.recordingStartTime) / 1000)
        recordingTime.textContent = `${elapsed}s`
      }, 100)

      voiceStatus.textContent = "Recording..."
    } catch (error) {
      console.error("Microphone error:", error)
      showToast("Failed to access microphone", "error")
    }
  } else {
    state.mediaRecorder.stop()
    state.isRecording = false
    clearInterval(state.recordingInterval)

    recordBtn.textContent = "🎤 Start Recording"
    recordBtn.style.background = ""
    recordBtn.style.borderColor = ""
    recordBtn.style.color = ""
    recordingTime.textContent = ""
    voiceStatus.textContent = "✅ Recording ready"

    showToast("Voice note recorded ✅", "success")
  }
})

function displayVoicePreview() {
  const preview = document.getElementById("voicePreview")
  const url = URL.createObjectURL(state.voiceBlob)

  preview.innerHTML = `
        <div class="preview-item">
            <audio controls src="${url}" style="max-width: 200px; height: 30px;"></audio>
            <button type="button" class="remove-btn" onclick="removeVoice()">Remove</button>
        </div>
    `
}

function removeVoice() {
  state.voiceBlob = null
  document.getElementById("voicePreview").innerHTML = ""
  document.getElementById("voiceUrl").value = ""
  voiceStatus.textContent = ""
}

// ============================================
// CLOUDINARY UPLOAD
// ============================================
async function uploadToCloudinary(file, resourceType = "image") {
  if (!CLOUDINARY_CLOUD_NAME || CLOUDINARY_CLOUD_NAME === "YOUR_CLOUD_NAME") {
    showToast("Cloudinary not configured. Please add your credentials.", "error")
    return null
  }

  if (!CLOUDINARY_UPLOAD_PRESET || CLOUDINARY_UPLOAD_PRESET === "YOUR_UPLOAD_PRESET_HERE") {
    showToast("Cloudinary upload preset not configured. Please add your preset.", "error")
    return null
  }

  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)
  formData.append("resource_type", resourceType)

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) throw new Error("Upload failed")
    const data = await response.json()
    return data.secure_url
  } catch (error) {
    console.error("Cloudinary upload error:", error)
    showToast("Failed to upload file. Please try again.", "error")
    return null
  }
}

async function uploadTextToCloudinary(text, filename = "report-description.txt") {
  if (!CLOUDINARY_CLOUD_NAME || CLOUDINARY_CLOUD_NAME === "YOUR_CLOUD_NAME") {
    return null
  }

  if (!CLOUDINARY_UPLOAD_PRESET || CLOUDINARY_UPLOAD_PRESET === "YOUR_UPLOAD_PRESET_HERE") {
    return null
  }

  try {
    // Convert text to Blob and upload
    const blob = new Blob([text], { type: "text/plain" })
    const file = new File([blob], filename, { type: "text/plain" })

    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)
    formData.append("resource_type", "raw")

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) throw new Error("Upload failed")
    const data = await response.json()
    return data.secure_url
  } catch (error) {
    console.error("Text upload error:", error)
    return null
  }
}

async function uploadAllUserInputToCloudinary(formData) {
  const name = formData.get("entry.200562054") || ""
  const email = formData.get("entry.1045781291") || ""
  const address = formData.get("entry.1865946570") || ""
  const phone = formData.get("entry.1166974658") || ""
  const category = formData.get("entry.864556991") || ""
  const description = formData.get("entry.839337160") || ""

  // Compile all text input into a single document
  const allTextContent = `
=== REPORT SUBMISSION ===
Date: ${new Date().toISOString()}

--- REPORTER INFORMATION ---
Name: ${name}
Email: ${email}
Phone: ${phone}
Address: ${address}

--- REPORT DETAILS ---
Category: ${category}

Description:
${description}
=========================
  `.trim()

  // Upload the compiled text to Cloudinary
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
  const textUrl = await uploadTextToCloudinary(allTextContent, `report-all-text-${timestamp}.txt`)

  return textUrl
}

// ============================================
// FORM SUBMISSION
// ============================================
document.getElementById("reportForm").addEventListener("submit", async (e) => {
  e.preventDefault()

  const submitBtn = document.getElementById("submitBtn")
  const name = document.getElementById("name").value.trim()
  const email = document.getElementById("email").value.trim()
  const addressInput = document.getElementById("addressInput").value.trim()
  const phone = document.getElementById("phone").value.trim()
  const description = document.getElementById("description").value.trim()

  // Validate required fields
  if (!name || !email || !addressInput || !phone || !description || state.selectedCategories.length === 0) {
    showToast("Please fill in all required fields and select at least one category", "error")
    return
  }

  if (state.isSubmitting) return

  state.isSubmitting = true
  submitBtn.classList.add("loading")
  submitBtn.disabled = true

  try {
    let imageUrl = ""
    let voiceUrl = ""
    let allTextUrl = ""

    showToast("Uploading report data...", "info")
    const googleFormData = new FormData()
    googleFormData.append("entry.200562054", name)
    googleFormData.append("entry.1045781291", email)
    googleFormData.append("entry.1865946570", addressInput)
    googleFormData.append("entry.1166974658", phone)
    googleFormData.append("entry.864556991", categoryHidden.value)
    googleFormData.append("entry.839337160", description)

    // Upload all text to Cloudinary
    allTextUrl = await uploadAllUserInputToCloudinary(googleFormData)
    if (allTextUrl) {
      showToast("Report data saved to Cloudinary ✅", "success")
    }

    if (state.imageFile) {
      showToast("Uploading image...", "info")
      imageUrl = await uploadToCloudinary(state.imageFile, "image")
      if (!imageUrl) throw new Error("Image upload failed")
    }

    if (state.voiceBlob) {
      showToast("Uploading voice note...", "info")
      const voiceFile = new File([state.voiceBlob], "voice-note.webm", { type: "audio/webm" })
      voiceUrl = await uploadToCloudinary(voiceFile, "video")
      if (!voiceUrl) throw new Error("Voice upload failed")
    }

    // Get category value
    const categoryValue = categoryHidden.value

    // Prepare Google Form submission
    const finalGoogleFormData = new FormData()
    finalGoogleFormData.append("entry.200562054", name)
    finalGoogleFormData.append("entry.1045781291", email)
    finalGoogleFormData.append("entry.1865946570", addressInput)
    finalGoogleFormData.append("entry.1166974658", phone)
    finalGoogleFormData.append("entry.864556991", categoryValue)
    finalGoogleFormData.append("entry.839337160", description)
    if (imageUrl) finalGoogleFormData.append("entry.2078825004", imageUrl)
    if (voiceUrl) finalGoogleFormData.append("entry.252249321", voiceUrl)
    if (allTextUrl) finalGoogleFormData.append("entry.2078825004", `Cloudinary: ${allTextUrl}`)

    const response = await fetch(GOOGLE_FORM_URL, {
      method: "POST",
      body: finalGoogleFormData,
      mode: "no-cors",
    })

    // Success
    showToast("Report submitted successfully ✅", "success")
    document.getElementById("reportForm").reset()
    state.imageFile = null
    state.voiceBlob = null
    state.selectedCategories = []
    document.getElementById("imagePreview").innerHTML = ""
    document.getElementById("voicePreview").innerHTML = ""
    document.getElementById("locationDisplay").innerHTML = ""
    document.getElementById("addressInput").readOnly = false
    document.getElementById("addressInput").style.opacity = "1"
    document.getElementById("addressInput").style.cursor = "auto"
    document.getElementById("charCount").textContent = "0"
    selectedCategoriesContainer.innerHTML = ""
    customCategoryGroup.style.display = "none"
    customCategoryInput.value = ""
  } catch (error) {
    console.error("Submission error:", error)
    showToast("Failed to submit report. Please try again.", "error")
  } finally {
    state.isSubmitting = false
    submitBtn.classList.remove("loading")
    submitBtn.disabled = false
  }
})

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  createParticles()
  createInteractiveLiquidBackground()

  // Show info toast on load
  setTimeout(() => {
    showToast("Welcome to ReportIT - Your report will help keep the community safe", "info", 4000)
  }, 500)
})
