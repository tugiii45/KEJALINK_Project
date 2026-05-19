import React, { useState } from 'react'

function ReportIssue() {

  
    const[formData, setFormData] = useState({
      title: '',
      category: 'maintenance',  // default category
      description: '',
      urgency: 'medium',
      unitNumber: '',

    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [submitStatus, setSubmitStatus] = useState(null);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,

      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      setSubmitStatus(null);
      try {
        console.log('Submitting issue:', formData);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        setSubmitStatus('success');

        //Reset form data on success
        setFormData({
          title: '',
          category: 'maintenance',  // default category
          description: '',
          urgency: 'medium',
          unitNumber: '',
        });
      } catch (error) {
        console.error(error);
        setSubmitStatus('error');
      } finally {
        setIsSubmitting(false);
      }
    };
  
    
    
  
  return (
    <>
    <div className='report-issue-container'>
      <h2>Report an Issue</h2>
      <p>Please provide the details of the issue you are experiencing</p>

      {submitStatus === 'success' && (<div className='alert alert success'>Your Issue has been Reported Successfully! The management will review it shortly</div>)}

      {submitStatus === 'error' && (<div className='alert alert error'>Something went wrong. Please try submitting the form again</div>)}
     
      <form onSubmit={handleSubmit} className='report-issue-form'>
        <div className='form-group'>
          <label htmlFor="title">Issue Title</label>
          <input type="text" id='title' name='title' value={formData.title} onChange={handleChange} placeholder='e.g., Leaking kitchen sink, Broken corridor light' required/>
          
        </div>

        <div className='form-row'>
          <div className='form-group'>
            <label htmlFor="unitNumber">Unit/House Number</label>
            <input type="text" id='unitNumber' name='unitNumber' value={formData.unitNumber} onChange={handleChange} placeholder='e.g Seer Green Milimani Hse no:4B' required />
          </div>

          <div className='form-group'> 
            <label htmlFor="category">Category</label>
            <select id="category" name='category' value={formData.category} onChange={handleChange}>
              <option value="maintenance">Plumbing & Maintenance</option>
              <option value="security">Security</option>
              <option value="electrical">Electrical</option>
               <option value="Garbage">Garbage and Cleanliness</option>
               <option value="other">Other</option>
            </select>
          </div>
          </div>

          <div className='form-group'>
            <label htmlFor="Urgency">Urgency Level</label>
            <select name="urgency" id="urgency" value={formData.urgency} onChange={handleChange}>

              <option value="low">Low(General Inquiry/minor fix)</option>
              <option value="medium">Medium (Needs Attention within 24-48 hours)</option>
              <option value="high">High (Urgent / Disruptive to daily life )</option>
              <option value="emergency">Emergency(Safety or major damage risk)</option>
            </select>
          </div>

          <div className='form-group'>
            <label htmlFor="description">Detailed Description</label>
            <textarea name="description" id="description" value={formData.description} onChange={handleChange} placeholder='Describe The problem in detail so the Landlord/management can assist you further...' rows={5} required/>

          </div>

          <button type="submit" className='submit-btn' disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit Report'}</button>
      </form>

    </div>
    </>
  );
}


export default ReportIssue

