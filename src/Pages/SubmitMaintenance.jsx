/**
 * Submit Maintenance Page
 * 
 * Dedicated form for landlords to submit a maintenance task.
 * This is separate from the tenant-facing Report Issue page.
 * 
 * Form fields:
 * - Issue Title
 * - Unit / House Number
 * - Category
 * - Urgency Level
 * - Detailed Description
 * 
 * On submit:
 * - Displays confirmation or error message
 * - Clears the form fields
 */

import React, { useState } from 'react'

function SubmitMaintenance() {
  const [formData, setFormData] = useState({
    title: '',
    category: 'maintenance',
    description: '',
    urgency: 'medium',
    unitNumber: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSubmitStatus('success')
      setFormData({
        title: '',
        category: 'maintenance',
        description: '',
        urgency: 'medium',
        unitNumber: '',
      })
    } catch (error) {
      console.error(error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900">Submit a Maintenance Request</h2>
          <p className="text-slate-600 mt-1">
            Log a new maintenance task for your property and inform the maintenance team.
          </p>
        </div>

        {submitStatus === 'success' && (
          <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
            <div className="font-semibold">Maintenance request submitted successfully!</div>
            <div className="text-sm opacity-90">
              The maintenance team will review this request shortly.
            </div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
            <div className="font-semibold">Something went wrong</div>
            <div className="text-sm opacity-90">Please try submitting the request again.</div>
          </div>
        )}

        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-slate-700">
                Request Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Replace broken entry light"
                required
                className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="unitNumber" className="block text-sm font-semibold text-slate-700">
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
                <label htmlFor="category" className="block text-sm font-semibold text-slate-700">
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
                  <option value="garbage">Garbage and Cleanliness</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="urgency" className="block text-sm font-semibold text-slate-700">
                Urgency Level
              </label>
              <select
                name="urgency"
                id="urgency"
                value={formData.urgency}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="low">Low (General maintenance)</option>
                <option value="medium">Medium (Fix within 24-48 hours)</option>
                <option value="high">High (Urgent repair needed)</option>
                <option value="emergency">Emergency (Safety or major damage)</option>
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-slate-700">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe exactly what needs to be fixed or inspected."
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
              {isSubmitting ? 'Submitting...' : 'Submit Maintenance Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SubmitMaintenance
