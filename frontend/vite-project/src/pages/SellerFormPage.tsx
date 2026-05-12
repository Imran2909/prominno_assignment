import { type ChangeEvent, type FormEvent, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { createSeller, type CreateSellerPayload } from '../api/adminApi';
import { getErrorMessage } from '../api/client';
import { fileToBase64 } from '../utils/fileToBase64';

const countryOptions = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia'];
const stateOptions = ['Maharashtra', 'Gujarat', 'Delhi', 'Karnataka', 'Tamil Nadu'];

const initialForm: CreateSellerPayload = {
  name: '',
  profileImage: '',
  gender: 'others',
  email: '',
  mobileNo: '',
  country: '',
  state: '',
  skills: [''],
  password: '',
  confirmPassword: ''
};

export function SellerFormPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<CreateSellerPayload>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const steps = useMemo(() => ['Personal Information', 'Details', 'Skills Details', 'Credential Details'], []);

  const updateField = (field: keyof CreateSellerPayload, value: string): void => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateSkill = (index: number, value: string): void => {
    setForm((current) => ({
      ...current,
      skills: current.skills.map((skill, skillIndex) => (skillIndex === index ? value : skill))
    }));
  };

  const addSkill = (): void => {
    setForm((current) => ({ ...current, skills: [...current.skills, ''] }));
  };

  const removeSkill = (index: number): void => {
    setForm((current) => ({
      ...current,
      skills: current.skills.length === 1 ? [''] : current.skills.filter((_skill, skillIndex) => skillIndex !== index)
    }));
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      updateField('profileImage', await fileToBase64(file));
    } catch {
      toast.error('Unable to read profile image');
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (step < 4) {
      setStep((current) => current + 1);
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error('Confirm password must match password');
      return;
    }

    setIsSubmitting(true);

    try {
      await createSeller({
        ...form,
        skills: form.skills.map((skill) => skill.trim()).filter(Boolean)
      });
      toast.success('Seller created successfully');
      navigate('/admin/sellers');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="page-stack">
      <div className="section-title">Stepper Form</div>

      <form className="form-panel" onSubmit={handleSubmit}>
        <div className="stepper">
          {steps.map((label, index) => {
            const number = index + 1;
            const isComplete = number < step;
            return (
              <div className="step" key={label}>
                <span className={number <= step ? 'step-dot active' : 'step-dot'}>{isComplete ? '✓' : number}</span>
                <small>{label}</small>
              </div>
            );
          })}
        </div>

        {step === 1 && (
          <div className="form-section">
            <h2>Personal Details</h2>

            <label className="profile-uploader">
              <span>Profile Image</span>
              {form.profileImage ? <img src={form.profileImage} alt="Profile preview" /> : <span className="profile-preview" />}
              <span className="upload-button">Upload Image</span>
              <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={(event) => void handleImageChange(event)} required={!form.profileImage} />
            </label>

            <div className="personal-row">
              <label className="field">
                <span>Name</span>
                <input
                  value={form.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  placeholder="Name"
                  required
                />
              </label>

              <fieldset className="radio-field">
                <legend>Gender</legend>
                {(['male', 'female', 'others'] as const).map((gender) => (
                  <label key={gender}>
                    <input
                      type="radio"
                      name="gender"
                      value={gender}
                      checked={form.gender === gender}
                      onChange={() => updateField('gender', gender)}
                    />
                    <span>{gender === 'others' ? 'Others' : gender[0].toUpperCase() + gender.slice(1)}</span>
                  </label>
                ))}
              </fieldset>
            </div>

            <label className="field half-width">
              <span>Phone Numbers</span>
              <input
                value={form.mobileNo}
                onChange={(event) => updateField('mobileNo', event.target.value)}
                inputMode="numeric"
                placeholder="Phone Number"
                required
              />
            </label>
          </div>
        )}

        {step === 2 && (
          <div className="form-section">
            <h2>Details</h2>
            <div className="form-grid">
              <label className="field">
                <span>Select Country</span>
                <select value={form.country} onChange={(event) => updateField('country', event.target.value)} required>
                  <option value="">Select country</option>
                  {countryOptions.map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Select State</span>
                <select value={form.state} onChange={(event) => updateField('state', event.target.value)} required>
                  <option value="">Select state</option>
                  {stateOptions.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-section">
            <h2>Skills Details</h2>
            <label className="field">
              <span>Skills</span>
              <div className="skill-lines">
                {form.skills.map((skill, index) => (
                  <div className="skill-line" key={index}>
                    <input
                      value={skill}
                      onChange={(event) => updateSkill(index, event.target.value)}
                      placeholder="Add Skills"
                      required
                    />
                    <button type="button" className="danger-button" onClick={() => removeSkill(index)}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </label>
            <button type="button" className="primary-button add-skill-button" onClick={addSkill}>
              Add Skills
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="form-section">
            <h2>Credential Details</h2>
            <div className="form-grid">
              <label className="field">
                <span>Email</span>
                <input
                  value={form.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  type="email"
                  placeholder="Email"
                  required
                />
              </label>
              <label className="field">
                <span>Password</span>
                <input
                  value={form.password}
                  onChange={(event) => updateField('password', event.target.value)}
                  type="password"
                  minLength={6}
                  placeholder="Password"
                  required
                />
              </label>
              <label className="field">
                <span>Confirm Password</span>
                <input
                  value={form.confirmPassword}
                  onChange={(event) => updateField('confirmPassword', event.target.value)}
                  type="password"
                  minLength={6}
                  placeholder="Confirm Password"
                  required
                />
              </label>
            </div>
          </div>
        )}

        <div className="form-actions">
          <button type="button" className="danger-button" onClick={() => (step === 1 ? navigate('/admin/sellers') : setStep(step - 1))}>
            Back
          </button>
          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {step === 4 ? (isSubmitting ? 'Submitting...' : 'Submit') : 'Next'}
          </button>
        </div>
      </form>
    </section>
  );
}
