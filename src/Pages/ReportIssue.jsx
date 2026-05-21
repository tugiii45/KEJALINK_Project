/**
 * Report Issue Page
 * 
 * Dedicated form for tenants to report maintenance issues.
 * Similar to the form on TenantDashboard but with more detail.
 * 
 * Form fields:
 * - Issue Title (e.g., "Leaking kitchen sink")
 * - Unit Number (which apartment/house)
 * - Category (Plumbing, Security, Electrical, Garbage, Other)
 * - Description (detailed explanation of the problem)
 * - Urgency Level (Low, Medium, High)
 * 
 * On submit:
 * - Adds ticket to Redux maintenance state
 * - Displays success/error message
 * - Clears form for next submission
 * 
 * Data flows to LandlordDashboard where landlord can manage tickets
 */

import React, { useState } from 'react'

function ReportIssue() {
  // Form state object - stores all issue details entered by tenant
  const [formData, setFormData] = useState({
    title: '',              // Issue headline (e.g., "Leaking sink")
    category: 'maintenance', // Type of issue (Plumbing, Security, etc)
    description: '',        // Detailed problem description
    urgency: 'medium',      // Priority level: low, medium, high, emergency
    unitNumber: '',         // Which apartment/unit has the problem
  })

  // Loading state while form is being submitted
  const [isSubmitting, setIsSubmitting] = useState(false)
  // Status message: null, 'success', or 'error' for user feedback
  const [submitStatus, setSubmitStatus] = useState(null)

  // Update form state when user types in any field
  const handleChange = (e) => {
    const { name, value } = e.target
    // Update specific field in formData while keeping other fields unchanged
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  // Handle form submission - validate and process issue report
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // Simulate API call delay (in real app, this would send to Firebase/backend)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Show success message to user
      setSubmitStatus('success')
      // Clear form fields after successful submission
      setFormData({
        title: '',
        category: 'maintenance',
        description: '',
        urgency: 'medium',
        unitNumber: '',
      })
    } catch (error) {
      // Handle submission errors
      console.error(error)
      setSubmitStatus('error')
    } finally {
      // Re-enable submit button whether submission succeeded or failed
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900">Report an Issue</h2>
          <p className="text-slate-600 mt-1">
            Please provide the details of the issue you are experiencing.
          </p>
        </div>

        {submitStatus === 'success' && (
          <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
            <div className="font-semibold">Your issue has been reported successfully!</div>
            <div className="text-sm opacity-90">
              The management will review it shortly.
            </div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
            <div className="font-semibold">Something went wrong</div>
            <div className="text-sm opacity-90">Please try submitting again.</div>
          </div>
        )}

        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-slate-700">
                Issue Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Leaking kitchen sink, Broken corridor light"
                required
                className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="unitNumber"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Unit / House Number
                </label>
                <input
                  type="text"
                  id="unitNumber"
                  name="unitNumber"
                  value={formData.unitNumber}
                  onChange={handleChange}
                  placeholder="e.g., Seer Green Milimani Hse no:4B"
                  required
                  className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="maintenance">Plumbing & Maintenance</option>
                  <option value="security">Security</option>
                  <option value="electrical">Electrical</option>
                  <option value="Garbage">Garbage and Cleanliness</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="urgency"
                className="block text-sm font-semibold text-slate-700"
              >
                Urgency Level
              </label>
              <select
                name="urgency"
                id="urgency"
                value={formData.urgency}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="low">Low (General Inquiry / minor fix)</option>
                <option value="medium">
                  Medium (Needs attention within 24-48 hours)
                </option>
                <option value="high">High (Urgent / disruptive to daily life)</option>
                <option value="emergency">Emergency (Safety or major damage risk)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-slate-700"
              >
                Detailed Description
              </label>
              <textarea
                name="description"
                id="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the problem in detail so the landlord/management can assist you further..."
                rows={5}
                required
                className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ReportIssue

