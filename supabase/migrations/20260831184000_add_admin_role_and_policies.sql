-- 1. Create Admin RLS policies to bypass standard user restrictions
-- Note: These policies look for the 'is_admin' flag inside the user's secure JWT token.
-- To grant a user admin rights, run this in the Supabase SQL Editor:
-- update auth.users set raw_app_meta_data = raw_app_meta_data || json_build_object('is_admin', true)::jsonb where email = 'owner@email.com';

-- Profiles: Admins can read and update all profiles
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
CREATE POLICY "Admins can read all profiles" ON public.profiles
    FOR SELECT
    TO authenticated
    USING ( (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true );

DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles" ON public.profiles
    FOR UPDATE
    TO authenticated
    USING ( (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true )
    WITH CHECK ( (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true );

-- Orders: Admins can read and update all orders
DROP POLICY IF EXISTS "Admins can read all orders" ON public.orders;
CREATE POLICY "Admins can read all orders" ON public.orders
    FOR SELECT
    TO authenticated
    USING ( (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true );

DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;
CREATE POLICY "Admins can update all orders" ON public.orders
    FOR UPDATE
    TO authenticated
    USING ( (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true )
    WITH CHECK ( (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true );

-- Products, Categories, Variants, Media: Admins can do full CRUD
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products" ON public.products
    FOR ALL
    TO authenticated
    USING ( (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true )
    WITH CHECK ( (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true );

DROP POLICY IF EXISTS "Admins can manage product_categories" ON public.product_categories;
CREATE POLICY "Admins can manage product_categories" ON public.product_categories
    FOR ALL
    TO authenticated
    USING ( (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true )
    WITH CHECK ( (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true );

DROP POLICY IF EXISTS "Admins can manage product_variants" ON public.product_variants;
CREATE POLICY "Admins can manage product_variants" ON public.product_variants
    FOR ALL
    TO authenticated
    USING ( (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true )
    WITH CHECK ( (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true );

DROP POLICY IF EXISTS "Admins can manage product_media" ON public.product_media;
CREATE POLICY "Admins can manage product_media" ON public.product_media
    FOR ALL
    TO authenticated
    USING ( (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true )
    WITH CHECK ( (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true );
