# Image Upload Setup Instructions

This project now includes image upload functionality using Supabase Storage for both Products and Grains.

## Setup Steps

### 1. Supabase Configuration

1. Create a Supabase project if you haven't already: https://supabase.com
2. Go to your Supabase project dashboard
3. Copy your project URL and anon key from Settings → API
4. Create a `.env` file in the root directory and add:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Create Storage Buckets

In your Supabase project dashboard:

1. Go to Storage → Buckets
2. Create two buckets:
   - `products` - for product images
   - `grains` - for grain images

### 3. Configure Storage Policies (Step-by-Step)

**IMPORTANT**: You need to set up Row Level Security (RLS) policies for your storage buckets to allow public access to images and enable uploads.

#### Step-by-Step Policy Setup:

1. **Go to Supabase Dashboard** → Storage → Buckets
2. **For each bucket** (`products` and `grains`), click on the bucket name
3. **Click on the "Configuration" tab** in the bucket details
4. **Make sure "Public bucket" is ENABLED** (this is crucial for public image access)
5. **Go to "Policies" tab**
6. **Click "New Policy"**

#### Required Policies for Each Bucket:

**Policy 1: Public Read Access (SELECT)**

- Policy Name: `Public Read Access`
- Operation: `SELECT`
- Target Role: `public`
- Using Expression: `true` (or leave empty)
- Click "Create Policy"

**Policy 2: Public Upload Access (INSERT)**

- Policy Name: `Public Upload Access`
- Operation: `INSERT`
- Target Role: `public`
- With Check Expression: `true` (or leave empty)
- Click "Create Policy"

**Policy 3: Public Delete Access (DELETE)**

- Policy Name: `Public Delete Access`
- Operation: `DELETE`
- Target Role: `public`
- Using Expression: `true` (or leave empty)
- Click "Create Policy"

#### Alternative SQL Commands (if you prefer SQL):

If you want to use SQL commands instead, go to SQL Editor in your Supabase dashboard and run:

```sql
-- Enable RLS on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policies for 'products' bucket
CREATE POLICY "Public Access for products" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "Public Upload for products" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products');
CREATE POLICY "Public Delete for products" ON storage.objects FOR DELETE USING (bucket_id = 'products');

-- Policies for 'grains' bucket
CREATE POLICY "Public Access for grains" ON storage.objects FOR SELECT USING (bucket_id = 'grains');
CREATE POLICY "Public Upload for grains" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'grains');
CREATE POLICY "Public Delete for grains" ON storage.objects FOR DELETE USING (bucket_id = 'grains');
```

#### Verify Your Setup:

1. Make sure both buckets show as "Public" in the Storage dashboard
2. Test by uploading an image through your form
3. Check if the image URL is accessible in a new browser tab

### 4. Features

- **Square Image Processing**: All uploaded images are automatically cropped and resized to square format (400x400px by default)
- **Image Preview**: Real-time preview of selected images before upload
- **File Validation**: Validates file type (images only) and size (max 5MB)
- **Compression**: Images are compressed to optimize storage and loading times
- **Delete Functionality**: Can remove uploaded images from both the form and storage

### 5. Usage

The image upload component is now integrated into both:

- **GrainForm**: Located in the grains bucket under `grain-images/` folder
- **ProductForm**: Located in the products bucket under `product-images/` folder

Both forms will save the Supabase public URL to the database `image` field.

### 6. Backend Updates Required

Make sure your backend API endpoints can handle the `image` field for both products and grains:

```javascript
// Example for product creation/update
{
  name: "Product Name",
  description: "Product Description",
  price: 29.99,
  categoryId: 1,
  image: "https://supabase-url/storage/v1/object/public/products/product-images/image.jpg",
  isActive: true
}

// Example for grain creation/update
{
  name: "Grain Name",
  description: "Grain Description",
  price: 15.99,
  stock: 100,
  image: "https://supabase-url/storage/v1/object/public/grains/grain-images/image.jpg",
  isActive: true
}
```

The image URLs will be automatically handled by the frontend forms and stored in your database.
