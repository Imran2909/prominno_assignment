import { ImagePlus, Plus, Trash2 } from 'lucide-react';
import { type ChangeEvent, type FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../api/client';
import { createProduct, type CreateProductPayload } from '../api/productApi';
import type { Brand } from '../types/api';
import { fileToBase64 } from '../utils/fileToBase64';

const emptyBrand = (): Brand => ({
  brandName: '',
  detail: '',
  image: '',
  price: 0
});

const initialForm: CreateProductPayload = {
  productName: '',
  productDescription: '',
  brands: [emptyBrand()]
};

const maxBrands = 20;
const maxPrice = 10_000_000;

const validateProductForm = (form: CreateProductPayload): string | null => {
  if (form.productName.trim().length < 2 || form.productName.trim().length > 120) {
    return 'Product name must contain 2 to 120 characters';
  }

  if (form.productDescription.trim().length < 2 || form.productDescription.trim().length > 1000) {
    return 'Product description must contain 2 to 1000 characters';
  }

  if (form.brands.length === 0) {
    return 'At least one brand is required';
  }

  if (form.brands.length > maxBrands) {
    return `A product can have at most ${maxBrands} brands`;
  }

  for (const [index, brand] of form.brands.entries()) {
    const brandNumber = index + 1;

    if (brand.brandName.trim().length < 2 || brand.brandName.trim().length > 100) {
      return `Brand #${brandNumber} name must contain 2 to 100 characters`;
    }

    if (brand.detail.trim().length < 2 || brand.detail.trim().length > 1000) {
      return `Brand #${brandNumber} detail must contain 2 to 1000 characters`;
    }

    if (!brand.image) {
      return `Brand #${brandNumber} image is required`;
    }

    if (!Number.isFinite(brand.price) || brand.price <= 0 || brand.price > maxPrice) {
      return `Brand #${brandNumber} price must be between 1 and ${maxPrice}`;
    }
  }

  return null;
};

export function ProductFormPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<CreateProductPayload>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateProductField = (field: 'productName' | 'productDescription', value: string): void => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateBrand = (index: number, field: keyof Brand, value: string | number): void => {
    setForm((current) => ({
      ...current,
      brands: current.brands.map((brand, brandIndex) =>
        brandIndex === index ? { ...brand, [field]: value } : brand
      )
    }));
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>, index: number): Promise<void> => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const image = await fileToBase64(file);
      updateBrand(index, 'image', image);
    } catch (error) {
      toast.error(getErrorMessage(error));
      event.target.value = '';
    }
  };

  const addBrand = (): void => {
    if (form.brands.length >= maxBrands) {
      toast.error(`A product can have at most ${maxBrands} brands`);
      return;
    }

    setForm((current) => ({ ...current, brands: [...current.brands, emptyBrand()] }));
  };

  const removeBrand = (index: number): void => {
    if (form.brands.length === 1) {
      toast.error('At least one brand is required');
      return;
    }

    setForm((current) => ({
      ...current,
      brands: current.brands.filter((_brand, brandIndex) => brandIndex !== index)
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const validationError = validateProductForm(form);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      await createProduct({
        productName: form.productName.trim(),
        productDescription: form.productDescription.trim(),
        brands: form.brands.map((brand) => ({
          ...brand,
          brandName: brand.brandName.trim(),
          detail: brand.detail.trim()
        }))
      });
      toast.success('Product created successfully');
      navigate('/seller/products');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="page-stack">
      <div className="section-title">Add Product</div>

      <form className="form-panel" onSubmit={handleSubmit}>
        <div className="form-section">
          <label className="field">
            <span>Product Name</span>
            <input
              value={form.productName}
              onChange={(event) => updateProductField('productName', event.target.value)}
              placeholder="Product Name"
              required
            />
          </label>

          <label className="field">
            <span>Product Description</span>
            <textarea
              value={form.productDescription}
              onChange={(event) => updateProductField('productDescription', event.target.value)}
              placeholder="Description"
              rows={4}
              required
            />
          </label>
        </div>

        <div className="brand-heading">
          <h2>Brands (Multiple)</h2>
          <button type="button" className="success-button" onClick={addBrand}>
            <Plus size={15} />
            Add Brand
          </button>
        </div>

        {form.brands.map((brand, index) => (
          <div className="brand-card" key={index}>
            <div className="brand-card-title">
              <h3>Brand #{index + 1}</h3>
              {form.brands.length > 1 && (
                <button type="button" className="danger-icon" onClick={() => removeBrand(index)} aria-label="Remove brand">
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            <div className="form-grid">
              <label className="field">
                <span>Brand Name</span>
                <input
                  value={brand.brandName}
                  onChange={(event) => updateBrand(index, 'brandName', event.target.value)}
                  placeholder="Enter brand name"
                  required
                />
              </label>

              <label className="field">
                <span>Price</span>
                <input
                  value={brand.price || ''}
                  onChange={(event) => updateBrand(index, 'price', Number(event.target.value))}
                  type="number"
                  min={1}
                  max={maxPrice}
                  step="0.01"
                  placeholder="Rs. 0/-"
                  required
                />
              </label>
            </div>

            <label className="field">
              <span>Detail</span>
              <textarea
                value={brand.detail}
                onChange={(event) => updateBrand(index, 'detail', event.target.value)}
                placeholder="Enter brand details"
                rows={3}
                required
              />
            </label>

            <label className="drop-zone">
              {brand.image ? (
                <img src={brand.image} alt={`${brand.brandName || 'Brand'} preview`} />
              ) : (
                <>
                  <ImagePlus size={40} />
                  <strong>Drag and drop files here</strong>
                  <span>or click to browse</span>
                </>
              )}
              <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={(event) => void handleImageChange(event, index)} required={!brand.image} />
            </label>
          </div>
        ))}

        <div className="form-actions">
          <button type="button" className="danger-button" onClick={() => navigate('/seller/products')}>
            Back
          </button>
          <button type="submit" className="primary-button purple" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </section>
  );
}
